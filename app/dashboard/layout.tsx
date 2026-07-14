import { requireUser } from "@/lib/auth/user-session";
import VerifyBanner from "@/app/account/_components/VerifyBanner";

/**
 * Server-side gate for the member dashboard. Redirects anonymous (or suspended)
 * users to /login. Added as a layout so the existing client dashboard page is
 * untouched. For unverified members it also shows a thin soft-gate banner above
 * the dashboard (verified members see the dashboard exactly as before).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/dashboard");
  return (
    <>
      {!user.emailVerified && (
        <div className="mx-auto w-full max-w-6xl px-6 pt-4">
          <VerifyBanner email={user.email} verified={false} />
        </div>
      )}
      {children}
    </>
  );
}
