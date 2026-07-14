import Link from "next/link";
import { listUsers } from "@/lib/dal/users";
import type { Persona, UserStatus } from "@/lib/users/types";
import { REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import {
  approveUserAction,
  suspendUserAction,
  reactivateUserAction,
} from "./actions";

const STATUS_STYLE: Record<UserStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  suspended: "bg-red-100 text-red-700",
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; persona?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = (["pending", "active", "suspended"] as const).includes(
    sp.status as UserStatus,
  )
    ? (sp.status as UserStatus)
    : undefined;

  const users = await listUsers({
    status,
    persona: sp.persona as Persona | undefined,
    q: sp.q,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {users.length} member(s). Members register themselves and are active
        immediately — click a name for full details, or suspend / reactivate access.
      </p>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <a
            key={f.value}
            href={f.value ? `/admin/users?status=${f.value}` : "/admin/users"}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              (status ?? "") === f.value
                ? "bg-black text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Type</th>
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
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
