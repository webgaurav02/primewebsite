import { listPrimeIdRequests } from "@/lib/dal/prime-id";
import { approveIssueAction, rejectRequestAction } from "./actions";

const HOLDER_LABEL: Record<string, string> = {
  entrepreneur: "Entrepreneur",
  mentor: "Mentor",
  other: "Member",
};

export default async function PrimeIdAdminPage() {
  const pending = await listPrimeIdRequests("pending");
  const issued = await listPrimeIdRequests("issued");

  return (
    <div>
      <h1 className="text-2xl font-semibold">PRIME ID</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {pending.length} request(s) awaiting review. Approving issues a signed,
        government-recognized credential.
      </p>

      <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Pending review
      </h2>
      <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Venture</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Decision</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((r) => (
              <tr key={r.id} className="border-b border-zinc-100 align-top last:border-0">
                <td className="px-4 py-3 font-medium text-zinc-900">{r.fullName}</td>
                <td className="px-4 py-3">{HOLDER_LABEL[r.holderType] ?? r.holderType}</td>
                <td className="px-4 py-3 text-zinc-600">{r.ventureName ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-600">{r.district}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <form action={approveIssueAction}>
                      <input type="hidden" name="requestId" value={r.id} />
                      <button className="w-full rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                        Approve &amp; issue
                      </button>
                    </form>
                    <form action={rejectRequestAction} className="flex gap-1">
                      <input type="hidden" name="requestId" value={r.id} />
                      <input
                        name="reason"
                        required
                        placeholder="Reason to reject"
                        className="min-w-0 flex-1 rounded border border-zinc-300 px-2 py-1 text-xs"
                      />
                      <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">
                        Reject
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  No requests awaiting review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Recently issued
      </h2>
      <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Holder</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">District</th>
            </tr>
          </thead>
          <tbody>
            {issued.map((r) => (
              <tr key={r.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium text-zinc-900">{r.fullName}</td>
                <td className="px-4 py-3">{HOLDER_LABEL[r.holderType] ?? r.holderType}</td>
                <td className="px-4 py-3 text-zinc-600">{r.district}</td>
              </tr>
            ))}
            {issued.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-400">
                  Nothing issued yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
