import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { devLoginAction } from "./actions";
import AdminLoginForm from "./_components/AdminLoginForm";

export default async function AdminLoginPage() {
  // Already signed in? Skip the login screen.
  if (await getCurrentAdmin()) redirect("/admin");

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <Image
          src="/logo-color.png"
          alt="PRIME"
          width={676}
          height={183}
          className="mx-auto h-10 w-auto"
          priority
        />
        <h1 className="mt-6 text-center text-lg font-semibold">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-zinc-500">
          PRIME Meghalaya console
        </p>

        <AdminLoginForm />

        {isDev && (
          <div className="mt-8 border-t border-dashed border-zinc-300 pt-6">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-amber-600">
              Dev only — assume a role
            </p>
            <p className="mb-3 text-center text-[11px] text-zinc-400">
              Requires seeded admins (npm run db:seed). Mints a real session.
            </p>
            <div className="space-y-2">
              <form action={devLoginAction}>
                <input type="hidden" name="role" value="super_admin" />
                <button className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">
                  Super Admin (all regions)
                </button>
              </form>
              <form action={devLoginAction}>
                <input type="hidden" name="role" value="grievance_officer" />
                <input type="hidden" name="region" value="garo" />
                <button className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">
                  Grievance Officer (Garo Hills only)
                </button>
              </form>
              <form action={devLoginAction}>
                <input type="hidden" name="role" value="auditor" />
                <button className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">
                  Auditor (read-only, PII redacted)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
