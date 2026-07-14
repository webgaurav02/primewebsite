-- =============================================================================
-- 0009 — Programs, cycles, and applications.
--
--   program            — the catalog of PRIME schemes (Incubation/E-Champion,
--                        CM Elevate, PRIME Rural, …). Public, reference data.
--   program_cycle      — a dated intake window for a program (opens/closes).
--   program_application— a member's application to a cycle. One per (user,cycle);
--                        lifecycle draft→submitted→under_review→shortlisted→
--                        approved/rejected, or withdrawn by the applicant.
--
-- program + program_cycle are world-readable (browsing needs no account).
-- Applications are owner-or-managing-admin only.
-- =============================================================================

-- Shared helper for the phase-6 modules: a managing staff admin (mirrors the
-- rbac roles that hold program:manage / mentorship:manage / document:verify —
-- super_admin and grievance_officer; auditor is read-only oversight and excluded).
CREATE OR REPLACE FUNCTION admin_is_staff() RETURNS boolean
  LANGUAGE sql STABLE AS $$
    SELECT current_admin_role() IN ('super_admin', 'grievance_officer')
  $$;

CREATE TYPE program_cycle_status       AS ENUM ('draft', 'open', 'closed');
CREATE TYPE program_application_status AS ENUM
  ('draft', 'submitted', 'under_review', 'shortlisted', 'approved', 'rejected', 'withdrawn');

CREATE TABLE program (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  description text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE program_cycle (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES program(id) ON DELETE CASCADE,
  label      text NOT NULL,
  opens_at   timestamptz,
  closes_at  timestamptz,
  status     program_cycle_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX program_cycle_program_idx ON program_cycle (program_id);

CREATE TABLE program_application (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  cycle_id        uuid NOT NULL REFERENCES program_cycle(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organization(id) ON DELETE SET NULL,
  status          program_application_status NOT NULL DEFAULT 'submitted',
  answers         jsonb NOT NULL DEFAULT '{}',
  submitted_at    timestamptz,
  reviewed_by     uuid REFERENCES admin_user(id),
  reviewed_at     timestamptz,
  decision_note   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, cycle_id)
);
CREATE INDEX program_application_user_idx  ON program_application (user_id);
CREATE INDEX program_application_cycle_idx ON program_application (cycle_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
-- Catalog + cycles are public reference data: anyone may read; staff may write.
ALTER TABLE program ENABLE ROW LEVEL SECURITY;
ALTER TABLE program FORCE ROW LEVEL SECURITY;
CREATE POLICY program_select ON program FOR SELECT USING (true);
CREATE POLICY program_write  ON program FOR ALL
  USING (admin_is_staff()) WITH CHECK (admin_is_staff());

ALTER TABLE program_cycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_cycle FORCE ROW LEVEL SECURITY;
CREATE POLICY program_cycle_select ON program_cycle FOR SELECT USING (true);
CREATE POLICY program_cycle_write  ON program_cycle FOR ALL
  USING (admin_is_staff()) WITH CHECK (admin_is_staff());

-- Applications: the applicant (own rows) or a managing admin.
ALTER TABLE program_application ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_application FORCE ROW LEVEL SECURITY;
CREATE POLICY program_application_select ON program_application FOR SELECT
  USING (current_user_id() = user_id OR admin_is_staff());
CREATE POLICY program_application_insert ON program_application FOR INSERT
  WITH CHECK (current_user_id() = user_id);
CREATE POLICY program_application_update ON program_application FOR UPDATE
  USING (current_user_id() = user_id OR admin_is_staff())
  WITH CHECK (current_user_id() = user_id OR admin_is_staff());

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON program             TO prime_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON program_cycle       TO prime_app;
GRANT SELECT, INSERT, UPDATE         ON program_application TO prime_app;

-- ── Seed the canonical PRIME program catalog (idempotent reference data) ───────
INSERT INTO program (slug, name, description) VALUES
  ('incubation',    'Incubation / E-Champion Challenge',
   'The CM''s E-Champion Challenge — incubation, seed support and hand-holding for early-stage ventures.'),
  ('cm-elevate',    'CM ELEVATE',
   'Interest and collateral subsidy scheme to help existing enterprises scale up.'),
  ('prime-rural',   'PRIME Rural',
   'Support for rural and livelihood enterprises across Meghalaya''s blocks.'),
  ('market-linkage','Market Linkage',
   'Connecting Meghalaya''s producers and startups to markets, buyers and exhibitions.'),
  ('fellowship',    'PRIME Fellowship',
   'A fellowship placing talent inside the entrepreneurship ecosystem.'),
  ('tinkering-fund','Student Tinkering Fund',
   'Micro-grants for student innovators and school/college tinkering projects.')
ON CONFLICT (slug) DO NOTHING;
