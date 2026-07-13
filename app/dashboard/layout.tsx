import { requireUser } from "@/lib/auth/user-session";

/**
 * Server-side gate for the member dashboard. Redirects anonymous (or suspended)
 * users to /login. Added as a layout so the existing client dashboard page is
 * untouched. Real per-user data is wired into the dashboard in later phases.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/dashboard");
  return <>{children}</>;
}
