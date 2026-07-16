import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { listAdmins } from "@/lib/dal/admins";
import { createAdminAction } from "./actions";
import AdminForm from "./_components/AdminForm";
import AdminRow from "./_components/AdminRow";
import ExportButton from "../_components/ExportButton";

export default async function AdminsPage() {
  const viewer = await getCurrentAdmin();
  if (!viewer || !can(viewer, "admin:manage")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to admin management.</p>;
  }

  const admins = await listAdmins();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admins</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the admin directory — roles, region scope, and access. {admins.length} admin(s).
          </p>
        </div>
        <ExportButton dataset="admins" />
      </div>

      <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
        Set an initial password when creating an admin to grant them sign-in, or leave it blank to
        provision a directory record only (role, region scope, grievance assignment, audit identity)
        and set a password later with <span className="font-medium">Reset password</span>. Admins
        sign in with their email and password at <span className="font-mono text-xs">/admin/login</span>.
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
