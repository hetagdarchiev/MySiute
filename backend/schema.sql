CREATE TABLE IF NOT EXISTS admins (
 id integer PRIMARY KEY CHECK (id = 1),
 password_hash text NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY,
 expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS site_content (
 id integer PRIMARY KEY CHECK (id = 1),
 document jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS content_history (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 document jsonb NOT NULL,
 saved_at timestamptz NOT NULL DEFAULT now()
);
