package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"
)

type memoryStore struct {
	content  Content
	password string
	sessions map[string]time.Time
}

func (m *memoryStore) Read(context.Context) (Content, error)    { return m.content, nil }
func (m *memoryStore) Write(_ context.Context, c Content) error { m.content = c; return nil }
func (m *memoryStore) Password(context.Context) (string, error) { return m.password, nil }
func (m *memoryStore) AddSession(_ context.Context, s string, e time.Time) error {
	m.sessions[s] = e
	return nil
}
func (m *memoryStore) Session(_ context.Context, s string) (bool, error) {
	return m.sessions[s].After(time.Now()), nil
}
func (m *memoryStore) DeleteSession(_ context.Context, s string) error {
	delete(m.sessions, s)
	return nil
}
func (m *memoryStore) Ping(context.Context) error { return nil }
func call(a http.Handler, method, path, body, cookie, origin string) *httptest.ResponseRecorder {
	r := httptest.NewRequest(method, path, strings.NewReader(body))
	r.Header.Set("Origin", origin)
	r.Header.Set("Cookie", cookie)
	w := httptest.NewRecorder()
	a.ServeHTTP(w, r)
	return w
}
func testFlow(t *testing.T, store Store) {
	t.Helper()
	a := &app{store: store, origin: "https://portfolio.test", secure: true}
	origin := a.origin
	if w := call(a, "PUT", "/api/content", "{}", "", origin); w.Code != 401 {
		t.Fatalf("unauthorized write: %d", w.Code)
	}
	if w := call(a, "POST", "/api/login", `{"password":"test-password-12345"}`, "", "https://other.test"); w.Code != 403 {
		t.Fatal("CSRF accepted")
	}
	if w := call(a, "POST", "/api/login", `{"password":"wrong"}`, "", origin); w.Code != 401 {
		t.Fatal("bad password accepted")
	}
	w := call(a, "POST", "/api/login", `{"password":"test-password-12345"}`, "", origin)
	if w.Code != 200 {
		t.Fatalf("login: %s", w.Body.String())
	}
	cookies := w.Result().Cookies()
	if len(cookies) != 1 || !cookies[0].HttpOnly || !cookies[0].Secure || cookies[0].SameSite != http.SameSiteStrictMode {
		t.Fatal("unsafe cookie")
	}
	cookie := cookies[0].String()
	c, e := store.Read(context.Background())
	if e != nil {
		t.Fatal(e)
	}
	c.Summary = "Updated summary"
	c.Projects[0].URL = "javascript:alert(1)"
	b, _ := json.Marshal(c)
	if w = call(a, "PUT", "/api/content", string(b), cookie, origin); w.Code != 400 {
		t.Fatal("unsafe URL accepted")
	}
	c.Projects[0].URL = "https://github.com/Comunicore/comunicore"
	b, _ = json.Marshal(c)
	if w = call(a, "PUT", "/api/content", string(b), cookie, origin); w.Code != 200 {
		t.Fatalf("save: %s", w.Body.String())
	}
	w = call(a, "GET", "/api/content", "", "", origin)
	if !bytes.Contains(w.Body.Bytes(), []byte("Updated summary")) {
		t.Fatal("public content stale")
	}
	a2 := &app{store: store, origin: origin, secure: true}
	w = call(a2, "GET", "/api/session", "", cookie, origin)
	if !strings.Contains(w.Body.String(), "true") {
		t.Fatal("session not persistent")
	}
	w = call(a2, "POST", "/api/logout", "{}", cookie, origin)
	if w.Code != 200 {
		t.Fatal("logout failed")
	}
	w = call(a2, "PUT", "/api/content", string(b), cookie, origin)
	if w.Code != 401 {
		t.Fatal("session not revoked")
	}
}
func TestAPI(t *testing.T) {
	var c Content
	if e := json.Unmarshal(seed, &c); e != nil {
		t.Fatal(e)
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte("test-password-12345"), bcrypt.MinCost)
	testFlow(t, &memoryStore{c, string(hash), map[string]time.Time{}})
}
func TestValidation(t *testing.T) {
	var c Content
	json.Unmarshal(seed, &c)
	if !c.valid() {
		t.Fatal("seed rejected")
	}
	c.Summary = strings.Repeat("a", 3001)
	if c.valid() {
		t.Fatal("oversize summary accepted")
	}
	for _, u := range []string{"javascript:alert(1)", "data:text/html,x", "https://user:pass@example.com", "/local"} {
		if validURL(u, false) {
			t.Fatal(u)
		}
	}
	if validURL("", false) || !validURL("", true) {
		t.Fatal("optional URL validation")
	}
}
func TestPostgresIntegration(t *testing.T) {
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("set TEST_DATABASE_URL to run real PostgreSQL test")
	}
	ctx := context.Background()
	db, e := pgxpool.New(ctx, dsn)
	if e != nil {
		t.Fatal(e)
	}
	defer db.Close()
	schemaName := fmt.Sprintf("portfolio_test_%d", time.Now().UnixNano())
	if _, e = db.Exec(ctx, "CREATE SCHEMA "+schemaName); e != nil {
		t.Fatal(e)
	}
	defer db.Exec(ctx, "DROP SCHEMA "+schemaName+" CASCADE")
	cfg, e := pgxpool.ParseConfig(dsn)
	if e != nil {
		t.Fatal(e)
	}
	cfg.ConnConfig.RuntimeParams["search_path"] = schemaName
	p, e := pgxpool.NewWithConfig(ctx, cfg)
	if e != nil {
		t.Fatal(e)
	}
	if e = migrate(ctx, p, "test-password-12345"); e != nil {
		t.Fatal(e)
	}
	if e = migrate(ctx, p, ""); e != nil {
		t.Fatalf("migration not idempotent: %v", e)
	}
	testFlow(t, postgres{p})
	var count int
	if e = p.QueryRow(ctx, "SELECT count(*) FROM content_history").Scan(&count); e != nil || count != 1 {
		t.Fatalf("history: %d %v", count, e)
	}
	mediaID := testMedia(t, postgres{p})
	p.Close()
	p, e = pgxpool.NewWithConfig(ctx, cfg)
	if e != nil {
		t.Fatal(e)
	}
	defer p.Close()
	if _, data, e := (postgres{p}).GetMedia(ctx, mediaID); e != nil || len(data) == 0 {
		t.Fatal("media not persistent", e)
	}
	c, e := (postgres{p}).Read(ctx)
	if e != nil || c.Summary != "Updated summary" {
		t.Fatalf("persisted data missing: %v", e)
	}
}
