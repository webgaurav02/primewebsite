-- =============================================================================
-- PRIME admin portal — Postgres schema + Row-Level Security (RLS)
--
-- RLS is the SECOND, independent authorization layer. The Data Access Layer
-- (lib/dal/*) already checks permission + region, but if a query ever slips
-- through with a bug, these policies still prevent an admin from reading or
-- mutating a grievance outside their region, and make the audit log append-only
-- at the database itself.
--
-- The application connects as a NON-owner, NON-superuser role (prime_app) and,
-- at the start of each request/transaction, sets:
--     SET LOCAL app.current_admin_id   = '<uuid>';
--     SET LOCAL app.current_admin_role = '<role>';
-- The policies below read those settings. `FORCE ROW LEVEL SECURITY` ensures the
-- policies apply even to the table owner.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid + PII encryption

-- ── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE admin_role AS ENUM ('super_admin', 'grievance_officer', 'auditor');
CREATE TYPE region AS ENUM ('khasi_jaintia', 'garo', 'ri_bhoi');
CREATE TYPE grievance_status AS ENUM (
  'submitted', 'under_review', 'in_progress', 'resolved', 'rejected'
);

-- ── Admin users + region scoping ──────────────────────────────────────────────
CREATE TABLE admin_user (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  name        text NOT NULL,
  role        admin_role NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- An officer may own one or more regions. super_admin/auditor own none here
-- (they get all-region access via role, see policies).
CREATE TABLE admin_region (
  admin_id  uuid NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  region    region NOT NULL,
  PRIMARY KEY (admin_id, region)
);

-- ── Grievances ────────────────────────────────────────────────────────────────
-- Complainant PII is stored ENCRYPTED (ciphertext). The app decrypts only for
-- callers holding "grievance:read_pii". At-rest disk encryption is not enough
-- when the threat is exposure of who complained against whom.
CREATE TABLE grievance (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_ref             text UNIQUE NOT NULL,
  region                 region NOT NULL,
  subject                text NOT NULL,
  description            text NOT NULL,
  status                 grievance_status NOT NULL DEFAULT 'submitted',
  complainant_name_enc   bytea NOT NULL,
  complainant_email_enc  bytea NOT NULL,
  complainant_phone_enc  bytea NOT NULL,
  assigned_to            uuid REFERENCES admin_user(id),
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX grievance_region_status_idx ON grievance (region, status);

CREATE TABLE grievance_status_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id  uuid NOT NULL REFERENCES grievance(id) ON DELETE CASCADE,
  from_status   grievance_status,
  to_status     grievance_status NOT NULL,
  note          text,
  changed_by    uuid NOT NULL REFERENCES admin_user(id),
  changed_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Append-only, hash-chained audit log ───────────────────────────────────────
CREATE TABLE audit_log (
  seq           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id      uuid NOT NULL,
  actor_email   text NOT NULL,
  action        text NOT NULL,
  resource_type text NOT NULL,
  resource_id   text,
  metadata      jsonb NOT NULL DEFAULT '{}',
  ip            inet,
  at            timestamptz NOT NULL DEFAULT now(),
  prev_hash     text NOT NULL,
  hash          text NOT NULL
);

-- ── Session helpers (read the per-request GUCs) ───────────────────────────────
CREATE OR REPLACE FUNCTION current_admin_id() RETURNS uuid
  LANGUAGE sql STABLE AS $$
    SELECT nullif(current_setting('app.current_admin_id', true), '')::uuid
  $$;

CREATE OR REPLACE FUNCTION current_admin_role() RETURNS admin_role
  LANGUAGE sql STABLE AS $$
    SELECT nullif(current_setting('app.current_admin_role', true), '')::admin_role
  $$;

-- ── RLS: grievance ────────────────────────────────────────────────────────────
ALTER TABLE grievance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance FORCE ROW LEVEL SECURITY;

CREATE POLICY grievance_read ON grievance FOR SELECT USING (
  current_admin_role() IN ('super_admin', 'auditor')
  OR EXISTS (
    SELECT 1 FROM admin_region ar
    WHERE ar.admin_id = current_admin_id() AND ar.region = grievance.region
  )
);

-- Auditors are read-only: no INSERT/UPDATE/DELETE policy ⇒ denied.
CREATE POLICY grievance_write ON grievance FOR UPDATE
  USING (
    current_admin_role() = 'super_admin'
    OR (
      current_admin_role() = 'grievance_officer'
      AND EXISTS (
        SELECT 1 FROM admin_region ar
        WHERE ar.admin_id = current_admin_id() AND ar.region = grievance.region
      )
    )
  )
  WITH CHECK (
    current_admin_role() = 'super_admin'
    OR (
      current_admin_role() = 'grievance_officer'
      AND EXISTS (
        SELECT 1 FROM admin_region ar
        WHERE ar.admin_id = current_admin_id() AND ar.region = grievance.region
      )
    )
  );

-- ── RLS: audit_log (append-only) ──────────────────────────────────────────────
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;

CREATE POLICY audit_insert ON audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY audit_read ON audit_log FOR SELECT
  USING (current_admin_role() IN ('super_admin', 'auditor'));
-- No UPDATE/DELETE policy ⇒ tampering with history is impossible under RLS.

-- ── Least-privilege application role ──────────────────────────────────────────
-- The app NEVER connects as the table owner/superuser (RLS would be bypassable).
-- Create prime_app and grant only what the DAL needs; deny audit mutation hard.
--   CREATE ROLE prime_app LOGIN PASSWORD '...';
GRANT SELECT, UPDATE ON grievance TO prime_app;
GRANT SELECT, INSERT ON grievance_status_history TO prime_app;
GRANT SELECT ON admin_user, admin_region TO prime_app;
GRANT SELECT, INSERT ON audit_log TO prime_app;   -- note: no UPDATE/DELETE
REVOKE UPDATE, DELETE ON audit_log FROM prime_app;
