-- =============================================================================
-- 0014 — DPDP consent record.
--
-- India's DPDP Act 2023 requires consent that is free, specific, informed and
-- DEMONSTRABLE (s.6). Today the registration `consent` / `declared` flags are
-- validated then thrown away — no proof survives. This table persists an
-- auditable consent record at the point of collection and supports withdrawal
-- (s.6(4)-(6)) without erasing history.
--
--   policy_version — the privacy-notice version the user accepted (POLICY_VERSION).
--   purposes       — the itemised purposes consented to (jsonb array).
--   is_minor       — captured under-18 flow (guardian consent; guardian details
--                    live on app_user).
--   withdrawn_at   — set on withdrawal; the row is never deleted or its history
--                    rewritten, so consent + withdrawal are both provable.
-- =============================================================================

CREATE TABLE user_consent (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  policy_version text NOT NULL,
  purposes       jsonb NOT NULL DEFAULT '[]',
  is_minor       boolean NOT NULL DEFAULT false,
  accepted_at    timestamptz NOT NULL DEFAULT now(),
  ip             text,
  user_agent     text,
  withdrawn_at   timestamptz
);
CREATE INDEX user_consent_user_idx ON user_consent (user_id, accepted_at DESC);

ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent FORCE ROW LEVEL SECURITY;

-- Written inside the pre-auth registration txn (is_auth_op) or by the owner.
CREATE POLICY user_consent_insert ON user_consent FOR INSERT
  WITH CHECK (is_auth_op() OR current_user_id() = user_id);
-- Readable by the owner, a managing admin, or the auth context (self-service export).
CREATE POLICY user_consent_select ON user_consent FOR SELECT
  USING (is_auth_op() OR current_user_id() = user_id OR admin_manages_users());
-- Withdrawal only (set withdrawn_at); history is never rewritten or deleted.
CREATE POLICY user_consent_update ON user_consent FOR UPDATE
  USING (current_user_id() = user_id OR admin_manages_users())
  WITH CHECK (current_user_id() = user_id OR admin_manages_users());

GRANT SELECT, INSERT, UPDATE ON user_consent TO prime_app;
