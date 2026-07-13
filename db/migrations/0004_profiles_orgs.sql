-- =============================================================================
-- 0004 — Per-persona profiles, organisations, and the entrepreneur application.
--
-- primewebsite's /register is a password-LESS "Apply to PRIME" application. So
-- the intake path creates a PENDING app_user (no credential) + an
-- entrepreneur_profile + an organisation, all in the auth context (applying is
-- a deliberate pre-auth operation). An admin later approves, which issues a
-- "set your password" activation link (reuses the email-token + reset flow).
--
-- All new tables follow the same RLS contract: reachable by the owner
-- (current_user_id), by admins who manage users, or inside the auth context.
-- =============================================================================

-- Companies / ventures. The managed "Company/Startup" entity.
CREATE TABLE organization (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  sector           text,
  district         text,
  entity_type      text,
  stage            text,
  year_started     integer,
  address          text,
  description      text,
  employment_count integer,
  turnover         text,
  website          text,
  created_by       uuid REFERENCES app_user(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Each app_user may be linked to one organisation (their venture).
ALTER TABLE app_user
  ADD COLUMN organization_id uuid REFERENCES organization(id) ON DELETE SET NULL;

-- The entrepreneur application snapshot (1:1 with app_user).
CREATE TABLE entrepreneur_profile (
  user_id          uuid PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  business_name    text,
  sector           text,
  entity_type      text,
  stage            text,
  year_established  integer,
  address          text,
  description      text,
  employment_count integer,
  lives_impacted   integer,
  turnover         text,
  govt_funding     text,
  external_funding text,
  products         text,
  social_impact    text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE mentor_profile (
  user_id          uuid PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  expertise        text[] NOT NULL DEFAULT '{}',
  affiliation      text,
  years_experience integer,
  bio              text,
  linkedin         text,
  availability_note text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE investor_profile (
  user_id      uuid PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  firm_name    text,
  sectors      text[] NOT NULL DEFAULT '{}',
  ticket_range text,
  bio          text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ── RLS: shared owner/admin/auth-op pattern ───────────────────────────────────
-- organization: owner = creator or the linked member; admins manage; auth-op inserts.
ALTER TABLE organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization FORCE ROW LEVEL SECURITY;
CREATE POLICY organization_select ON organization FOR SELECT USING (
  is_auth_op()
  OR admin_manages_users()
  OR created_by = current_user_id()
  OR EXISTS (SELECT 1 FROM app_user u WHERE u.id = current_user_id() AND u.organization_id = organization.id)
);
CREATE POLICY organization_insert ON organization FOR INSERT WITH CHECK (
  is_auth_op() OR admin_manages_users()
);
CREATE POLICY organization_update ON organization FOR UPDATE
  USING (is_auth_op() OR admin_manages_users() OR created_by = current_user_id())
  WITH CHECK (is_auth_op() OR admin_manages_users() OR created_by = current_user_id());

-- Profile tables all share the same policy shape (own row / admin / auth-op).
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['entrepreneur_profile','mentor_profile','investor_profile'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format($p$CREATE POLICY %1$s_select ON %1$I FOR SELECT
      USING (is_auth_op() OR admin_manages_users() OR user_id = current_user_id())$p$, t);
    EXECUTE format($p$CREATE POLICY %1$s_insert ON %1$I FOR INSERT
      WITH CHECK (is_auth_op() OR admin_manages_users())$p$, t);
    EXECUTE format($p$CREATE POLICY %1$s_update ON %1$I FOR UPDATE
      USING (is_auth_op() OR admin_manages_users() OR user_id = current_user_id())
      WITH CHECK (is_auth_op() OR admin_manages_users() OR user_id = current_user_id())$p$, t);
  END LOOP;
END $$;

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON organization         TO prime_app;
GRANT SELECT, INSERT, UPDATE ON entrepreneur_profile TO prime_app;
GRANT SELECT, INSERT, UPDATE ON mentor_profile       TO prime_app;
GRANT SELECT, INSERT, UPDATE ON investor_profile     TO prime_app;
