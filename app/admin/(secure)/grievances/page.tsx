import { listGrievances, listAssignmentTargets } from "@/lib/dal/grievances";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { CATEGORY_LABELS, ESCALATION_LABELS, GRIEVANCE_STATUSES } from "@/lib/grievance/types";
import { updateStatusAction, assignAction, escalateAction } from "./actions";

const REGION_LABEL: Record<string, string> = {
  khasi_jaintia: "Khasi/Jaintia",
  garo: "Garo Hills",
  ri_bhoi: "Ri-Bhoi",
};

export default async function GrievancesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const admin = await getCurrentAdmin();
  const grievances = await listGrievances({ status: sp.status, region: sp.region, q: sp.q });

  const canAssign = admin ? can(admin, "grievance:assign") : false;
  const canUpdate = admin ? can(admin, "grievance:update_status") : false;
  const targets = canAssign ? await listAssignmentTargets() : [];
  const targetName = new Map(targets.map((t) => [t.id, t.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Grievances</h1>
      <p className="mt-1 text-sm text-zinc-500">{grievances.length} grievance(s) in your scope</p>

      <div className="mt-6 space-y-3">
        {grievances.map((g) => (
          <div key={g.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold">{g.ticketRef}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{REGION_LABEL[g.region] ?? g.region}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{CATEGORY_LABELS[g.category] ?? g.category}</span>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white">{g.status.replace("_", " ")}</span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800" title={ESCALATION_LABELS[g.escalationLevel]}>
                {ESCALATION_LABELS[g.escalationLevel]}
              </span>
              {g.ackOverdue && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Ack overdue</span>}
              {g.resolveOverdue && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Resolve overdue</span>}
            </div>

            <p className="mt-2 font-medium text-zinc-900">{g.subject}</p>
            <p className="mt-0.5 text-sm text-zinc-500">
              {g.complainant.redacted ? (
                <span className="italic">complainant redacted</span>
              ) : (
                <span title={`${g.complainant.email} · ${g.complainant.phone}`}>{g.complainant.name}</span>
              )}
              {" · "}
              {g.assignedToId ? `Assigned to ${targetName.get(g.assignedToId) ?? "an officer"}` : "Unassigned"}
            </p>

            <div className="mt-3 flex flex-wrap items-end gap-2">
              {canUpdate && (
                <form action={updateStatusAction} className="flex items-end gap-1">
                  <input type="hidden" name="grievanceId" value={g.id} />
                  <select name="status" defaultValue={g.status} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                    {GRIEVANCE_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                  <input name="note" placeholder="Note (optional)" className="w-40 rounded border border-zinc-300 px-2 py-1 text-xs" />
                  <button className="rounded bg-black px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800">Save</button>
                </form>
              )}

              {canAssign && (
                <form action={assignAction} className="flex items-end gap-1">
                  <input type="hidden" name="grievanceId" value={g.id} />
                  <select name="assigneeId" defaultValue={g.assignedToId ?? ""} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                    <option value="" disabled>Assign to…</option>
                    {targets.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">Assign</button>
                </form>
              )}

              {canUpdate && g.escalationLevel < 3 && (
                <form action={escalateAction}>
                  <input type="hidden" name="grievanceId" value={g.id} />
                  <button className="rounded border border-indigo-300 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50">
                    Escalate →
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {grievances.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center text-zinc-400">
            No grievances found.
          </p>
        )}
      </div>
    </div>
  );
}
