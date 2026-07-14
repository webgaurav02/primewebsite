import type { Metadata } from "next";
import Link from "next/link";
import { getMyMentorship } from "@/lib/dal/mentorship";
import { MODE_LABELS, formatHours } from "@/lib/mentorship/types";
import LogSessionForm from "./_components/LogSessionForm";

export const metadata: Metadata = { title: "Mentorship — My account" };

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function MentorshipPage() {
  const m = await getMyMentorship();
  const hasAny = m.asMentor.length > 0 || m.asMentee.length > 0;
  const pct = Math.min(100, Math.round((m.totalMinutesAsMentor / m.thresholdMinutes) * 100));

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Mentorship</h1>
        <Link href="/account" className="text-sm text-zinc-500 underline">Back to account</Link>
      </div>

      {/* Mentor: progress + certificate */}
      {m.asMentor.length > 0 && (
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Your mentoring</h2>
          {m.certificate ? (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-medium text-emerald-900">5-hour certificate earned 🎓</p>
              <p className="mt-0.5 text-sm text-emerald-800">
                {m.certificate.serial} · {formatHours(m.certificate.totalMinutes)} logged · issued {fmt(m.certificate.issuedAt)}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>{formatHours(m.totalMinutesAsMentor)} logged</span>
                <span>{formatHours(m.thresholdMinutes)} for certificate</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-[#2D6A4F]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          <div className="mt-4 space-y-4">
            {m.asMentor.map((a) => (
              <div key={a.assignmentId} className="rounded-lg border border-zinc-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-zinc-800">{a.menteeName}</p>
                  <span className="text-xs text-zinc-400">{a.status === "active" ? "Active" : "Ended"}</span>
                </div>
                {a.sessions.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                    {a.sessions.map((s) => (
                      <li key={s.id} className="flex justify-between">
                        <span>{fmt(s.occurredAt)} · {MODE_LABELS[s.mode]}</span>
                        <span>{formatHours(s.durationMinutes)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {a.status === "active" && (
                  <div className="mt-3">
                    <LogSessionForm assignmentId={a.assignmentId} menteeName={a.menteeName} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mentee: my mentor */}
      {m.asMentee.length > 0 && (
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Your mentor{m.asMentee.length > 1 ? "s" : ""}</h2>
          <div className="mt-3 space-y-4">
            {m.asMentee.map((a) => (
              <div key={a.assignmentId} className="rounded-lg border border-zinc-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-zinc-800">{a.mentorName}</p>
                  <span className="text-xs text-zinc-400">{a.status === "active" ? "Active" : "Ended"}</span>
                </div>
                {a.sessions.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                    {a.sessions.map((s) => (
                      <li key={s.id} className="flex justify-between">
                        <span>{fmt(s.occurredAt)} · {MODE_LABELS[s.mode]}</span>
                        <span>{formatHours(s.durationMinutes)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-zinc-400">No sessions logged yet.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasAny && (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-400">
          You don&apos;t have a mentorship assignment yet. PRIME will pair you with a mentor.
        </p>
      )}
    </main>
  );
}
