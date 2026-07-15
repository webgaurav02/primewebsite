import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserDetail } from "@/lib/dal/users";
import { REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import { formatINR } from "@/lib/format/display";

/* eslint-disable @next/next/no-img-element -- data-URL photo, admin CSP allows data: */

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  suspended: "bg-red-100 text-red-700",
};

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
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

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await getUserDetail(id);
  if (!u) notFound();

  const b = u.business;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="text-sm text-zinc-500 underline">← Back to users</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {u.photoDataUrl ? (
            <img src={u.photoDataUrl} alt="" className="h-14 w-14 rounded-full object-cover ring-1 ring-black/10" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-500">
              {u.fullName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{u.fullName}</h1>
            <p className="text-sm text-zinc-500">{u.email}</p>
          </div>
          <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[u.status]}`}>{u.status}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${u.activated ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>
            {u.activated ? "email verified" : "email unverified"}
          </span>
        </div>
      </div>

      <Section title="Identity">
        <Row label="Registered as" value={u.registrantType ? REGISTRANT_TYPE_LABELS[u.registrantType] : null} />
        <Row label="Email" value={u.email} />
        <Row label="Mobile" value={u.mobile} />
        <Row label="Date of birth" value={u.dateOfBirth} />
        <Row label="Gender" value={u.gender} />
        <Row label="District" value={u.district} />
        <Row label="Preferred language" value={u.preferredLanguage} />
        <Row label="How they heard" value={u.howHeard} />
        <Row label="Source" value={u.source} />
        <Row label="Registered" value={new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
      </Section>

      {(u.guardianName || u.guardianRelationship) && (
        <Section title="Guardian (minor)">
          <Row label="Guardian name" value={u.guardianName} />
          <Row label="Relationship" value={u.guardianRelationship} />
        </Section>
      )}

      {b && (
        <Section title="Business & impact">
          <Row label="Business" value={b.businessName} />
          <Row label="Sector" value={b.sector} />
          <Row label="Entity type" value={b.entityType} />
          <Row label="Stage" value={b.stage} />
          <Row label="Year established" value={b.yearEstablished ? String(b.yearEstablished) : null} />
          <Row label="Address" value={b.address} />
          <Row label="Description" value={b.description} />
          <Row label="People employed" value={b.employmentCount != null ? String(b.employmentCount) : null} />
          <Row label="Lives impacted" value={b.livesImpacted != null ? String(b.livesImpacted) : null} />
          <Row label="Turnover" value={b.turnover != null ? formatINR(b.turnover) : null} />
          <Row label="Govt. funding" value={b.govtFunding != null ? formatINR(b.govtFunding) : null} />
          <Row label="External funding" value={b.externalFunding != null ? formatINR(b.externalFunding) : null} />
          <Row label="Products / services" value={b.products} />
          <Row label="Social impact" value={b.socialImpact} />
        </Section>
      )}
    </div>
  );
}
