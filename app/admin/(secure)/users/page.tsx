import Link from "next/link";
import { listUsers, getUserBreakdown } from "@/lib/dal/users";
import type { RegistrantType, UserStatus } from "@/lib/users/types";
import {
  REGISTRANT_TYPES,
  REGISTRANT_TYPE_LABELS,
  MEGHALAYA_DISTRICTS,
} from "@/lib/users/types";
import {
  approveUserAction,
  suspendUserAction,
  reactivateUserAction,
} from "./actions";

const PAGE_SIZE = 50;

const STATUS_STYLE: Record<UserStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  suspended: "bg-red-100 text-red-700",
};

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

const REGISTRANT_TYPE_VALUES = REGISTRANT_TYPES.map((t) => t.value);

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; district?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = (["pending", "active", "suspended"] as const).includes(sp.status as UserStatus)
    ? (sp.status as UserStatus)
    : undefined;
  const registrantType = REGISTRANT_TYPE_VALUES.includes(sp.type as RegistrantType)
    ? (sp.type as RegistrantType)
    : undefined;
  const page = Math.max(Number.parseInt(sp.page ?? "1", 10) || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [{ rows: users, total }, breakdown] = await Promise.all([
    listUsers({ status, registrantType, district: sp.district, q: sp.q, limit: PAGE_SIZE, offset }),
    getUserBreakdown(),
  ]);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  /** Build a filter URL preserving current params, applying overrides. */
  const qs = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status: sp.status, type: sp.type, district: sp.district, q: sp.q, ...over };
    if (merged.status) params.set("status", merged.status);
    if (merged.type) params.set("type", merged.type);
    if (merged.district) params.set("district", merged.district);
    if (merged.q) params.set("q", merged.q);
    if (over.page) params.set("page", over.page);
    const s = params.toString();
    return s ? `/admin/users?${s}` : "/admin/users";
  };
  const chipCls = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium ${
      active ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
    }`;

  // Type chips ordered by the canonical registrant list, counts from the breakdown.
  const typeCount = new Map(breakdown.byType.map((b) => [b.registrantType, b.count]));
  const legacyCount = typeCount.get(null) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {breakdown.total} registrant(s) in total. Filter by who they registered as,
        district, or status — click a name for their full profile and applications.
      </p>

      {/* Who registered: type chips with counts */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={qs({ type: undefined, page: undefined })} className={chipCls(!registrantType)}>
          All ({breakdown.total})
        </a>
        {REGISTRANT_TYPES.map((t) => (
          <a key={t.value} href={qs({ type: t.value, page: undefined })} className={chipCls(registrantType === t.value)}>
            {t.label} ({typeCount.get(t.value) ?? 0})
          </a>
        ))}
        {legacyCount > 0 && <span className="px-1 py-1 text-xs text-zinc-400">+{legacyCount} untyped</span>}
      </div>

      {/* Status chips (preserve the other filters) */}
      <div className="mt-2 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <a key={f.value} href={qs({ status: f.value || undefined, page: undefined })} className={chipCls((status ?? "") === f.value)}>
            {f.label}
          </a>
        ))}
      </div>

      {/* Search + district */}
      <form method="GET" className="mt-4 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-4">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {sp.type && <input type="hidden" name="type" value={sp.type} />}
        <div>
          <label className="block text-xs text-zinc-500">Search</label>
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Name or email…" className="mt-1 w-56 rounded border border-zinc-300 px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500">District</label>
          <select name="district" defaultValue={sp.district ?? ""} className="mt-1 w-44 rounded border border-zinc-300 px-2 py-1.5 text-sm">
            <option value="">All districts</option>
            {MEGHALAYA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">Filter</button>
        <a href="/admin/users" className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100">Reset</a>
      </form>

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Venture</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium text-zinc-900">
                  <Link href={`/admin/users/${u.id}`} className="hover:underline">{u.fullName}</Link>
                </td>
                <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                <td className="px-4 py-3">{u.registrantType ? REGISTRANT_TYPE_LABELS[u.registrantType] : (u.persona ?? "—")}</td>
                <td className="px-4 py-3 text-zinc-600">{u.district ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-600">{u.businessName ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[u.status]}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {u.activated ? "activated" : "not set"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {u.status === "pending" && (
                      <form action={approveUserAction}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                          Approve
                        </button>
                      </form>
                    )}
                    {u.status === "active" && (
                      <form action={suspendUserAction}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">
                          Suspend
                        </button>
                      </form>
                    )}
                    {u.status === "suspended" && (
                      <form action={reactivateUserAction}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">
                          Reactivate
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                  No users match these filters.
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
            Page {page} of {totalPages} · {total} matching user(s)
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
