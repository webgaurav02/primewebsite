-- =============================================================================
-- 0019 — Admin directory management under RLS.
--
-- Lets a super_admin manage the admin_user / admin_region directory from the
-- console (create officers, set roles, scope regions, enable/disable). Until
-- 0019 these tables had NO RLS and prime_app held only SELECT, so admins could
-- only be provisioned via raw SQL / db/seed-dev.ts.
--
-- Authorization: WRITES are gated to current_admin_role() = 'super_admin',
-- mirroring the DAL's assertCan("admin:manage"). This is defence-in-depth — even
-- if a DAL bug issued an admin_user write from a non-super_admin (or the
-- unauthenticated public intake) context, RLS refuses it.
--
-- READS are kept permissive: the grievance / status-history RLS policies and the
-- assignment-target listing all evaluate EXISTS(SELECT ... FROM admin_region ...)
-- (and read admin_user) as prime_app inside an admin context. A restrictive read
-- policy would silently filter those subqueries to empty and break region
-- scoping. The console pages are still gated on admin:manage in the DAL.
--
-- FK note: grievance.assigned_to REFERENCES admin_user(id); referential-integrity
-- checks bypass RLS, so enabling RLS here does not affect grievance writes. The
-- migrator/seed connect as the owning superuser, which bypasses RLS entirely.
-- =============================================================================

-- ── Grants (prime_app previously had SELECT only) ─────────────────────────────
-- No DELETE on admin_user: an admin with grievances assigned cannot be deleted
-- (assigned_to is RESTRICT), and history must never lose its actor. The console
-- disables accounts (is_active) instead. Region membership is edited by
-- delete-all + insert, so admin_region needs DELETE.
GRANT INSERT, UPDATE ON admin_user TO prime_app;
GRANT INSERT, DELETE ON admin_region TO prime_app;

-- ── RLS: admin_user ───────────────────────────────────────────────────────────
ALTER TABLE admin_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user FORCE ROW LEVEL SECURITY;

CREATE POLICY admin_user_read ON admin_user FOR SELECT
  USING (current_admin_id() IS NOT NULL);

CREATE POLICY admin_user_write ON admin_user FOR ALL
  USING (current_admin_role() = 'super_admin')
  WITH CHECK (current_admin_role() = 'super_admin');

-- ── RLS: admin_region ─────────────────────────────────────────────────────────
ALTER TABLE admin_region ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_region FORCE ROW LEVEL SECURITY;

-- Permissive read (see header): the grievance policies join this table.
CREATE POLICY admin_region_read ON admin_region FOR SELECT USING (true);

CREATE POLICY admin_region_write ON admin_region FOR ALL
  USING (current_admin_role() = 'super_admin')
  WITH CHECK (current_admin_role() = 'super_admin');
