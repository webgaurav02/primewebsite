-- =============================================================================
-- 0010 — Mentorship: assignments, logged sessions, and the 5-hour certificate.
--
--   mentorship_assignment — an admin pairs a mentor (app_user persona 'mentor')
--                           with a mentee. At most ONE active mentor per mentee
--                           (partial-unique). Replaces the old users.mentorId.
--   mentorship_session    — a session logged against an assignment (minutes).
--   mentor_certificate    — auto-issued once a mentor logs ≥ 300 minutes (5 h)
--                           across all their assignments. One per mentor.
--   mentor_certificate_sequence — race-safe per-year serial allocator.
-- =============================================================================

CREATE TYPE mentorship_status AS ENUM ('active', 'ended');
CREATE TYPE mentorship_mode   AS ENUM ('in_person', 'virtual', 'phone');

CREATE TABLE mentorship_assignment (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id   uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  mentee_id   uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES admin_user(id),
  status      mentorship_status NOT NULL DEFAULT 'active',
  started_at  timestamptz NOT NULL DEFAULT now(),
  ended_at    timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (mentor_id <> mentee_id)
);
CREATE INDEX mentorship_mentor_idx ON mentorship_assignment (mentor_id);
CREATE INDEX mentorship_mentee_idx ON mentorship_assignment (mentee_id);
-- At most one ACTIVE mentor per mentee.
CREATE UNIQUE INDEX mentorship_one_active_mentor
  ON mentorship_assignment (mentee_id) WHERE status = 'active';

CREATE TABLE mentorship_session (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id    uuid NOT NULL REFERENCES mentorship_assignment(id) ON DELETE CASCADE,
  occurred_at      timestamptz NOT NULL DEFAULT now(),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  mode             mentorship_mode NOT NULL DEFAULT 'virtual',
  notes            text,
  logged_by        uuid REFERENCES app_user(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX mentorship_session_assignment_idx ON mentorship_session (assignment_id);

CREATE TABLE mentor_certificate (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id     uuid NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE,
  total_minutes integer NOT NULL,
  serial        text NOT NULL UNIQUE,
  issued_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE mentor_certificate_sequence (
  year       integer PRIMARY KEY,
  last_value integer NOT NULL DEFAULT 0
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
-- Assignment: the mentor or the mentee sees their own; staff manage all.
ALTER TABLE mentorship_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_assignment FORCE ROW LEVEL SECURITY;
CREATE POLICY mentorship_assignment_select ON mentorship_assignment FOR SELECT
  USING (current_user_id() IN (mentor_id, mentee_id) OR admin_is_staff());
CREATE POLICY mentorship_assignment_write ON mentorship_assignment FOR ALL
  USING (admin_is_staff()) WITH CHECK (admin_is_staff());

-- Session: readable by that assignment's mentor/mentee; insertable by the
-- assignment's mentor (logging their own session) or staff.
ALTER TABLE mentorship_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_session FORCE ROW LEVEL SECURITY;
CREATE POLICY mentorship_session_select ON mentorship_session FOR SELECT USING (
  admin_is_staff() OR EXISTS (
    SELECT 1 FROM mentorship_assignment a
    WHERE a.id = mentorship_session.assignment_id
      AND current_user_id() IN (a.mentor_id, a.mentee_id)
  )
);
CREATE POLICY mentorship_session_insert ON mentorship_session FOR INSERT WITH CHECK (
  admin_is_staff() OR EXISTS (
    SELECT 1 FROM mentorship_assignment a
    WHERE a.id = mentorship_session.assignment_id
      AND a.status = 'active'
      AND a.mentor_id = current_user_id()
  )
);

-- Certificate: the mentor reads their own; staff read all. Issued by the mentor
-- context (auto, inside the session-log txn) or staff.
ALTER TABLE mentor_certificate ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_certificate FORCE ROW LEVEL SECURITY;
CREATE POLICY mentor_certificate_select ON mentor_certificate FOR SELECT
  USING (current_user_id() = mentor_id OR admin_is_staff());
CREATE POLICY mentor_certificate_insert ON mentor_certificate FOR INSERT
  WITH CHECK (current_user_id() = mentor_id OR admin_is_staff());

-- Sequence table is internal: reachable only inside the certificate-issuing txn,
-- which already holds a mentor/staff context. No public policy needed beyond the
-- grant; enable RLS with staff/mentor-context write.
ALTER TABLE mentor_certificate_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_certificate_sequence FORCE ROW LEVEL SECURITY;
CREATE POLICY mentor_certificate_sequence_rw ON mentor_certificate_sequence FOR ALL
  USING (current_user_id() IS NOT NULL OR admin_is_staff())
  WITH CHECK (current_user_id() IS NOT NULL OR admin_is_staff());

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON mentorship_assignment       TO prime_app;
GRANT SELECT, INSERT         ON mentorship_session          TO prime_app;
GRANT SELECT, INSERT         ON mentor_certificate          TO prime_app;
GRANT SELECT, INSERT, UPDATE ON mentor_certificate_sequence TO prime_app;
