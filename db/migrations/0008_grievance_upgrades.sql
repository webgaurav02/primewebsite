-- =============================================================================
-- 0008 — Grievance upgrades: account linkage, category, escalation, SLA,
-- enumeration-safe public tracking.
--
--   user_id            — links a grievance to the logged-in submitter so it
--                        appears in their timeline / account and they get
--                        status notifications.
--   category           — 4 categories + procurement (DPDP: data_protection).
--   escalation_level   — L0 PRIME Admin → L1 Programme Heads → L2 Director
--                        MBMA/MIE → L3 CEO MBMA.
--   sla_ack_due / _resolve_due — ack ≤ 3 working days, resolve ≤ 30 days.
--   complainant_email_bidx — keyed blind index (HMAC) of the email so public
--                        tracking needs ticket_ref AND the email (sequential
--                        refs alone must not expose another person's status).
-- =============================================================================

CREATE TYPE grievance_category AS ENUM
  ('data_protection', 'programme', 'website', 'general', 'procurement');

ALTER TABLE grievance
  ADD COLUMN user_id                uuid REFERENCES app_user(id) ON DELETE SET NULL,
  ADD COLUMN category               grievance_category NOT NULL DEFAULT 'general',
  ADD COLUMN escalation_level       integer NOT NULL DEFAULT 0
    CHECK (escalation_level BETWEEN 0 AND 3),
  ADD COLUMN sla_ack_due            timestamptz,
  ADD COLUMN sla_resolve_due        timestamptz,
  ADD COLUMN complainant_email_bidx text;

CREATE INDEX grievance_user_idx ON grievance (user_id);
CREATE INDEX grievance_bidx_idx ON grievance (complainant_email_bidx);

-- ── RLS: a member may read their own linked grievances ────────────────────────
-- (Adds to the existing admin/region policies; RLS policies are OR-ed.)
CREATE POLICY grievance_read_own ON grievance FOR SELECT
  USING (current_user_id() = user_id);

-- ── Enumeration-safe public tracking (SECURITY DEFINER) ───────────────────────
-- Requires ticket_ref AND the email blind index; returns PII-free status +
-- date history (never the description, contact, or admin notes).
GRANT SELECT ON grievance, grievance_status_history TO prime_audit;
CREATE POLICY grievance_definer_read ON grievance FOR SELECT
  TO prime_audit USING (true);
CREATE POLICY gsh_definer_read ON grievance_status_history FOR SELECT
  TO prime_audit USING (true);

CREATE FUNCTION grievance_track(p_ref text, p_email_bidx text)
RETURNS TABLE (
  ticket_ref       text,
  region           region,
  category         grievance_category,
  status           grievance_status,
  escalation_level integer,
  created_at       timestamptz,
  updated_at       timestamptz,
  history          jsonb
)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT g.ticket_ref, g.region, g.category, g.status, g.escalation_level,
         g.created_at, g.updated_at,
         coalesce((
           SELECT jsonb_agg(jsonb_build_object('to', h.to_status, 'at', h.changed_at)
                            ORDER BY h.changed_at)
           FROM grievance_status_history h WHERE h.grievance_id = g.id
         ), '[]'::jsonb)
  FROM grievance g
  WHERE g.ticket_ref = p_ref
    AND g.complainant_email_bidx IS NOT NULL
    AND g.complainant_email_bidx = p_email_bidx
$$;
ALTER FUNCTION grievance_track(text, text) OWNER TO prime_audit;
REVOKE ALL ON FUNCTION grievance_track(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grievance_track(text, text) TO prime_app;
