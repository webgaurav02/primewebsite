-- =============================================================================
-- 0013 — Self-serve registration data model.
--
-- Reframes public registration from the old passwordless "apply → admin
-- approval" flow into a self-serve credentialed signup. Identity is now driven
-- by registrant_type (the 8-value "Who are you?" selector); persona becomes a
-- DERIVED, nullable field so the subsystems that key off it (mentorship,
-- admin filter) keep working without every registrant type forcing a persona.
--
--   registrant_type      — the self-declared identity, source of truth.
--   persona (now NULL-able)— derived: mentor→mentor, entrepreneur types→
--                          entrepreneur, everything else NULL (no venture/mentee
--                          semantics). Do NOT extend the persona ENUM in place —
--                          migrate.ts wraps each file in one txn and a value
--                          added by ALTER TYPE cannot be used in the same txn.
--   photo_path           — private R2 object key for an OPTIONAL profile photo
--                          (facial image; kept separate from the public PRIME-ID
--                          card photo).
--   guardian_name / _relationship — captured for minors (< 18), DPDP s.9.
-- =============================================================================

CREATE TYPE registrant_type AS ENUM (
  'entrepreneur_existing',
  'aspiring_entrepreneur',
  'student',
  'mentor',
  'government_official',
  'corporate_professional',
  'prime_staff',
  'other'
);

ALTER TABLE app_user
  ADD COLUMN registrant_type       registrant_type,
  ADD COLUMN photo_path            text,
  ADD COLUMN guardian_name         text,
  ADD COLUMN guardian_relationship text;

-- persona is now derived and may be NULL for non-founder / non-mentor registrants.
ALTER TABLE app_user ALTER COLUMN persona DROP NOT NULL;

-- Backfill registrant_type for any existing rows (dev / legacy applicants).
UPDATE app_user SET registrant_type =
  CASE persona
    WHEN 'mentor'       THEN 'mentor'::registrant_type
    WHEN 'entrepreneur' THEN 'entrepreneur_existing'::registrant_type
    ELSE 'other'::registrant_type
  END
  WHERE registrant_type IS NULL;

-- No RLS or GRANT change: app_user policies gate by row/context, never by column,
-- so the new columns inherit the existing policies; prime_app already holds
-- SELECT/INSERT/UPDATE on app_user.
