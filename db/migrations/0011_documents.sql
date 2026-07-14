-- =============================================================================
-- 0011 — Document vault (KYC / business documents).
--
--   document — a file a member uploads for verification (Aadhaar, PAN, business
--              registration, bank statement, GST, …). The bytes live in private
--              object storage (R2); the DB holds only the opaque key + metadata.
--              "Not uploaded" = absence of a row. State: pending→verified/rejected.
--
-- RLS is the IDOR guard: a member reaches ONLY their own documents; staff with
-- document:verify read all and set the verification status. The file bytes are
-- served through a route that re-checks ownership via this same RLS.
-- =============================================================================

CREATE TYPE document_kind   AS ENUM
  ('aadhaar', 'pan', 'business_reg', 'bank_statement', 'gst', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE document (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  kind             document_kind NOT NULL,
  file_key         text NOT NULL,          -- opaque R2 object key
  mime             text NOT NULL,
  size_bytes       integer NOT NULL,
  original_name    text,
  status           document_status NOT NULL DEFAULT 'pending',
  uploaded_at      timestamptz NOT NULL DEFAULT now(),
  verified_by      uuid REFERENCES admin_user(id),
  verified_at      timestamptz,
  rejection_reason text
);
CREATE INDEX document_user_idx   ON document (user_id);
CREATE INDEX document_status_idx ON document (status);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE document ENABLE ROW LEVEL SECURITY;
ALTER TABLE document FORCE ROW LEVEL SECURITY;
-- Owner or verifying staff may read (this is the IDOR guard for file serving).
CREATE POLICY document_select ON document FOR SELECT
  USING (current_user_id() = user_id OR admin_is_staff());
-- Only the owner uploads their own document.
CREATE POLICY document_insert ON document FOR INSERT
  WITH CHECK (current_user_id() = user_id);
-- Staff set verification status; the owner may reset it by re-uploading.
CREATE POLICY document_update ON document FOR UPDATE
  USING (current_user_id() = user_id OR admin_is_staff())
  WITH CHECK (current_user_id() = user_id OR admin_is_staff());
-- The owner may delete their own document (to replace a rejected one).
CREATE POLICY document_delete ON document FOR DELETE
  USING (current_user_id() = user_id);

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON document TO prime_app;
