-- =============================================================================
-- 0005 — PRIME ID: request → admin approval → server-side issuance + /verify.
--
-- Split into a request (what the applicant asks for) and a credential (what was
-- issued). Issuance is SERVER-SIDE only: the number comes from a row-locked DB
-- sequence and the verification token is Ed25519-signed with an env-held key —
-- never in the browser (the old client HMAC was a forgery oracle).
--
-- Only SHA-256(token) is stored (token_hash UNIQUE); /verify checks the
-- signature AND looks the credential up by hash so revocation/expiry are
-- authoritative.
-- =============================================================================

CREATE TYPE prime_id_holder     AS ENUM ('entrepreneur', 'mentor', 'other');
CREATE TYPE prime_id_category   AS ENUM ('startup', 'nano', 'livelihood');
CREATE TYPE prime_id_req_status AS ENUM ('pending', 'approved', 'rejected', 'issued');
CREATE TYPE prime_id_cred_status AS ENUM ('active', 'revoked', 'expired');

-- ── Requests ──────────────────────────────────────────────────────────────────
CREATE TABLE prime_id_request (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  holder_type      prime_id_holder NOT NULL,
  custom_role_label text,
  category         prime_id_category,
  venture_name     text,
  district         text NOT NULL,
  photo_path       text,
  full_name        text NOT NULL,   -- snapshot at request time
  custom_details   jsonb NOT NULL DEFAULT '[]',
  status           prime_id_req_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  reviewed_by      uuid REFERENCES admin_user(id),
  reviewed_at      timestamptz,
  requested_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX prime_id_request_status_idx ON prime_id_request (status, requested_at);
CREATE INDEX prime_id_request_user_idx ON prime_id_request (user_id);
-- At most one open (pending) request per user.
CREATE UNIQUE INDEX prime_id_request_one_open
  ON prime_id_request (user_id) WHERE status = 'pending';

-- ── Issued credentials ────────────────────────────────────────────────────────
CREATE TABLE prime_id_credential (
  id                text PRIMARY KEY,             -- PRM-ML-YYYY-NNNNNN
  request_id        uuid REFERENCES prime_id_request(id) ON DELETE SET NULL,
  user_id           uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  full_name         text NOT NULL,
  holder_type       prime_id_holder NOT NULL,
  custom_role_label text,
  category          prime_id_category,
  venture_name      text,
  district          text NOT NULL,
  photo_path        text,
  custom_details    jsonb NOT NULL DEFAULT '[]',
  issue_date        date NOT NULL,
  valid_thru        date NOT NULL,
  token             text NOT NULL,
  token_hash        text UNIQUE NOT NULL,
  token_fingerprint text NOT NULL,
  status            prime_id_cred_status NOT NULL DEFAULT 'active',
  revoked_at        timestamptz,
  revoked_reason    text,
  issued_by         uuid REFERENCES admin_user(id),
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX prime_id_credential_user_idx ON prime_id_credential (user_id);

-- ── Race-safe per-year number allocation ──────────────────────────────────────
CREATE TABLE prime_id_sequence (
  year       integer PRIMARY KEY,
  last_value integer NOT NULL DEFAULT 0
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
-- Requests: owner sees/creates own; reviewers (admins) see/act on all.
ALTER TABLE prime_id_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE prime_id_request FORCE ROW LEVEL SECURITY;
CREATE POLICY prime_id_request_select ON prime_id_request FOR SELECT
  USING (current_user_id() = user_id OR admin_manages_users());
CREATE POLICY prime_id_request_insert ON prime_id_request FOR INSERT
  WITH CHECK (current_user_id() = user_id);
CREATE POLICY prime_id_request_update ON prime_id_request FOR UPDATE
  USING (admin_manages_users()) WITH CHECK (admin_manages_users());

-- Credentials: owner reads own (incl. the token, to build the QR); admins read
-- all. Fail-closed with no context. The token column must NOT be world-readable
-- (it is the credential's secret), so the PUBLIC /verify path does NOT SELECT
-- the table directly — it calls prime_id_public_lookup() below, which returns
-- only safe fields by token hash.
ALTER TABLE prime_id_credential ENABLE ROW LEVEL SECURITY;
ALTER TABLE prime_id_credential FORCE ROW LEVEL SECURITY;
CREATE POLICY prime_id_credential_select ON prime_id_credential FOR SELECT
  USING (current_user_id() = user_id OR admin_manages_users());
CREATE POLICY prime_id_credential_insert ON prime_id_credential FOR INSERT
  WITH CHECK (admin_manages_users());
CREATE POLICY prime_id_credential_update ON prime_id_credential FOR UPDATE
  USING (admin_manages_users()) WITH CHECK (admin_manages_users());

-- Definer read for the public-lookup function (owned by prime_audit).
GRANT SELECT ON prime_id_credential TO prime_audit;
CREATE POLICY prime_id_cred_definer_read ON prime_id_credential FOR SELECT
  TO prime_audit USING (true);

-- Public verification lookup: returns ONLY non-secret fields for a credential
-- matching the presented token's hash. No token, no photo path, no PII beyond
-- what a printed card already shows. SECURITY DEFINER so it bypasses the
-- owner/admin SELECT policy without exposing the table to prime_app directly.
CREATE OR REPLACE FUNCTION prime_id_public_lookup(p_token_hash text)
RETURNS TABLE (
  id           text,
  full_name    text,
  holder_type  prime_id_holder,
  category     prime_id_category,
  venture_name text,
  district     text,
  issue_date   date,
  valid_thru   date,
  status       prime_id_cred_status
)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT id, full_name, holder_type, category, venture_name, district,
         issue_date, valid_thru, status
  FROM prime_id_credential
  WHERE token_hash = p_token_hash
$$;
ALTER FUNCTION prime_id_public_lookup(text) OWNER TO prime_audit;
REVOKE ALL ON FUNCTION prime_id_public_lookup(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION prime_id_public_lookup(text) TO prime_app;

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON prime_id_request    TO prime_app;
GRANT SELECT, INSERT, UPDATE ON prime_id_credential TO prime_app;
GRANT SELECT, INSERT, UPDATE ON prime_id_sequence   TO prime_app;
