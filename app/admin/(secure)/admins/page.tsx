import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { listAdmins } from "@/lib/dal/admins";
import { createAdminAction } from "./actions";
import AdminForm from "./_components/AdminForm";
import AdminRow from "./_components/AdminRow";

export default async function AdminsPage() {
  const viewer = await getCurrentAdmin();
  if (!viewer || !can(viewer, "admin:manage")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to admin management.</p>;
  }

  const admins = await listAdmins();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admins</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage the admin directory — roles, region scope, and access. {admins.length} admin(s).
        </p>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Creating an admin provisions their directory record (role, region scope, grievance
        assignment, and audit identity). Sign-in is provisioned separately per admin via passkey —
        production admin login stays fail-closed until that is wired.
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            New admin
          </h2>
          <AdminForm mode="create" action={createAdminAction} submitLabel="Create admin" />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Directory
          </h2>
          <div className="space-y-3">
            {admins.map((a) => (
              <AdminRow
                key={a.id}
                admin={{
                  id: a.id,
                  email: a.email,
                  name: a.name,
                  role: a.role,
                  isActive: a.isActive,
                  regions: a.regions,
                  assignedOpenGrievances: a.assignedOpenGrievances,
                }}
                isSelf={a.id === viewer.id}
              />
            ))}
            {admins.length === 0 && (
              <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center text-zinc-400">
                No admins yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
