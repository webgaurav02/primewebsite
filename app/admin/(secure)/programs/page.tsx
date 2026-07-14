import {
  listCyclesAdmin,
  listApplications,
  listProgramOptions,
} from "@/lib/dal/programs";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { APPLICATION_STATUS_LABELS, REVIEW_STATUSES } from "@/lib/programs/types";
import {
  createCycleAction,
  setCycleStatusAction,
  reviewApplicationAction,
} from "./actions";

const CYCLE_STATUS_STYLE: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  open: "bg-emerald-100 text-emerald-800",
  closed: "bg-zinc-200 text-zinc-700",
};
const APP_STATUS_STYLE: Record<string, string> = {
  submitted: "bg-zinc-100 text-zinc-700",
  under_review: "bg-amber-100 text-amber-800",
  shortlisted: "bg-indigo-100 text-indigo-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-zinc-100 text-zinc-500",
};

export default async function AdminProgramsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, "program:manage")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to programs.</p>;
  }

  const [cycles, applications, programs] = await Promise.all([
    listCyclesAdmin(),
    listApplications(),
    listProgramOptions(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Programs</h1>
        <p className="mt-1 text-sm text-zinc-500">Run intake cycles and decide applications.</p>
      </div>

      {/* Create a cycle */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">New intake cycle</h2>
        <form action={createCycleAction} className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-4">
          <div>
            <label className="block text-xs text-zinc-500">Program</label>
            <select name="programId" required className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm">
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500">Label</label>
            <input name="label" placeholder="e.g. 2026 Cohort 1" required className="mt-1 w-44 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500">Closes (optional)</label>
            <input name="closesAt" type="date" className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
          </div>
          <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">Open cycle</button>
        </form>
      </section>

      {/* Cycles */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Cycles</h2>
        <div className="mt-3 space-y-2">
          {cycles.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3">
              <span className={`rounded-full px-2 py-0.5 text-xs ${CYCLE_STATUS_STYLE[c.status]}`}>{c.status}</span>
              <span className="font-medium">{c.programName}</span>
              <span className="text-sm text-zinc-500">{c.label}</span>
              <span className="text-xs text-zinc-400">{c.applicationCount} application(s)</span>
              <form action={setCycleStatusAction} className="ml-auto flex items-center gap-1">
                <input type="hidden" name="cycleId" value={c.id} />
                <select name="status" defaultValue={c.status} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                  <option value="draft">draft</option>
                  <option value="open">open</option>
                  <option value="closed">closed</option>
                </select>
                <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">Set</button>
              </form>
            </div>
          ))}
          {cycles.length === 0 && <p className="text-sm text-zinc-400">No cycles yet.</p>}
        </div>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Applications</h2>
        <div className="mt-3 space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-900">{a.applicantName}</span>
                <span className="text-sm text-zinc-500">· {a.programName} · {a.cycleLabel}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${APP_STATUS_STYLE[a.status] ?? "bg-zinc-100"}`}>
                  {APPLICATION_STATUS_LABELS[a.status]}
                </span>
              </div>
              {a.answers?.summary && (
                <p className="mt-2 text-sm text-zinc-700"><span className="text-zinc-400">Venture:</span> {a.answers.summary}</p>
              )}
              {a.answers?.objective && (
                <p className="mt-1 text-sm text-zinc-700"><span className="text-zinc-400">Goal:</span> {a.answers.objective}</p>
              )}
              {a.status !== "withdrawn" && (
                <form action={reviewApplicationAction} className="mt-3 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="applicationId" value={a.id} />
                  <select name="status" defaultValue={a.status} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                    {REVIEW_STATUSES.map((s) => (
                      <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <input name="note" placeholder="Decision note (optional)" className="w-56 rounded border border-zinc-300 px-2 py-1 text-xs" />
                  <button className="rounded bg-black px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800">Save decision</button>
                </form>
              )}
            </div>
          ))}
          {applications.length === 0 && <p className="text-sm text-zinc-400">No applications yet.</p>}
        </div>
      </section>
    </div>
  );
}
