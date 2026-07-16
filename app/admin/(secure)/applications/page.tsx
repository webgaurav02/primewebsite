import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import {
  listApplications,
  getApplicationStats,
} from "@/lib/dal/programs";
import type { ApplicationStatus } from "@/lib/programs/types";
import { APPLICATION_STATUS_LABELS, REVIEW_STATUSES } from "@/lib/programs/types";
import { REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import { reviewApplicationAction } from "./actions";

const PAGE_SIZE = 50;

const APP_STATUS_STYLE: Record<string, string> = {
  submitted: "bg-zinc-100 text-zinc-700",
  under_review: "bg-amber-100 text-amber-800",
  shortlisted: "bg-indigo-100 text-indigo-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-zinc-100 text-zinc-500",
};

const STATUS_CHIPS: ApplicationStatus[] = [
  "submitted", "under_review", "shortlisted", "approved", "rejected", "withdrawn",
];

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "draft", "submitted", "under_review", "shortlisted", "approved", "rejected", "withdrawn",
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; program?: string; q?: string; page?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, "program:manage")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to applications.</p>;
  }

  const sp = await searchParams;
  const status = APPLICATION_STATUSES.includes(sp.status as ApplicationStatus)
    ? (sp.status as ApplicationStatus)
    : undefined;
  const page = Math.max(Number.parseInt(sp.page ?? "1", 10) || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [{ rows, total }, stats] = await Promise.all([
    listApplications({ status, programId: sp.program, q: sp.q, limit: PAGE_SIZE, offset }),
    getApplicationStats(),
  ]);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  /** Build a filter URL preserving current params, applying overrides. */
  const qs = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status: sp.status, program: sp.program, q: sp.q, ...over };
    if (merged.status) params.set("status", merged.status);
    if (merged.program) params.set("program", merged.program);
    if (merged.q) params.set("q", merged.q);
    if (over.page) params.set("page", over.page);
    const s = params.toString();
    return s ? `/admin/applications?${s}` : "/admin/applications";
  };
  const chipCls = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium ${
      active ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
    }`;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Applications</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {stats.total} application(s) across all programs — who registered for what,
        and where each one stands. Click an applicant for their profile, or open an
        application to decide it with a note.
      </p>

      {/* Status chips (with counts) */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={qs({ status: undefined, page: undefined })} className={chipCls(!status)}>
          All ({stats.total})
        </a>
        {STATUS_CHIPS.map((s) => (
          <a key={s} href={qs({ status: s, page: undefined })} className={chipCls(status === s)}>
            {APPLICATION_STATUS_LABELS[s]} ({stats.byStatus[s] ?? 0})
          </a>
        ))}
      </div>

      {/* Per-program chips (with counts) — the "for what" breakdown */}
      {stats.byProgram.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <a href={qs({ program: undefined, page: undefined })} className={chipCls(!sp.program)}>
            All programs
          </a>
          {stats.byProgram.map((p) => (
            <a
              key={p.programId}
              href={qs({ program: p.programId, page: undefined })}
              className={chipCls(sp.program === p.programId)}
              title={p.pending > 0 ? `${p.pending} awaiting a decision` : undefined}
            >
              {p.programName} ({p.total})
            </a>
          ))}
        </div>
      )}

      {/* Search */}
      <form method="GET" className="mt-4 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-4">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {sp.program && <input type="hidden" name="program" value={sp.program} />}
        <div>
          <label className="block text-xs text-zinc-500">Applicant</label>
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Name or email…" className="mt-1 w-56 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
        </div>
        <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">Search</button>
        <a href="/admin/applications" className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100">Reset</a>
      </form>

      {/* Applications table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-zinc-100 align-top last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${a.userId}`} className="font-medium text-zinc-900 hover:underline">
                    {a.applicantName}
                  </Link>
                  <span className="block text-xs text-zinc-500">{a.applicantEmail}</span>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {a.registrantType
                    ? REGISTRANT_TYPE_LABELS[a.registrantType as keyof typeof REGISTRANT_TYPE_LABELS] ?? a.registrantType
                    : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600">{a.district ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-zinc-900">{a.programName}</span>
                  <span className="block text-xs text-zinc-500">{a.cycleLabel}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600">{fmtDate(a.submittedAt)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${APP_STATUS_STYLE[a.status] ?? "bg-zinc-100"}`}>
                    {APPLICATION_STATUS_LABELS[a.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {a.status !== "withdrawn" && (
                      <form action={reviewApplicationAction} className="flex items-center gap-1">
                        <input type="hidden" name="applicationId" value={a.id} />
                        <select name="status" defaultValue={a.status} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                          {REVIEW_STATUSES.map((s) => (
                            <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">Set</button>
                      </form>
                    )}
                    <Link href={`/admin/applications/${a.id}`} className="text-xs font-medium text-zinc-600 underline hover:text-zinc-900">
                      Open
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  No applications match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-500">
            Page {page} of {totalPages} · {total} matching application(s)
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={qs({ page: String(page - 1) })} className="rounded border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-100">← Prev</a>
            )}
            {page < totalPages && (
              <a href={qs({ page: String(page + 1) })} className="rounded border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-100">Next →</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
