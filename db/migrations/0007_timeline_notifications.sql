-- =============================================================================
-- 0007 — Unified timeline, in-app notifications, and a durable email outbox.
--
--   timeline_event  — one event stream powering BOTH a member's private
--                     journey (user_id set) AND admin-published public events
--                     (user_id NULL, visibility 'public').
--   notification    — per-user in-app notifications (read/unread).
--   email_outbox    — queued email with retry, so provider limits/outages queue
--                     mail instead of dropping it. Managed in a SYSTEM context
--                     (app.system_op) by lib/email; admins may inspect it.
-- =============================================================================

CREATE TYPE timeline_visibility AS ENUM ('private', 'public');
CREATE TYPE email_status        AS ENUM ('pending', 'sent', 'failed');

-- helper: a deliberate system/background operation (email worker, jobs)
CREATE OR REPLACE FUNCTION is_system_op() RETURNS boolean
  LANGUAGE sql STABLE AS $$
    SELECT current_setting('app.system_op', true) = '1'
  $$;

-- ── Timeline ──────────────────────────────────────────────────────────────────
CREATE TABLE timeline_event (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES app_user(id) ON DELETE CASCADE,  -- NULL = public
  type         text NOT NULL,
  title        text NOT NULL,
  body         text,
  metadata     jsonb NOT NULL DEFAULT '{}',
  visibility   timeline_visibility NOT NULL DEFAULT 'private',
  occurs_at    timestamptz,                 -- scheduled/public events; else created_at
  published_by uuid REFERENCES admin_user(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX timeline_event_user_idx ON timeline_event (user_id, created_at DESC);
CREATE INDEX timeline_event_public_idx
  ON timeline_event (visibility, coalesce(occurs_at, created_at) DESC);

ALTER TABLE timeline_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_event FORCE ROW LEVEL SECURITY;
CREATE POLICY timeline_select ON timeline_event FOR SELECT USING (
  visibility = 'public' OR current_user_id() = user_id OR admin_manages_users()
);
CREATE POLICY timeline_insert ON timeline_event FOR INSERT WITH CHECK (
  is_auth_op() OR admin_manages_users() OR current_user_id() = user_id
);

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE notification (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  type       text NOT NULL,
  title      text NOT NULL,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notification_user_idx ON notification (user_id, created_at DESC);
CREATE INDEX notification_unread_idx ON notification (user_id) WHERE read_at IS NULL;

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification FORCE ROW LEVEL SECURITY;
CREATE POLICY notification_select ON notification FOR SELECT
  USING (current_user_id() = user_id OR admin_manages_users());
CREATE POLICY notification_insert ON notification FOR INSERT
  WITH CHECK (is_auth_op() OR admin_manages_users() OR current_user_id() = user_id);
CREATE POLICY notification_update ON notification FOR UPDATE
  USING (current_user_id() = user_id) WITH CHECK (current_user_id() = user_id);

-- ── Email outbox ──────────────────────────────────────────────────────────────
CREATE TABLE email_outbox (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email   text NOT NULL,
  subject    text NOT NULL,
  body       text NOT NULL,
  status     email_status NOT NULL DEFAULT 'pending',
  attempts   integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at    timestamptz
);
CREATE INDEX email_outbox_pending_idx ON email_outbox (created_at) WHERE status = 'pending';

ALTER TABLE email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_outbox FORCE ROW LEVEL SECURITY;
CREATE POLICY email_outbox_insert ON email_outbox FOR INSERT
  WITH CHECK (is_system_op() OR admin_manages_users());
CREATE POLICY email_outbox_select ON email_outbox FOR SELECT
  USING (is_system_op() OR admin_manages_users());
CREATE POLICY email_outbox_update ON email_outbox FOR UPDATE
  USING (is_system_op()) WITH CHECK (is_system_op());

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT          ON timeline_event TO prime_app;
GRANT SELECT, INSERT, UPDATE  ON notification   TO prime_app;
GRANT SELECT, INSERT, UPDATE  ON email_outbox   TO prime_app;
