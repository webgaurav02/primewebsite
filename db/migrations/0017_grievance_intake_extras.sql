-- =============================================================================
-- 0017 — Grievance intake extras: optional PRIME ID + business name, recorded
-- DPDP consent, and file/photo attachments (parity with the legacy paper form,
-- brought under the DPDP Act, 2023).
--
--   prime_id_ref / business_name — optional, self-declared identifiers that help
--       route and identify an entrepreneur's grievance. Not contact PII; stored
--       in the clear like subject/description (never Aadhaar/bank — the form
--       tells complainants not to paste those).
--   consent_version / consent_at — the DPDP consent the complainant gave at
--       submission, so consent is demonstrable per §6 of the Act.
--   grievance_attachment — supporting documents/photos. The bytes live in
--       private object storage (R2); the row holds only the opaque key + metadata,
--       exactly like the member document vault (0011).
-- =============================================================================

ALTER TABLE grievance
  ADD COLUMN prime_id_ref    text,
  ADD COLUMN business_name   text,
  ADD COLUMN consent_version text,
  ADD COLUMN consent_at      timestamptz;

-- ── Attachments ───────────────────────────────────────────────────────────────
CREATE TABLE grievance_attachment (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id  uuid NOT NULL REFERENCES grievance(id) ON DELETE CASCADE,
  file_key      text NOT NULL,            -- opaque R2 object key
  mime          text NOT NULL,
  size_bytes    integer NOT NULL,
  original_name text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX grievance_attachment_grievance_idx ON grievance_attachment (grievance_id);

ALTER TABLE grievance_attachment ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_attachment FORCE ROW LEVEL SECURITY;

-- Read delegates to the grievance's own SELECT policies (admin region scope +
-- member-own), for free — exactly like grievance_status_history's gsh_read. In
-- the anonymous public context no grievance is visible, so attachments aren't
-- readable there either (the public tracker never exposes them).
CREATE POLICY grievance_attachment_read ON grievance_attachment FOR SELECT
  USING (EXISTS (SELECT 1 FROM grievance g WHERE g.id = grievance_id));

-- The public intake (no admin/user GUCs) can't SELECT the grievance under RLS,
-- so the INSERT check can't rely on the delegated visibility used for reads.
-- A SECURITY DEFINER helper (owned by prime_audit, which may read grievance)
-- verifies the target is a real, freshly-submitted grievance. The grievance
-- UUID is server-generated and never exposed to the client (only ticket_ref
-- is), so the intake can only ever attach to a grievance it just created.
CREATE FUNCTION grievance_is_submitted(p_id uuid) RETURNS boolean
  LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
    SELECT EXISTS (
      SELECT 1 FROM grievance WHERE id = p_id AND status = 'submitted'
    )
  $$;
ALTER FUNCTION grievance_is_submitted(uuid) OWNER TO prime_audit;
REVOKE ALL ON FUNCTION grievance_is_submitted(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION grievance_is_submitted(uuid) TO prime_app;

CREATE POLICY grievance_attachment_insert ON grievance_attachment FOR INSERT
  WITH CHECK (grievance_is_submitted(grievance_id));

-- Auditors/officers read; the app inserts. No UPDATE (attachments are immutable);
-- DELETE happens only via ON DELETE CASCADE when a grievance is removed.
GRANT SELECT, INSERT ON grievance_attachment TO prime_app;
