import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin, getCurrentAdmin } from "@/lib/auth/session";
import { adminLogout } from "@/lib/dal/admin-auth";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie";
import AdminSidebar from "./_components/AdminSidebar";

/**
 * Authenticated admin shell with a left sidebar. requireAdmin() is the SECOND,
 * authoritative gate (the proxy is only an optimistic first pass). Reading
 * cookies() here also forces dynamic rendering, which the nonce CSP requires.
 */
export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  async function logout() {
    "use server";
    await getCurrentAdmin(); // re-resolve so a forged POST can't be repurposed
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE_NAME)?.value;
    if (token) await adminLogout(token); // invalidate the server session too
    jar.delete({ name: SESSION_COOKIE_NAME, path: "/admin" });
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <AdminSidebar admin={admin} logout={logout} />
      <div className="lg:pl-60">
        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
