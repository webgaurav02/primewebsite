-- =============================================================================
-- 0020 — Admin email/password authentication.
--
-- Admin login was fail-closed in production (lib/auth/session.ts returned null;
-- only a dev HMAC stub worked locally). This migration gives admins the SAME
-- hand-rolled email+password auth the public side already uses (0003_auth_users),
-- so /admin can actually be signed into. It mirrors the public tables exactly:
--
--   admin_credential — scrypt password hash (separate table so a SELECT of
--                      admin_user never exposes the hash), + failed-attempt
--                      lockout counters.
--   admin_session    — server-side sessions; only SHA-256(cookie token) is
--                      stored, so a DB dump yields no usable session cookie.
--
-- A fourth request context joins the three from 0003 (admin / user / auth_op):
--   app.admin_auth_op = '1'  — a deliberate admin pre-auth / credential op
--                              (login / logout / session-verify / set-password).
--                              The ONLY context lib/dal/admin-auth.ts runs in and
--                              (with super_admin, for the console) the only one
--                              allowed near the admin credential/session tables.
--                              Any other path sets none of these → RLS fails closed.
-- =============================================================================

-- ── Tables ────────────────────────────────────────────────────────────────────
CREATE TABLE admin_credential (
  admin_id        uuid PRIMARY KEY REFERENCES admin_user(id) ON DELETE CASCADE,
  password_hash   text NOT NULL,          -- scrypt$N$r$p$salt$dk (lib/auth/password.ts)
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until    timestamptz,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_session (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash   text UNIQUE NOT NULL,      -- SHA-256(opaque cookie token)
  admin_id     uuid NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  user_agent   text,
  ip           inet
);
CREATE INDEX admin_session_admin_idx ON admin_session (admin_id);

-- ── GUC helper (parallel to is_auth_op() in 0003) ─────────────────────────────
CREATE OR REPLACE FUNCTION is_admin_auth_op() RETURNS boolean
  LANGUAGE sql STABLE AS $$
    SELECT current_setting('app.admin_auth_op', true) = '1'
  $$;

-- ── RLS: admin_credential ─────────────────────────────────────────────────────
-- The auth DAL verifies/updates the hash + lockout under admin_auth_op. The
-- console (lib/dal/admins.ts) sets/rotates passwords under its natural
-- super_admin context, so createAdmin + initial password stays one transaction.
ALTER TABLE admin_credential ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credential FORCE ROW LEVEL SECURITY;
CREATE POLICY admin_credential_all ON admin_credential FOR ALL
  USING (is_admin_auth_op() OR current_admin_role() = 'super_admin')
  WITH CHECK (is_admin_auth_op() OR current_admin_role() = 'super_admin');

-- ── RLS: admin_session ────────────────────────────────────────────────────────
-- Sessions are ONLY ever minted/verified/revoked by the auth DAL.
ALTER TABLE admin_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_session FORCE ROW LEVEL SECURITY;
CREATE POLICY admin_session_all ON admin_session FOR ALL
  USING (is_admin_auth_op()) WITH CHECK (is_admin_auth_op());

-- ── admin_user reads for the auth path ────────────────────────────────────────
-- Login / session-verify join admin_user (name/role/is_active) with NO admin GUC
-- set, so the 0019 read policy (current_admin_id() IS NOT NULL) would refuse it.
-- Widen it to also allow the admin-auth context. Writes stay super_admin-only.
DROP POLICY admin_user_read ON admin_user;
CREATE POLICY admin_user_read ON admin_user FOR SELECT
  USING (current_admin_id() IS NOT NULL OR is_admin_auth_op());

-- ── Least-privilege grants ────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_credential TO prime_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_session    TO prime_app;
