import "server-only";
import { requireAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { withAdminContext } from "@/lib/db/client";

/**
 * Aggregate counts for the admin landing page. Each module block is included
 * only if the viewer holds the relevant permission, so an auditor sees just the
 * grievance figures and a grievance officer's numbers are region-scoped by RLS.
 *
 * All counts run under withAdminContext, so RLS applies: a query for a table the
 * viewer's role cannot read returns 0 rather than erroring. Reads are not
 * audited (a dashboard render is not an administrative action).
 */

export interface AdminDashboard {
  users: { total: number; pending: number; unverified: number } | null;
  primeId: { pending: number } | null;
  programs: { pendingDecisions: number; openCycles: number } | null;
  documents: { pending: number } | null;
  mentorship: { active: number; certificates: number } | null;
  grievances: { total: number; unassigned: number; open: number } | null;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const viewer = await requireAdmin();

  const want = {
    users: can(viewer, "user:manage"),
    primeId: can(viewer, "prime_id:review"),
    programs: can(viewer, "program:manage"),
    documents: can(viewer, "document:verify"),
    mentorship: can(viewer, "mentorship:manage"),
    grievances: can(viewer, "grievance:read"),
  };

  return withAdminContext(viewer, async (tx) => {
    const result: AdminDashboard = {
      users: null,
      primeId: null,
      programs: null,
      documents: null,
      mentorship: null,
      grievances: null,
    };

    if (want.users) {
      const [r] = await tx<{ total: number; pending: number; unverified: number }[]>`
        SELECT count(*)::int AS total,
               count(*) FILTER (WHERE status = 'pending')::int AS pending,
               count(*) FILTER (WHERE email_verified_at IS NULL)::int AS unverified
        FROM app_user`;
      result.users = r;
    }

    if (want.primeId) {
      const [r] = await tx<{ pending: number }[]>`
        SELECT count(*)::int AS pending FROM prime_id_request WHERE status = 'pending'`;
      result.primeId = r;
    }

    if (want.programs) {
      const [r] = await tx<{ pendingDecisions: number; openCycles: number }[]>`
        SELECT
          (SELECT count(*)::int FROM program_application
             WHERE status IN ('submitted', 'under_review', 'shortlisted')) AS "pendingDecisions",
          (SELECT count(*)::int FROM program_cycle WHERE status = 'open') AS "openCycles"`;
      result.programs = r;
    }

    if (want.documents) {
      const [r] = await tx<{ pending: number }[]>`
        SELECT count(*)::int AS pending FROM document WHERE status = 'pending'`;
      result.documents = r;
    }

    if (want.mentorship) {
      const [r] = await tx<{ active: number; certificates: number }[]>`
        SELECT
          (SELECT count(*)::int FROM mentorship_assignment WHERE status = 'active') AS active,
          (SELECT count(*)::int FROM mentor_certificate) AS certificates`;
      result.mentorship = r;
    }

    if (want.grievances) {
      const [r] = await tx<{ total: number; unassigned: number; open: number }[]>`
        SELECT count(*)::int AS total,
               count(*) FILTER (WHERE assigned_to IS NULL)::int AS unassigned,
               count(*) FILTER (WHERE status IN ('submitted', 'under_review', 'in_progress'))::int AS open
        FROM grievance`;
      result.grievances = r;
    }

    return result;
  });
}
