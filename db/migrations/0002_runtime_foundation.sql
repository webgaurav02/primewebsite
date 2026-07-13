-- =============================================================================
-- 0002 — Runtime foundation: everything the live app needs beyond the initial
-- schema so the DAL can actually run against Postgres.
--
--   1. audit_log.actor_id becomes text — the public intake path audits as the
--      system actor ("public"), which is not a uuid.
--   2. Public grievance intake under RLS: an INSERT policy limited to freshly
--      submitted rows, plus the INSERT grant prime_app was missing.
--   3. ticket_sequence — race-safe per-region ticket numbering (the dev store
--      derived it from an in-memory scan, unusable under concurrency).
--   4. grievance_status_history: nullable changed_by (system writes from the
--      unauthenticated intake), RLS (read delegates to grievance policies).
--   5. Hash-chained audit writes move into SECURITY DEFINER functions owned by
--      the dedicated prime_audit role. Why: audit_log has FORCE RLS and its
--      SELECT policy is role-GUC-based, so the intake path (no admin GUCs)
--      could never read the previous hash to extend the chain. The definer
--      functions serialize on an advisory lock, compute the chain in SQL, and
--      are the ONLY write path (prime_app loses direct INSERT).
-- =============================================================================

-- ── 1) Mixed audit actors ─────────────────────────────────────────────────────
ALTER TABLE audit_log ALTER COLUMN actor_id TYPE text;

-- ── 2) Public intake under RLS ────────────────────────────────────────────────
-- Anyone holding INSERT (only prime_app) may create a grievance, but only in
-- its initial state. Updates remain governed by grievance_write.
CREATE POLICY grievance_insert_public ON grievance FOR INSERT
  WITH CHECK (status = 'submitted');
GRANT INSERT ON grievance TO prime_app;

-- ── 3) Race-safe ticket numbering ─────────────────────────────────────────────
CREATE TABLE ticket_sequence (
  region      region PRIMARY KEY,
  last_value  integer NOT NULL DEFAULT 0
);
-- Allocation is a single upsert:
--   INSERT ... VALUES (region, 1)
--   ON CONFLICT (region) DO UPDATE SET last_value = ticket_sequence.last_value + 1
--   RETURNING last_value;
GRANT SELECT, INSERT, UPDATE ON ticket_sequence TO prime_app;

-- ── 4) Status history: system writes + RLS ────────────────────────────────────
ALTER TABLE grievance_status_history ALTER COLUMN changed_by DROP NOT NULL;

ALTER TABLE grievance_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_status_history FORCE ROW LEVEL SECURITY;

-- Visibility delegates to the grievance policies: you can read a history row
-- iff you can read its grievance (region scoping included, for free).
CREATE POLICY gsh_read ON grievance_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM grievance g WHERE g.id = grievance_id)
);

-- Writers: the unauthenticated intake (no admin GUCs, changed_by NULL) or an
-- admin recording their own change. Nobody can forge history as someone else.
CREATE POLICY gsh_insert ON grievance_status_history FOR INSERT WITH CHECK (
  (changed_by IS NULL AND current_admin_id() IS NULL)
  OR changed_by = current_admin_id()
);

-- ── 5) Audit chain as SECURITY DEFINER functions ──────────────────────────────
-- prime_audit exists solely to own these functions and the policies below.
-- (The role itself is created by the migration runner / ops, like prime_app.)
GRANT SELECT, INSERT ON audit_log TO prime_audit;
GRANT USAGE ON SEQUENCE audit_log_seq_seq TO prime_audit;

CREATE POLICY audit_definer_read ON audit_log FOR SELECT TO prime_audit
  USING (true);
CREATE POLICY audit_definer_insert ON audit_log FOR INSERT TO prime_audit
  WITH CHECK (true);

-- All audit writes flow through record_audit(); no direct INSERT for the app.
REVOKE INSERT ON audit_log FROM prime_app;

-- Canonical form (must stay in lock-step between record_audit and
-- verify_audit_chain — both live here precisely so they can never drift):
--   jsonb_build_array(seq, actor_id, actor_email, action, resource_type,
--                     resource_id, metadata, ip::text, at-as-UTC-ISO, prev_hash)::text
CREATE OR REPLACE FUNCTION record_audit(
  p_actor_id       text,
  p_actor_email    text,
  p_action         text,
  p_resource_type  text,
  p_resource_id    text,
  p_metadata       jsonb,
  p_ip             text
) RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_prev  text;
  v_seq   bigint;
  v_at    timestamptz := clock_timestamp();
  v_meta  jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_ip    inet  := nullif(p_ip, '')::inet;
  v_hash  text;
BEGIN
  -- Serialize appends so the chain never forks under concurrency.
  PERFORM pg_advisory_xact_lock(hashtext('audit_log_chain'));

  SELECT hash INTO v_prev FROM audit_log ORDER BY seq DESC LIMIT 1;
  IF v_prev IS NULL THEN
    v_prev := repeat('0', 64);
  END IF;

  v_seq := nextval(pg_get_serial_sequence('audit_log', 'seq'));

  v_hash := encode(digest(
    jsonb_build_array(
      v_seq, p_actor_id, p_actor_email, p_action, p_resource_type,
      p_resource_id, v_meta, v_ip::text,
      to_char(v_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
      v_prev
    )::text, 'sha256'), 'hex');

  INSERT INTO audit_log
    (seq, actor_id, actor_email, action, resource_type, resource_id,
     metadata, ip, at, prev_hash, hash)
  OVERRIDING SYSTEM VALUE
  VALUES
    (v_seq, p_actor_id, p_actor_email, p_action, p_resource_type, p_resource_id,
     v_meta, v_ip, v_at, v_prev, v_hash);

  RETURN v_seq;
END;
$$;

CREATE OR REPLACE FUNCTION verify_audit_chain()
RETURNS TABLE (ok boolean, broken_at_seq bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  r       record;
  v_prev  text := repeat('0', 64);
  v_hash  text;
BEGIN
  FOR r IN SELECT * FROM audit_log ORDER BY seq LOOP
    v_hash := encode(digest(
      jsonb_build_array(
        r.seq, r.actor_id, r.actor_email, r.action, r.resource_type,
        r.resource_id, r.metadata, r.ip::text,
        to_char(r.at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
        v_prev
      )::text, 'sha256'), 'hex');
    IF r.prev_hash <> v_prev OR r.hash <> v_hash THEN
      RETURN QUERY SELECT false, r.seq;
      RETURN;
    END IF;
    v_prev := r.hash;
  END LOOP;
  RETURN QUERY SELECT true, NULL::bigint;
END;
$$;

ALTER FUNCTION record_audit(text, text, text, text, text, jsonb, text)
  OWNER TO prime_audit;
ALTER FUNCTION verify_audit_chain() OWNER TO prime_audit;

REVOKE ALL ON FUNCTION record_audit(text, text, text, text, text, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION verify_audit_chain() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION record_audit(text, text, text, text, text, jsonb, text) TO prime_app;
GRANT EXECUTE ON FUNCTION verify_audit_chain() TO prime_app;
