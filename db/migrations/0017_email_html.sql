-- ── Email outbox: HTML bodies ────────────────────────────────────────────────
-- Transactional email is now rendered from React Email templates, which produce
-- a branded HTML body alongside the plain-text fallback. The outbox stays the
-- durable boundary: we render once at enqueue time and store BOTH the HTML and
-- the text so a queued message survives provider outages without needing to be
-- re-rendered. Nullable so any pre-existing rows (text-only) still send.
ALTER TABLE email_outbox ADD COLUMN body_html text;
