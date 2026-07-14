-- =============================================================================
-- 0012 — Mentorship counterpart visibility.
--
-- A mentorship pairs two members; each legitimately needs to see the OTHER's
-- name (the mentee sees their mentor, the mentor sees their mentees). The base
-- app_user policy only exposes a member's own row, so add a narrow, additive
-- SELECT policy (RLS policies are OR-ed) that lets a member read the app_user
-- row of anyone they share a mentorship_assignment with.
--
-- Safe within the DAL-is-the-only-boundary model: members cannot run arbitrary
-- SQL, and the mentorship DAL only ever selects full_name for a counterpart.
-- The subquery references mentorship_assignment, whose own SELECT policy does
-- not reference app_user, so there is no policy recursion.
-- =============================================================================

CREATE POLICY app_user_mentorship_counterpart ON app_user FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM mentorship_assignment ma
    WHERE (ma.mentor_id = app_user.id AND ma.mentee_id = current_user_id())
       OR (ma.mentee_id = app_user.id AND ma.mentor_id = current_user_id())
  )
);
