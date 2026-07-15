-- =============================================================================
-- 0018 — Let members create their OWN business profile from the account area.
--
-- At registration the org + entrepreneur_profile are inserted in the auth
-- context (is_auth_op). The self-serve profile editor runs in the member's own
-- user context, where the existing UPDATE policies already allow owners to edit
-- their rows — but the INSERT policies only allowed auth-op/admin. So a member
-- who registered WITHOUT a business (student, aspiring entrepreneur, …) could
-- not add one later.
--
-- These additive INSERT policies let a member insert exactly their own rows:
-- an organisation they create (created_by = themselves) and their 1:1
-- entrepreneur_profile (user_id = themselves). Editing existing rows already
-- works via the owner UPDATE policies from 0004. Grants are unchanged
-- (prime_app already has INSERT on both tables).
-- =============================================================================

DROP POLICY IF EXISTS organization_insert ON organization;
CREATE POLICY organization_insert ON organization FOR INSERT WITH CHECK (
  is_auth_op() OR admin_manages_users() OR created_by = current_user_id()
);

DROP POLICY IF EXISTS entrepreneur_profile_insert ON entrepreneur_profile;
CREATE POLICY entrepreneur_profile_insert ON entrepreneur_profile FOR INSERT WITH CHECK (
  is_auth_op() OR admin_manages_users() OR user_id = current_user_id()
);
