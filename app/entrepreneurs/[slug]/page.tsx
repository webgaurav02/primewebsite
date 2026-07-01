import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HiLocationMarker, HiMail, HiPhone, HiExternalLink, HiArrowLeft } from "react-icons/hi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProfile, profiles, SECTOR_LABELS, DISTRICT_LABELS } from "@/lib/entrepreneurs-data";

export function generateStaticParams() {
  return profiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.businessName} — PRIME Meghalaya`,
    description: profile.description ?? `${profile.entrepreneurName} — ${SECTOR_LABELS[profile.sector] ?? profile.sector}, ${DISTRICT_LABELS[profile.district] ?? profile.district}.`,
  };
}

export default async function EntrepreneurProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  const sectorLabel = SECTOR_LABELS[profile.sector] ?? profile.sector;
  const districtLabel = DISTRICT_LABELS[profile.district] ?? profile.district;

  const stats = [
    { label: "Employment Generated", value: profile.employment },
    { label: "Lives Impacted", value: profile.livesImpacted },
    { label: "Turnover (FY24–25)", value: profile.turnover },
    { label: "Government Funding", value: profile.govtFunding },
    { label: "External Funding", value: profile.externalFunding },
  ].filter((s) => s.value);

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-[#1B4332] overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28">
        {/* Subtle background image */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src={`/assets/entrepreneurs-directory/${profile.image}`}
            alt=""
            fill
            className="object-cover object-top opacity-[0.12]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] via-[#1B4332]/90 to-[#1B4332]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-14 text-white/35" style={{ fontSize: "var(--text-label)" }}>
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/entrepreneurs" className="hover:text-white/60 transition-colors">Entrepreneurs</Link>
            <span>/</span>
            <span className="text-white/55">{profile.businessName}</span>
          </nav>

          <div className="max-w-2xl">
            {/* Sector label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-[#74C69D]" />
              <p
                className="font-semibold tracking-[0.25em] uppercase text-[#74C69D]"
                style={{ fontSize: "var(--text-label)" }}
              >
                {sectorLabel}
              </p>
            </div>

            {/* Business name */}
            <h1
              className="font-black text-white leading-[0.88] tracking-tight mb-5"
              style={{ fontSize: "var(--text-display)" }}
            >
              {profile.businessName}
            </h1>

            {/* Entrepreneur name */}
            <p
              className="text-white/50 font-medium leading-snug"
              style={{ fontSize: "var(--text-lead)" }}
            >
              {profile.entrepreneurName}
            </p>

            {/* District */}
            <p
              className="text-white/25 font-medium mt-3"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {districtLabel}, Meghalaya
            </p>
          </div>
        </div>
      </section>

      {/* ── Profile content ────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24">
          <div className="grid md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr] gap-12 md:gap-16 lg:gap-24">

            {/* Left — Portrait */}
            <div className="flex-shrink-0">
              <div className="relative aspect-[3/4] w-full max-w-[340px] mx-auto md:mx-0 overflow-hidden bg-[#f0f0f0]">
                <Image
                  src={`/assets/entrepreneurs-directory/${profile.image}`}
                  alt={profile.entrepreneurName}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 80vw, 400px"
                />
              </div>
            </div>

            {/* Right — Details */}
            <div className="flex flex-col gap-0">
              <h2
                className="font-black text-black leading-tight tracking-tight mb-4"
                style={{ fontSize: "var(--text-heading)" }}
              >
                About {profile.businessName}
              </h2>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6">
                <span className="text-black/45 italic" style={{ fontSize: "var(--text-sm)" }}>
                  Sector: {sectorLabel}
                </span>
                {profile.entity && (
                  <>
                    <span className="text-black/20">·</span>
                    <span className="text-black/45 italic" style={{ fontSize: "var(--text-sm)" }}>
                      Entity: {profile.entity}
                    </span>
                  </>
                )}
                {profile.stage && (
                  <>
                    <span className="text-black/20">·</span>
                    <span className="text-black/45 italic" style={{ fontSize: "var(--text-sm)" }}>
                      Stage: {profile.stage}
                    </span>
                  </>
                )}
              </div>

              <div className="w-14 h-px bg-[#2D6A4F] mb-7" />

              {profile.description ? (
                <p
                  className="text-black/55 leading-[1.85] mb-8"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {profile.description}
                </p>
              ) : (
                <p
                  className="text-black/35 leading-[1.85] mb-8 italic"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  Full profile details coming soon. Visit the link below for more information.
                </p>
              )}

              {/* Contact */}
              {(profile.location || profile.email || profile.phone) && (
                <div className="flex flex-col gap-3 mb-8">
                  {profile.location && (
                    <div className="flex items-start gap-3 text-black/50" style={{ fontSize: "var(--text-sm)" }}>
                      <HiLocationMarker className="mt-0.5 flex-shrink-0 text-[#2D6A4F]" size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-3 text-black/50" style={{ fontSize: "var(--text-sm)" }}>
                      <HiMail className="flex-shrink-0 text-[#2D6A4F]" size={16} />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-[#2D6A4F] transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3 text-black/50" style={{ fontSize: "var(--text-sm)" }}>
                      <HiPhone className="flex-shrink-0 text-[#2D6A4F]" size={16} />
                      <a
                        href={`tel:${profile.phone}`}
                        className="hover:text-[#2D6A4F] transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* External link */}
              <a
                href={profile.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[#2D6A4F] hover:text-[#1B4332] transition-colors self-start"
                style={{ fontSize: "var(--text-sm)" }}
              >
                View full profile on PRIME portal
                <HiExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="bg-[#1B4332]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 md:py-20">

            {/* Label */}
            <div className="flex items-center gap-4 mb-10 md:mb-12">
              <span className="w-6 h-px bg-[#74C69D]/50" />
              <p
                className="font-semibold tracking-[0.25em] uppercase text-white/25"
                style={{ fontSize: "var(--text-label)" }}
              >
                Impact at a glance
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.06]">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-[#1B4332] px-5 py-7 md:px-6 md:py-8 flex flex-col gap-2.5"
                >
                  {/* Green top accent */}
                  <div className="w-7 h-[2px] bg-[#74C69D]/50 mb-1" />
                  {/* Label */}
                  <p
                    className="text-white/30 font-semibold uppercase tracking-[0.18em] leading-tight"
                    style={{ fontSize: "9px" }}
                  >
                    {s.label}
                  </p>
                  {/* Value */}
                  <p
                    className="font-black text-[#74C69D] leading-none whitespace-nowrap"
                    style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.75rem)" }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ── Social Impact ──────────────────────────────────────── */}
      {profile.socialImpact && (
        <section className="bg-[#f5f5f5] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p
                className="font-semibold tracking-[0.25em] uppercase text-black/35"
                style={{ fontSize: "var(--text-label)" }}
              >
                Social Impact
              </p>
            </div>
            <p
              className="text-black/60 leading-[1.85] max-w-3xl"
              style={{ fontSize: "var(--text-body)" }}
            >
              {profile.socialImpact}
            </p>
          </div>
        </section>
      )}

      {/* ── Products ───────────────────────────────────────────── */}
      {profile.products && (
        <section className="bg-white py-20 md:py-28 border-t border-black/[0.05]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p
                className="font-semibold tracking-[0.25em] uppercase text-black/35"
                style={{ fontSize: "var(--text-label)" }}
              >
                Products
              </p>
            </div>
            <p
              className="text-black/60 leading-[1.85] max-w-3xl"
              style={{ fontSize: "var(--text-body)" }}
            >
              {profile.products}
            </p>
          </div>
        </section>
      )}

      {/* ── Back to directory ──────────────────────────────────── */}
      <section className="bg-[#1B4332] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
          <Link
            href="/entrepreneurs"
            className="inline-flex items-center gap-3 font-semibold text-white/50 hover:text-white transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            <HiArrowLeft size={16} />
            Back to all entrepreneurs
          </Link>
          <p className="text-white/20 font-medium hidden sm:block" style={{ fontSize: "var(--text-label)" }}>
            {districtLabel} · Meghalaya
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
