package main

import (
	"context"
	"encoding/json"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Store interface {
	Read(context.Context) (Content, error)
	Write(context.Context, Content) error
	Password(context.Context) (string, error)
	AddSession(context.Context, string, time.Time) error
	Session(context.Context, string) (bool, error)
	DeleteSession(context.Context, string) error
	Ping(context.Context) error
}
type postgres struct{ db *pgxpool.Pool }

func (p postgres) Read(ctx context.Context) (Content, error) {
	var b []byte
	var c Content
	e := p.db.QueryRow(ctx, "SELECT document FROM site_content WHERE id=1").Scan(&b)
	if e == nil {
		e = json.Unmarshal(b, &c)
	}
	return c, e
}
func (p postgres) Write(ctx context.Context, c Content) error {
	b, e := json.Marshal(c)
	if e != nil {
		return e
	}
	tx, e := p.db.Begin(ctx)
	if e != nil {
		return e
	}
	defer tx.Rollback(ctx)
	var previous []byte
	if e = tx.QueryRow(ctx, "SELECT document FROM site_content WHERE id=1 FOR UPDATE").Scan(&previous); e != nil {
		return e
	}
	if _, e = tx.Exec(ctx, "INSERT INTO content_history(document) VALUES($1)", previous); e != nil {
		return e
	}
	if _, e = tx.Exec(ctx, "UPDATE site_content SET document=$1,updated_at=now() WHERE id=1", b); e != nil {
		return e
	}
	if _, e = tx.Exec(ctx, "DELETE FROM content_history WHERE id NOT IN (SELECT id FROM content_history ORDER BY id DESC LIMIT 50)"); e != nil {
		return e
	}
	return tx.Commit(ctx)
}
func (p postgres) Password(ctx context.Context) (string, error) {
	var h string
	e := p.db.QueryRow(ctx, "SELECT password_hash FROM admins WHERE id=1").Scan(&h)
	return h, e
}
func (p postgres) AddSession(ctx context.Context, h string, t time.Time) error {
	_, e := p.db.Exec(ctx, "DELETE FROM sessions WHERE expires_at<=now()")
	if e != nil {
		return e
	}
	_, e = p.db.Exec(ctx, "INSERT INTO sessions(token_hash,expires_at) VALUES($1,$2)", h, t)
	return e
}
func (p postgres) Session(ctx context.Context, h string) (bool, error) {
	var ok bool
	e := p.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM sessions WHERE token_hash=$1 AND expires_at>now())", h).Scan(&ok)
	return ok, e
}
func (p postgres) DeleteSession(ctx context.Context, h string) error {
	_, e := p.db.Exec(ctx, "DELETE FROM sessions WHERE token_hash=$1", h)
	return e
}
func (p postgres) Ping(ctx context.Context) error { return p.db.Ping(ctx) }
