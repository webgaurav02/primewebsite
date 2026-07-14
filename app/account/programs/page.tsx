import type { Metadata } from "next";
import Link from "next/link";
import { listOpenPrograms, getMyApplications } from "@/lib/dal/programs";
import { APPLICATION_STATUS_LABELS, WITHDRAWABLE } from "@/lib/programs/types";
import ApplyForm from "./_components/ApplyForm";
import WithdrawButton from "./_components/WithdrawButton";

export const metadata: Metadata = { title: "Programs — My account" };

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-zinc-100 text-zinc-700",
  under_review: "bg-amber-100 text-amber-800",
  shortlisted: "bg-indigo-100 text-indigo-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-zinc-100 text-zinc-500",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ProgramsPage() {
  const [programs, applications] = await Promise.all([listOpenPrograms(), getMyApplications()]);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Programs</h1>
        <Link href="/account" className="text-sm text-zinc-500 underline">Back to account</Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">Open PRIME programs you can apply to, and your applications.</p>

      {/* Open cycles */}
      <div className="mt-6 space-y-4">
        {programs.map((p) => (
          <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold text-zinc-900">{p.name}</h2>
            {p.description && <p className="mt-1 text-sm text-zinc-600">{p.description}</p>}
            <div className="mt-3 space-y-3">
              {p.cycles.map((c) => (
                <div key={c.id} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-800">{c.label}</p>
                      {c.closesAt && (
                        <p className="text-xs text-zinc-400">Closes {fmt(c.closesAt)}</p>
                      )}
                    </div>
                    {c.myStatus ? (
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[c.myStatus] ?? "bg-zinc-100"}`}>
                        {APPLICATION_STATUS_LABELS[c.myStatus]}
                      </span>
                    ) : (
                      <ApplyForm cycleId={c.id} cycleLabel={c.label} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {programs.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-400">
            No programs are open for applications right now. Check back soon.
          </p>
        )}
      </div>

      {/* My applications */}
      <h2 className="mt-10 text-lg font-semibold text-zinc-900">My applications</h2>
      <div className="mt-3 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {applications.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900">{a.programName}</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {a.cycleLabel}
                {a.submittedAt ? ` · Applied ${fmt(a.submittedAt)}` : ""}
              </p>
              {a.decisionNote && <p className="mt-1 text-sm text-zinc-600">{a.decisionNote}</p>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[a.status] ?? "bg-zinc-100"}`}>
                {APPLICATION_STATUS_LABELS[a.status]}
              </span>
              {WITHDRAWABLE.includes(a.status) && <WithdrawButton applicationId={a.id} />}
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-zinc-400">You haven&apos;t applied to any programs yet.</p>
        )}
      </div>
    </main>
  );
}
