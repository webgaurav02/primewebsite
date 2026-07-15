import { requireUser } from "@/lib/auth/user-session";

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
