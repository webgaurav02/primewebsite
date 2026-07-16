import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { ADMIN_ROLE_LABELS, REGION_LABELS } from "@/lib/admins/types";
import { getAdminDashboard } from "@/lib/dal/dashboard";

interface Stat {
  label: string;
  value: number;
  href: string;
  /** Highlight as an action queue when > 0. */
  actionable?: boolean;
}

function QueueCard({ s }: { s: Stat }) {
  const hot = s.actionable && s.value > 0;
  return (
    <Link
      href={s.href}
      className={`rounded-lg border p-4 transition-colors ${
        hot
          ? "border-amber-300 bg-amber-50 hover:bg-amber-100"
          : "border-zinc-200 bg-white hover:bg-zinc-50"
      }`}
    >
      <div className={`text-3xl font-semibold ${hot ? "text-amber-900" : "text-zinc-900"}`}>
        {s.value}
      </div>
      <div className={`mt-1 text-xs ${hot ? "text-amber-800" : "text-zinc-500"}`}>{s.label}</div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const d = await getAdminDashboard();

  // Actionable pending-work queues (only for modules the admin can act on).
  const queues: Stat[] = [
    d.users && { label: "Users pending approval", value: d.users.pending, href: "/admin/users?status=pending", actionable: true },
    d.primeId && { label: "PRIME IDs awaiting review", value: d.primeId.pending, href: "/admin/prime-id", actionable: true },
    d.programs && { label: "Applications to decide", value: d.programs.pendingDecisions, href: "/admin/applications", actionable: true },
    d.documents && { label: "Documents to verify", value: d.documents.pending, href: "/admin/documents?status=pending", actionable: true },
    d.grievances && { label: "Grievances unassigned", value: d.grievances.unassigned, href: "/admin/grievances", actionable: true },
    d.grievances && { label: "Grievances open", value: d.grievances.open, href: "/admin/grievances", actionable: true },
  ].filter(Boolean) as Stat[];

  // At-a-glance totals.
  const totals: Stat[] = [
    d.users && { label: "Total users", value: d.users.total, href: "/admin/users" },
    d.users && { label: "Email unverified", value: d.users.unverified, href: "/admin/users" },
    d.programs && { label: "Total applications", value: d.programs.totalApplications, href: "/admin/applications" },
    d.programs && { label: "Open intake cycles", value: d.programs.openCycles, href: "/admin/programs" },
    d.mentorship && { label: "Active mentorships", value: d.mentorship.active, href: "/admin/mentorship" },
    d.mentorship && { label: "Certificates issued", value: d.mentorship.certificates, href: "/admin/mentorship" },
    d.grievances && { label: "Total grievances", value: d.grievances.total, href: "/admin/grievances" },
  ].filter(Boolean) as Stat[];

  const scope =
    admin.regions === null
      ? "all regions"
      : admin.regions.map((r) => REGION_LABELS[r]).join(", ") || "no regions";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {admin.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {ADMIN_ROLE_LABELS[admin.role]} · {scope}
        </p>
      </div>

      {queues.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Needs attention
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {queues.map((s) => (
              <QueueCard key={s.label} s={s} />
            ))}
          </div>
        </section>
      )}

      {totals.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            At a glance
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {totals.map((s) => (
              <QueueCard key={s.label} s={s} />
            ))}
          </div>
        </section>
      )}

      {queues.length === 0 && totals.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center text-zinc-400">
          Nothing to show for your role yet.
        </p>
      )}
    </div>
  );
}
