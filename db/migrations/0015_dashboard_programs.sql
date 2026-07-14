-- =============================================================================
-- 0015 — Dashboard apply-targets: seed the remaining PRIME offerings + open a
-- cycle for every active program.
--
-- The member dashboard should let a self-serve member apply for PRIME ID (its own
-- bespoke flow) plus: Pre-Incubation, Funding, Mentoring, Startup Hub Office Space,
-- and Entrepreneur of the Month. Five of those six are pure programs on the
-- generic program/cycle/application engine (0009) — so this migration just adds
-- the catalog rows and opens an intake cycle. No new tables/DAL/pages needed.
--
-- Before this, ZERO program_cycle rows existed, so /account/programs showed
-- "No programs are open" for everyone. This opens one cycle per active program.
-- =============================================================================

INSERT INTO program (slug, name, description) VALUES
  ('pre-incubation', 'PRIME Pre-Incubation',
   'Early hand-holding, idea validation and readiness support before formal incubation.'),
  ('prime-funding', 'PRIME Funding',
   'Grant and subsidy support for eligible Meghalaya ventures.'),
  ('mentoring', 'PRIME Mentoring',
   'Request a PRIME mentor matched to your sector and stage.'),
  ('startup-hub-office-space', 'PRIME Startup Hub Office Space',
   'Apply for co-working or office space at a PRIME Startup Hub (Shillong, Tura, Nongpoh, Jowai).'),
  ('entrepreneur-of-the-month', 'Entrepreneur of the Month',
   'Nominate yourself for PRIME''s monthly recognition of standout entrepreneurs.')
ON CONFLICT (slug) DO NOTHING;

-- Open a "2026 Intake" cycle for every active program that has no open cycle yet
-- (idempotent: the NOT EXISTS guard means a re-run wouldn't duplicate).
INSERT INTO program_cycle (program_id, label, status, opens_at)
SELECT p.id, '2026 Intake', 'open', now()
FROM program p
WHERE p.is_active
  AND NOT EXISTS (
    SELECT 1 FROM program_cycle c WHERE c.program_id = p.id AND c.status = 'open'
  );
