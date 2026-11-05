package main

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func migrate(ctx context.Context, db *pgxpool.Pool, password string) error {
	tx, e := db.Begin(ctx)
	if e != nil {
		return e
	}
	defer tx.Rollback(ctx)
	if _, e = tx.Exec(ctx, "SELECT pg_advisory_xact_lock(835621)"); e != nil {
		return e
	}
	if _, e = tx.Exec(ctx, "CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())"); e != nil {
		return e
	}
	var exists bool
	if e = tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version=1)").Scan(&exists); e != nil {
		return e
	}
	if !exists {
		if _, e = tx.Exec(ctx, schema); e != nil {
			return e
		}
		if _, e = tx.Exec(ctx, "INSERT INTO schema_migrations(version) VALUES(1)"); e != nil {
			return e
		}
	}
	if _, e = tx.Exec(ctx, "INSERT INTO site_content(id,document) VALUES(1,$1) ON CONFLICT(id) DO NOTHING", seed); e != nil {
		return e
	}
	if e = tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM admins WHERE id=1)").Scan(&exists); e != nil {
		return e
	}
	if !exists {
		if len(password) < 12 || len(password) > 72 {
			return errors.New("ADMIN_PASSWORD must be 12 to 72 bytes for first startup")
		}
		hash, e := bcrypt.GenerateFromPassword([]byte(password), 12)
		if e != nil {
			return e
		}
		if _, e = tx.Exec(ctx, "INSERT INTO admins(id,password_hash) VALUES(1,$1)", string(hash)); e != nil {
			return e
		}
	}
	if e = tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version=2)").Scan(&exists); e != nil {
		return e
	}
	if !exists {
		if _, e = tx.Exec(ctx, schema2); e != nil {
			return e
		}
		if _, e = tx.Exec(ctx, "INSERT INTO schema_migrations(version) VALUES(2)"); e != nil {
			return e
		}
	}
	return tx.Commit(ctx)
}
