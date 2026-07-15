import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { listAuditLog, listAuditFacets, checkAuditIntegrity } from "@/lib/dal/audit";

const PAGE_SIZE = 50;

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Compact one-line summary of an entry's metadata, if any. */
function metaSummary(metadata: Record<string, unknown>): string | null {
  const entries = Object.entries(metadata ?? {});
  if (entries.length === 0) return null;
  return entries
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
    .join(" · ");
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string;
    resourceType?: string;
    actorEmail?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, "audit:read")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to the audit log.</p>;
  }

  const sp = await searchParams;
  const page = Math.max(Number.parseInt(sp.page ?? "1", 10) || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [{ rows, total }, facets, integrity] = await Promise.all([
    listAuditLog({
      action: sp.action,
      resourceType: sp.resourceType,
      actorEmail: sp.actorEmail,
      from: sp.from,
      to: sp.to,
      limit: PAGE_SIZE,
      offset,
    }),
    listAuditFacets(),
    checkAuditIntegrity(),
  ]);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (sp.action) params.set("action", sp.action);
    if (sp.resourceType) params.set("resourceType", sp.resourceType);
    if (sp.actorEmail) params.set("actorEmail", sp.actorEmail);
    if (sp.from) params.set("from", sp.from);
    if (sp.to) params.set("to", sp.to);
    params.set("page", String(p));
    return `/admin/audit?${params.toString()}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit log</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Append-only, hash-chained record of every administrative action. {total} entr
        {total === 1 ? "y" : "ies"} in scope.
      </p>

      {/* Chain integrity */}
      <div
        className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
          integrity.ok
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-300 bg-red-50 text-red-700"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${integrity.ok ? "bg-emerald-500" : "bg-red-500"}`} />
        {integrity.ok ? (
          <span>Chain intact — no tampering detected.</span>
        ) : (
          <span>
            Integrity check FAILED — the chain breaks at entry #{integrity.brokenAtSeq}. Investigate
            immediately.
          </span>
        )}
      </div>

      {/* Filters */}
      <form method="GET" className="mt-4 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-4">
        <div>
          <label className="block text-xs text-zinc-500">Action</label>
          <select name="action" defaultValue={sp.action ?? ""} className="mt-1 w-48 rounded border border-zinc-300 px-2 py-1.5 text-sm">
            <option value="">All actions</option>
            {facets.actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500">Resource</label>
          <select name="resourceType" defaultValue={sp.resourceType ?? ""} className="mt-1 w-40 rounded border border-zinc-300 px-2 py-1.5 text-sm">
            <option value="">All resources</option>
            {facets.resourceTypes.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500">Actor email</label>
          <input name="actorEmail" defaultValue={sp.actorEmail ?? ""} placeholder="contains…" className="mt-1 w-44 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500">From</label>
          <input name="from" type="date" defaultValue={sp.from ?? ""} className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500">To</label>
          <input name="to" type="date" defaultValue={sp.to ?? ""} className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
        </div>
        <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">Filter</button>
        <a href="/admin/audit" className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100">Reset</a>
      </form>

      {/* Entries */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const summary = metaSummary(r.metadata);
              return (
                <tr key={r.seq} className="border-b border-zinc-100 align-top last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{r.seq}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">{fmt(r.at)}</td>
                  <td className="px-4 py-3 text-zinc-700">{r.actorEmail}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs">{r.action}</span></td>
                  <td className="px-4 py-3 text-zinc-600">
                    {r.resourceType}
                    {r.resourceId && <span className="block font-mono text-[11px] text-zinc-400">{r.resourceId}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{summary ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{r.ip ?? "—"}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">No matching entries.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={qs(page - 1)} className="rounded border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-100">← Prev</a>
            )}
            {page < totalPages && (
              <a href={qs(page + 1)} className="rounded border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-100">Next →</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
