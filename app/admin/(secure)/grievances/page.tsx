import { listGrievances } from "@/lib/dal/grievances";
import { updateStatusAction } from "./actions";

const STATUSES = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "rejected",
] as const;

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
  // Raw searchParams go straight into the DAL, which validates them with zod.
  const grievances = await listGrievances({
    status: sp.status,
    region: sp.region,
    q: sp.q,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Grievances</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {grievances.length} grievance(s) in your scope
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Complainant</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((g) => (
              <tr key={g.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{g.ticketRef}</td>
                <td className="px-4 py-3">{REGION_LABEL[g.region] ?? g.region}</td>
                <td className="px-4 py-3">{g.subject}</td>
                <td className="px-4 py-3">
                  {g.complainant.redacted ? (
                    <span className="text-zinc-400 italic">redacted</span>
                  ) : (
                    <span title={`${g.complainant.email} · ${g.complainant.phone}`}>
                      {g.complainant.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">
                    {g.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={updateStatusAction} className="flex gap-2">
                    <input type="hidden" name="grievanceId" value={g.id} />
                    <select
                      name="status"
                      defaultValue={g.status}
                      className="rounded border border-zinc-300 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded bg-black px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {grievances.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  No grievances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
