import { requireUser } from "@/lib/auth/user-session";
import VerifyBanner from "./_components/VerifyBanner";

// Authenticated + DB-backed. Force dynamic so the build never tries to
// prerender these pages (which would run DAL queries with no DATABASE_URL in CI).
export const dynamic = "force-dynamic";

/**
 * Member-area shell. Shows the soft-gate "verify your email" banner above every
 * /account subpage (id-card, programs, mentorship, documents, …) for unverified
 * members — so the reminder isn't only on the hub. requireUser here is the
 * authoritative gate (cache()-deduped with each page's own requireUser).
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/account");
  return (
    <>
      {!user.emailVerified && (
        <div className="mx-auto w-full max-w-2xl px-6 pt-6">
          <VerifyBanner email={user.email} verified={false} />
        </div>
      )}
      {children}
    </>
  );
}
