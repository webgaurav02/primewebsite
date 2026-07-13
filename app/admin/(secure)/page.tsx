import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { listGrievances } from "@/lib/dal/grievances";

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  // DAL re-checks auth/authz and scopes rows to the admin's region(s).
  const grievances = await listGrievances({});

  const byStatus = grievances.reduce<Record<string, number>>((acc, g) => {
    acc[g.status] = (acc[g.status] ?? 0) + 1;
    return acc;
  }, {});

  const cards: { label: string; value: number }[] = [
    { label: "Total (in your scope)", value: grievances.length },
    { label: "Submitted", value: byStatus.submitted ?? 0 },
    { label: "Under review", value: byStatus.under_review ?? 0 },
    { label: "In progress", value: byStatus.in_progress ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome, {admin.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Grievance Redressal —{" "}
        {admin.regions === null ? "all regions" : admin.regions.join(", ")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <div className="text-3xl font-semibold">{c.value}</div>
            <div className="mt-1 text-xs text-zinc-500">{c.label}</div>
          </div>
        ))}
      </div>

      <Link
        href="/admin/grievances"
        className="mt-6 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        View all grievances →
      </Link>
    </div>
  );
}
