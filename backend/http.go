package main

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"
)

type app struct {
	store       Store
	origin      string
	secure      bool
	mu          sync.Mutex
	loginCount  int
	loginWindow time.Time
}

func hashToken(t string) string { h := sha256.Sum256([]byte(t)); return hex.EncodeToString(h[:]) }
func token(r *http.Request) string {
	c, e := r.Cookie("portfolio_session")
	if e != nil {
		return ""
	}
	return c.Value
}
func (a *app) authenticated(r *http.Request) bool {
	t := token(r)
	if len(t) != 64 {
		return false
	}
	ok, e := a.store.Session(r.Context(), hashToken(t))
	return e == nil && ok
}
func reply(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
func fail(w http.ResponseWriter, status int, text string) {
	reply(w, status, map[string]string{"error": text})
}
func decode(w http.ResponseWriter, r *http.Request, v any) error {
	r.Body = http.MaxBytesReader(w, r.Body, 150000)
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if e := d.Decode(v); e != nil {
		return e
	}
	var extra any
	if d.Decode(&extra) != io.EOF {
		return errors.New("trailing JSON")
	}
	return nil
}
func (a *app) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Frame-Options", "DENY")
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	r = r.WithContext(ctx)
	if r.Method != "GET" && r.Header.Get("Origin") != a.origin {
		fail(w, 403, "Недопустимый источник запроса")
		return
	}
	if r.URL.Path == "/api/media" || strings.HasPrefix(r.URL.Path, "/api/media/") {
		a.media(w, r)
		return
	}
	switch r.Method + " " + r.URL.Path {
	case "GET /healthz":
		if e := a.store.Ping(ctx); e != nil {
			fail(w, 503, "Database unavailable")
			return
		}
		reply(w, 200, map[string]bool{"ok": true})
	case "GET /api/session":
		reply(w, 200, map[string]bool{"authenticated": a.authenticated(r)})
	case "GET /api/content":
		c, e := a.store.Read(ctx)
		if e != nil {
			fail(w, 503, "Содержимое временно недоступно")
			return
		}
		reply(w, 200, c)
	case "POST /api/login":
		a.mu.Lock()
		if time.Since(a.loginWindow) > time.Minute {
			a.loginWindow = time.Now()
			a.loginCount = 0
		}
		a.loginCount++
		limited := a.loginCount > 12
		a.mu.Unlock()
		if limited {
			w.Header().Set("Retry-After", "60")
			fail(w, 429, "Слишком много попыток. Повторите через минуту.")
			return
		}
		var input struct {
			Password string `json:"password"`
		}
		if decode(w, r, &input) != nil || len(input.Password) > 72 {
			fail(w, 400, "Некорректный запрос")
			return
		}
		h, e := a.store.Password(ctx)
		if e != nil {
			fail(w, 503, "Вход временно недоступен")
			return
		}
		if bcrypt.CompareHashAndPassword([]byte(h), []byte(input.Password)) != nil {
			fail(w, 401, "Неверный пароль")
			return
		}
		bytes := make([]byte, 32)
		if _, e = rand.Read(bytes); e != nil {
			fail(w, 500, "Не удалось создать сессию")
			return
		}
		t := hex.EncodeToString(bytes)
		expires := time.Now().Add(8 * time.Hour)
		if e = a.store.AddSession(ctx, hashToken(t), expires); e != nil {
			fail(w, 503, "Не удалось сохранить сессию")
			return
		}
		http.SetCookie(w, &http.Cookie{Name: "portfolio_session", Value: t, Path: "/", HttpOnly: true, Secure: a.secure, SameSite: http.SameSiteStrictMode, MaxAge: 28800, Expires: expires})
		reply(w, 200, map[string]bool{"ok": true})
	case "POST /api/logout":
		if t := token(r); t != "" {
			if e := a.store.DeleteSession(ctx, hashToken(t)); e != nil {
				fail(w, 503, "Не удалось завершить сессию")
				return
			}
		}
		http.SetCookie(w, &http.Cookie{Name: "portfolio_session", Value: "", Path: "/", HttpOnly: true, Secure: a.secure, SameSite: http.SameSiteStrictMode, MaxAge: -1})
		reply(w, 200, map[string]bool{"ok": true})
	case "PUT /api/content":
		if !a.authenticated(r) {
			fail(w, 401, "Войдите в редактор")
			return
		}
		var c Content
		if decode(w, r, &c) != nil || !c.valid() {
			fail(w, 400, "Проверьте поля, длину текста и ссылки проектов")
			return
		}
		if e := a.store.Write(ctx, c); e != nil {
			fail(w, 503, "Не удалось сохранить изменения")
			return
		}
		reply(w, 200, map[string]bool{"ok": true})
	default:
		fail(w, 404, "Not found")
	}
}
