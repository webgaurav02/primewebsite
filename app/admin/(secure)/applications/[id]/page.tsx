import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicationDetail } from "@/lib/dal/programs";
import { APPLICATION_STATUS_LABELS, REVIEW_STATUSES } from "@/lib/programs/types";
import { REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import { reviewApplicationAction } from "../actions";

const APP_STATUS_STYLE: Record<string, string> = {
  submitted: "bg-zinc-100 text-zinc-700",
  under_review: "bg-amber-100 text-amber-800",
  shortlisted: "bg-indigo-100 text-indigo-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-zinc-100 text-zinc-500",
};

function fmt(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 border-b border-zinc-100 px-5 py-2.5 text-sm last:border-0">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium text-zinc-900">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</p>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;
  const a = await getApplicationDetail(id);
  if (!a) notFound();

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <Link href="/admin/applications" className="text-sm text-zinc-500 underline">← Back to applications</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {a.applicantName} → {a.programName}
            </h1>
            <p className="text-sm text-zinc-500">{a.cycleLabel}</p>
          </div>
          <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${APP_STATUS_STYLE[a.status] ?? "bg-zinc-100"}`}>
            {APPLICATION_STATUS_LABELS[a.status]}
          </span>
        </div>
      </div>

      <Section title="Applicant">
        <Row
          label="Name"
          value={
            <Link href={`/admin/users/${a.userId}`} className="underline hover:text-zinc-600">
              {a.applicantName}
            </Link>
          }
        />
        <Row label="Email" value={a.applicantEmail} />
        <Row
          label="Registered as"
          value={
            a.registrantType
              ? REGISTRANT_TYPE_LABELS[a.registrantType as keyof typeof REGISTRANT_TYPE_LABELS] ?? a.registrantType
              : null
          }
        />
        <Row label="District" value={a.district} />
        <Row label="Organisation" value={a.organizationName} />
      </Section>

      <Section title="Application">
        <Row label="Program" value={a.programName} />
        <Row label="Cycle" value={a.cycleLabel} />
        <Row label="Submitted" value={fmt(a.submittedAt)} />
        <Row label="Venture summary" value={a.answers?.summary} />
        <Row label="What they hope to gain" value={a.answers?.objective} />
      </Section>

      {(a.reviewedByName || a.decisionNote) && (
        <Section title="Last decision">
          <Row label="Status" value={APPLICATION_STATUS_LABELS[a.status]} />
          <Row label="Decided by" value={a.reviewedByName} />
          <Row label="Decided at" value={fmt(a.reviewedAt)} />
          <Row label="Note" value={a.decisionNote} />
        </Section>
      )}

      {a.status !== "withdrawn" ? (
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Decide</p>
          <form action={reviewApplicationAction} className="mt-3 flex flex-wrap items-end gap-2">
            <input type="hidden" name="applicationId" value={a.id} />
            <div>
              <label className="block text-xs text-zinc-500">Status</label>
              <select name="status" defaultValue={a.status} className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm">
                {REVIEW_STATUSES.map((s) => (
                  <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="min-w-64 flex-1">
              <label className="block text-xs text-zinc-500">Decision note (sent to the applicant)</label>
              <input name="note" defaultValue={a.decisionNote ?? ""} placeholder="Optional note…" className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm" />
            </div>
            <button className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">
              Save decision
            </button>
          </form>
          <p className="mt-2 text-xs text-zinc-400">
            The applicant is notified of every decision (with your note) on their dashboard timeline.
          </p>
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
          This application was withdrawn by the applicant and can no longer be decided.
        </p>
      )}
    </div>
  );
}
