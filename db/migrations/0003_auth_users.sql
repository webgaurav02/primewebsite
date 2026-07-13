-- =============================================================================
-- 0003 — Public user identity + hand-rolled email/password auth.
--
-- Design (see memory / plan): auth is hand-rolled on the existing stack rather
-- than an auth library, so it uses ONE driver (postgres.js), ONE migration
-- system, and the SAME RLS/GUC contract as the admin side.
--
--   app_user            — the identity HUB every module hangs off (profiles,
--                         org, PRIME ID, grievance, timeline all reference it).
--   user_credential     — password hash (scrypt), kept in a separate table so a
--                         self-SELECT of app_user never exposes the hash.
--   user_session        — server-side sessions; only SHA-256(token) is stored,
--                         so a DB dump yields no usable session cookies.
--   user_email_token    — email-verify + password-reset tokens (hash stored).
--
-- Three request contexts set GUCs (all trusted because only the server sets
-- them, exactly like app.current_admin_id):
--   app.current_admin_id / _role  — admin (0001)
--   app.current_user_id           — an authenticated public user
--   app.auth_op = '1'             — a deliberate pre-auth operation
--                                   (register / login / verify / reset), the
--                                   ONLY context lib/dal/auth.ts runs in and the
--                                   only one allowed near credential/session/
--                                   token tables. Any other code path (e.g. a
--                                   bug in the grievance DAL) sets none of these
--                                   and RLS fails closed.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS citext;

-- ── Enums ─────────────────────────────────────────────────────────────────────
CREATE TYPE persona          AS ENUM ('entrepreneur', 'mentor', 'investor');
CREATE TYPE gender           AS ENUM ('male', 'female', 'other');
CREATE TYPE user_status      AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE user_source      AS ENUM ('public', 'admin', 'import');
CREATE TYPE email_token_kind AS ENUM ('verify', 'reset');

-- ── Identity hub ──────────────────────────────────────────────────────────────
CREATE TABLE app_user (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              citext UNIQUE NOT NULL,
  full_name          text NOT NULL,
  persona            persona NOT NULL,
  gender             gender,
  date_of_birth      date,
  mobile_enc         bytea,               -- AES-256-GCM (lib/crypto/pii.ts); not a login key
  preferred_language text,
  district           text,
  how_heard          text,
  status             user_status NOT NULL DEFAULT 'pending',
  email_verified_at  timestamptz,         -- set once the verify link is used
  source             user_source NOT NULL DEFAULT 'public',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_credential (
  user_id         uuid PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  password_hash   text NOT NULL,          -- scrypt$N$r$p$salt$dk (lib/auth/password.ts)
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until    timestamptz,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_session (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash   text UNIQUE NOT NULL,      -- SHA-256(opaque cookie token)
  user_id      uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  user_agent   text,
  ip           inet
);
CREATE INDEX user_session_user_idx ON user_session (user_id);

CREATE TABLE user_email_token (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash  text UNIQUE NOT NULL,       -- SHA-256(opaque link token)
  user_id     uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  kind        email_token_kind NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL,
  consumed_at timestamptz
);
CREATE INDEX user_email_token_user_kind_idx ON user_email_token (user_id, kind);

-- ── GUC helpers ───────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid
  LANGUAGE sql STABLE AS $$
    SELECT nullif(current_setting('app.current_user_id', true), '')::uuid
  $$;

CREATE OR REPLACE FUNCTION is_auth_op() RETURNS boolean
  LANGUAGE sql STABLE AS $$
    SELECT current_setting('app.auth_op', true) = '1'
  $$;

-- Which admins may manage the unified user DB (mirror of rbac "user:manage").
CREATE OR REPLACE FUNCTION admin_manages_users() RETURNS boolean
  LANGUAGE sql STABLE AS $$
    SELECT current_admin_role() IN ('super_admin', 'grievance_officer')
  $$;

-- ── RLS: app_user ─────────────────────────────────────────────────────────────
ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_user FORCE ROW LEVEL SECURITY;

CREATE POLICY app_user_select ON app_user FOR SELECT USING (
  is_auth_op() OR current_user_id() = id OR admin_manages_users()
);
CREATE POLICY app_user_insert ON app_user FOR INSERT WITH CHECK (
  is_auth_op() OR current_admin_role() = 'super_admin'
);
CREATE POLICY app_user_update ON app_user FOR UPDATE
  USING (is_auth_op() OR current_user_id() = id OR admin_manages_users())
  WITH CHECK (is_auth_op() OR current_user_id() = id OR admin_manages_users());

-- ── RLS: credential / session / token (auth-context only, + session self) ─────
ALTER TABLE user_credential ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credential FORCE ROW LEVEL SECURITY;
CREATE POLICY user_credential_all ON user_credential FOR ALL
  USING (is_auth_op()) WITH CHECK (is_auth_op());

ALTER TABLE user_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_session FORCE ROW LEVEL SECURITY;
CREATE POLICY user_session_select ON user_session FOR SELECT
  USING (is_auth_op() OR current_user_id() = user_id);
CREATE POLICY user_session_insert ON user_session FOR INSERT
  WITH CHECK (is_auth_op());
CREATE POLICY user_session_update ON user_session FOR UPDATE
  USING (is_auth_op()) WITH CHECK (is_auth_op());
CREATE POLICY user_session_delete ON user_session FOR DELETE
  USING (is_auth_op() OR current_user_id() = user_id);

ALTER TABLE user_email_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_email_token FORCE ROW LEVEL SECURITY;
CREATE POLICY user_email_token_all ON user_email_token FOR ALL
  USING (is_auth_op()) WITH CHECK (is_auth_op());

-- ── Least-privilege grants ────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE          ON app_user         TO prime_app;
GRANT SELECT, INSERT, UPDATE, DELETE  ON user_credential  TO prime_app;
GRANT SELECT, INSERT, UPDATE, DELETE  ON user_session     TO prime_app;
GRANT SELECT, INSERT, UPDATE, DELETE  ON user_email_token TO prime_app;
