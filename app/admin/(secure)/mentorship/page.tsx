import { listAssignments, listMentorMenteeOptions } from "@/lib/dal/mentorship";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { formatHours } from "@/lib/mentorship/types";
import { assignMentorAction, endAssignmentAction } from "./actions";

export default async function AdminMentorshipPage() {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, "mentorship:manage")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to mentorship.</p>;
  }

  const [assignments, { mentors, mentees }] = await Promise.all([
    listAssignments(),
    listMentorMenteeOptions(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Mentorship</h1>
        <p className="mt-1 text-sm text-zinc-500">Pair mentors with mentees; mentors log sessions from their account.</p>
      </div>

      {/* Assign */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">New pairing</h2>
        <form action={assignMentorAction} className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-4">
          <div>
            <label className="block text-xs text-zinc-500">Mentor</label>
            <select name="mentorId" required className="mt-1 w-52 rounded border border-zinc-300 px-2 py-1.5 text-sm">
              <option value="" disabled>Select a mentor…</option>
              {mentors.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500">Mentee</label>
            <select name="menteeId" required className="mt-1 w-52 rounded border border-zinc-300 px-2 py-1.5 text-sm">
              <option value="" disabled>Select a mentee…</option>
              {mentees.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">Assign</button>
        </form>
        {mentors.length === 0 && (
          <p className="mt-2 text-xs text-zinc-400">No active mentors yet — approve a mentor applicant first.</p>
        )}
      </section>

      {/* Assignments */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Assignments</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Mentor</th>
                <th className="px-4 py-3">Mentee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Logged</th>
                <th className="px-4 py-3">Sessions</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{a.mentorName}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.menteeName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${a.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-500"}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{formatHours(a.totalMinutes)}</td>
                  <td className="px-4 py-3 text-zinc-600">{a.sessionCount}</td>
                  <td className="px-4 py-3">
                    {a.status === "active" && (
                      <form action={endAssignmentAction}>
                        <input type="hidden" name="assignmentId" value={a.id} />
                        <button className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100">End</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-400">No assignments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
