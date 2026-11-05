package main

import (
	"bytes"
	"context"
	"encoding/json"
	"image"
	"image/png"
	"strings"
	"testing"
	"time"
)

func testMedia(t *testing.T, p postgres) string {
	t.Helper()
	ctx := context.Background()
	origin := "http://localhost:3000"
	a := &app{store: p, origin: origin}
	token := strings.Repeat("b", 64)
	if e := p.AddSession(ctx, hashToken(token), time.Now().Add(time.Hour)); e != nil {
		t.Fatal(e)
	}
	cookie := "portfolio_session=" + token
	var b bytes.Buffer
	png.Encode(&b, image.NewRGBA(image.Rect(0, 0, 10, 10)))
	if w := call(a, "POST", "/api/media", b.String(), "", origin); w.Code != 401 {
		t.Fatal("anonymous upload accepted")
	}
	if w := call(a, "POST", "/api/media", "<svg/>", cookie, origin); w.Code != 400 {
		t.Fatal("SVG accepted")
	}
	if w := call(a, "POST", "/api/media", b.String(), cookie, "http://evil.test"); w.Code != 403 {
		t.Fatal("cross-origin upload accepted")
	}
	w := call(a, "POST", "/api/media", b.String(), cookie, origin)
	if w.Code != 201 {
		t.Fatalf("upload: %d %s", w.Code, w.Body.String())
	}
	var result map[string]string
	json.Unmarshal(w.Body.Bytes(), &result)
	url := result["url"]
	w = call(a, "GET", url, "", "", origin)
	if w.Code != 200 || w.Header().Get("Content-Type") != "image/png" {
		t.Fatal("image unavailable")
	}
	if _, e := png.Decode(bytes.NewReader(w.Body.Bytes())); e != nil {
		t.Fatal(e)
	}
	c, e := p.Read(ctx)
	if e != nil {
		t.Fatal(e)
	}
	c.Projects[0].Cover = url
	c.Projects[0].Logo = url
	data, _ := json.Marshal(c)
	w = call(a, "PUT", "/api/content", string(data), cookie, origin)
	if w.Code != 200 {
		t.Fatalf("image references rejected: %s", w.Body.String())
	}
	c.Projects[0].Cover = "javascript:alert(1)"
	if c.valid() {
		t.Fatal("unsafe media reference accepted")
	}
	return strings.TrimPrefix(url, "/api/media/")
}
