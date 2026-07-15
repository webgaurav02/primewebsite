import { requireUser } from "@/lib/auth/user-session";

// Authenticated + DB-backed. Force dynamic so the build never tries to
// prerender these pages (which would run DAL queries with no DATABASE_URL in CI).
export const dynamic = "force-dynamic";

/**
 * Server-side gate for the member dashboard. Redirects anonymous (or suspended)
 * users to /login. The soft-gate "verify your email" banner is rendered inside
 * the dashboard's own content column (DashboardClient), so it sits under the
 * sticky header rather than pushing the full-viewport app shell down.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/dashboard");
  return <>{children}</>;
}
