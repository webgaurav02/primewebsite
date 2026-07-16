import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import {
  getPrimeIdIssueContext,
  listPrimeIdEligibleUsers,
} from "@/lib/dal/prime-id";
import PrimeIdGeneratorClient from "./PrimeIdGeneratorClient";

export default async function GeneratePrimeIdPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, "prime_id:issue")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to issue PRIME IDs.</p>;
  }

  const sp = await searchParams;
  const [eligible, ctx] = await Promise.all([
    listPrimeIdEligibleUsers(),
    sp.userId ? getPrimeIdIssueContext(sp.userId) : Promise.resolve(null),
  ]);

  return (
    <div>
      <Link href="/admin/prime-id" className="text-sm text-zinc-500 underline">← Back to PRIME ID</Link>
      <h1 className="mt-2 text-2xl font-semibold">Generate a PRIME ID</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Issue a signed, government-recognized PRIME ID directly for a registered member —
        no request needed. Pick the person, set the framing, and issue.
      </p>

      {/* User picker */}
      <form method="GET" className="mt-6 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-4">
        <div>
          <label className="block text-xs text-zinc-500">Member</label>
          <select
            name="userId"
            defaultValue={sp.userId ?? ""}
            className="mt-1 w-72 rounded border border-zinc-300 px-2 py-1.5 text-sm"
          >
            <option value="">Select a member…</option>
            {eligible.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName} · {u.email}</option>
            ))}
          </select>
        </div>
        <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">
          Load
        </button>
        <p className="basis-full text-xs text-zinc-400">
          Only active members without an active PRIME ID are listed ({eligible.length}).
        </p>
      </form>

      {sp.userId && !ctx && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          That member could not be found.
        </p>
      )}

      {ctx && <PrimeIdGeneratorClient ctx={ctx} />}
    </div>
  );
}
