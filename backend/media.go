package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"github.com/jackc/pgx/v5"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"strings"
)

type mediaStore interface {
	PutMedia(context.Context, string, string, []byte) error
	GetMedia(context.Context, string) (string, []byte, error)
}

func (p postgres) PutMedia(ctx context.Context, id, mime string, data []byte) error {
	_, e := p.db.Exec(ctx, "INSERT INTO media_assets(id,mime,data) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", id, mime, data)
	return e
}
func (p postgres) GetMedia(ctx context.Context, id string) (string, []byte, error) {
	var mime string
	var data []byte
	e := p.db.QueryRow(ctx, "SELECT mime,data FROM media_assets WHERE id=$1", id).Scan(&mime, &data)
	return mime, data, e
}
func (a *app) media(w http.ResponseWriter, r *http.Request) {
	store, ok := a.store.(mediaStore)
	if !ok {
		fail(w, 503, "Хранилище недоступно")
		return
	}
	if r.Method == "GET" && validMedia(r.URL.Path) && r.URL.Path != "" {
		mime, data, e := store.GetMedia(r.Context(), strings.TrimPrefix(r.URL.Path, "/api/media/"))
		if errors.Is(e, pgx.ErrNoRows) {
			fail(w, 404, "Изображение не найдено")
			return
		}
		if e != nil {
			fail(w, 500, "Ошибка чтения")
			return
		}
		w.Header().Set("Content-Type", mime)
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		w.Write(data)
		return
	}
	if r.Method != "POST" || r.URL.Path != "/api/media" {
		fail(w, 404, "Not found")
		return
	}
	if !a.authenticated(r) {
		fail(w, 401, "Войдите в админку")
		return
	}
	data, e := io.ReadAll(http.MaxBytesReader(w, r.Body, 5<<20))
	if e != nil {
		fail(w, 413, "Максимальный размер — 5 МБ")
		return
	}
	cfg, format, e := image.DecodeConfig(bytes.NewReader(data))
	if e != nil || (format != "jpeg" && format != "png") || cfg.Width <= 0 || cfg.Height <= 0 || cfg.Width > 10000 || cfg.Height > 10000 || int64(cfg.Width)*int64(cfg.Height) > 20000000 {
		fail(w, 400, "Нужен JPEG или PNG, до 20 мегапикселей")
		return
	}
	img, _, e := image.Decode(bytes.NewReader(data))
	if e != nil {
		fail(w, 400, "Повреждённое изображение")
		return
	}
	var out bytes.Buffer
	mime := "image/png"
	if format == "jpeg" {
		mime = "image/jpeg"
		e = jpeg.Encode(&out, img, &jpeg.Options{Quality: 92})
	} else {
		e = png.Encode(&out, img)
	}
	if e != nil || out.Len() > 10<<20 {
		fail(w, 400, "Изображение слишком сложное, уменьшите размер")
		return
	}
	sum := sha256.Sum256(out.Bytes())
	id := hex.EncodeToString(sum[:])
	if e = store.PutMedia(r.Context(), id, mime, out.Bytes()); e != nil {
		fail(w, 500, "Не удалось сохранить изображение")
		return
	}
	reply(w, 201, map[string]string{"url": "/api/media/" + id})
}
