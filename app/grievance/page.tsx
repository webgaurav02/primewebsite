import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import HoverCard from "@/components/ui/HoverCard";
import { HiMail, HiShieldCheck, HiChat, HiGlobe, HiClipboardList } from "react-icons/hi";
import type { IconType } from "react-icons";

export const metadata: Metadata = {
  title: "Grievance Redressal — PRIME Meghalaya",
  description:
    "Submit complaints, data-protection requests, or general queries to PRIME Meghalaya. Responses within 30 working days as required by the DPDP Act, 2023.",
};

const steps = [
  {
    num: "01",
    heading: "Prepare your grievance",
    detail:
      "Clearly describe your concern — whether it's a data-protection request, a complaint about our services, or a general query. Include your name, contact details, and any reference numbers.",
  },
  {
    num: "02",
    heading: "Submit via email",
    detail:
      "Email your grievance to grievance@primemeghalaya.com with the subject line 'PRIME Grievance — [brief description]'. You may also send a written complaint to our postal address.",
  },
  {
    num: "03",
    heading: "Acknowledgement",
    detail:
      "We will acknowledge your complaint within 3 working days of receipt and provide a reference number for tracking.",
  },
  {
    num: "04",
    heading: "Resolution",
    detail:
      "We aim to resolve all grievances within 30 days of receipt. Complex cases may require additional time; we will keep you informed of progress.",
  },
  {
    num: "05",
    heading: "Escalation",
    detail:
      "If unresolved within 30 days or if you are unsatisfied with the resolution, you may escalate to the Data Protection Board of India (once constituted) for data-related matters, or to the appropriate government authority for other complaints.",
  },
];

const categories: { title: string; description: string; Icon: IconType }[] = [
  { title: "Data Protection Requests", description: "Exercise your rights under the DPDP Act, 2023 — request access, correction, or erasure of your personal data held by PRIME.", Icon: HiShieldCheck },
  { title: "Programme Complaints",     description: "Complaints about PRIME programmes, schemes, funding applications, selection processes, or conduct of staff.", Icon: HiClipboardList },
  { title: "Website Issues",           description: "Report broken links, accessibility barriers, incorrect information, or technical problems on this website.", Icon: HiGlobe },
  { title: "General Queries",          description: "Questions about eligibility, application processes, scheme details, or any other PRIME-related queries.", Icon: HiChat },
];

const timelines = [
  { label: "Acknowledgement", time: "Within 3 working days" },
  { label: "Resolution (standard)", time: "Within 30 days" },
  { label: "Resolution (complex)", time: "Up to 60 days (with notice)" },
  { label: "Data-protection requests (DPDP Act)", time: "Within 30 days" },
];

export default function GrievancePage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Contact & Support"
        title="Grievance Redressal"
        subtitle="We are committed to addressing your concerns transparently and promptly. All grievances are handled in accordance with the DPDP Act, 2023 and applicable Government of Meghalaya guidelines."
      />

      <main>
        {/* Grievance categories */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Types of Grievances
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight"
                style={{ fontSize: "var(--text-heading)" }}
              >
                What can you report?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
              {categories.map((c) => (
                <HoverCard key={c.title} className="p-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#74C69D]/20 mb-6">
                    <span className="text-[#2D6A4F]"><c.Icon size={24} /></span>
                  </div>
                  <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{c.title}</h3>
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{c.description}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-step process */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  How It Works
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight"
                style={{ fontSize: "var(--text-heading)" }}
              >
                Step-by-step process
              </h2>
            </div>
            <div className="border-t border-black/[0.08]">
              {steps.map((s) => (
                <div key={s.num} className="flex items-start gap-6 py-6 border-b border-black/[0.08]">
                  <span className="font-black text-[#2D6A4F] shrink-0 mt-0.5 w-8" style={{ fontSize: "var(--text-label)" }}>
                    {s.num}
                  </span>
                  <div>
                    <h3 className="font-bold text-black mb-2" style={{ fontSize: "var(--text-body)" }}>{s.heading}</h3>
                    <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Officer card + timelines */}
        <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
              {/* Officer info */}
              <div className="bg-[#1B4332] p-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-px bg-[#74C69D]" />
                  <p className="font-semibold tracking-[0.25em] uppercase text-white/50" style={{ fontSize: "var(--text-label)" }}>
                    Designated Officer
                  </p>
                </div>
                <h2 className="font-black text-white mb-8" style={{ fontSize: "var(--text-heading)" }}>
                  Grievance Officer — PRIME
                </h2>
                <dl className="border-t border-white/[0.08]">
                  {[
                    { label: "Organisation", val: "Department of Commerce & Industries, Government of Meghalaya" },
                    { label: "Email", val: "grievance@primemeghalaya.com", isEmail: true },
                    { label: "Postal Address", val: "PRIME Meghalaya\n3rd Floor, Ri Kynmaw Complex\nNongrim Hills, Shillong – 793003\nMeghalaya, India" },
                    { label: "Office Hours", val: "Monday – Friday, 10:00 AM – 5:00 PM\n(Excluding public holidays)" },
                  ].map((d) => (
                    <div key={d.label} className="py-5 border-b border-white/[0.08]">
                      <dt className="font-semibold uppercase tracking-wide text-white/40 mb-1.5" style={{ fontSize: "var(--text-label)" }}>
                        {d.label}
                      </dt>
                      <dd className="text-white/75 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                        {("isEmail" in d && d.isEmail) ? (
                          <a href={`mailto:${d.val}`} className="text-[#74C69D] hover:text-white transition-colors">
                            {d.val}
                          </a>
                        ) : (
                          d.val.split("\n").map((line, i) => (
                            <span key={i}>{line}<br /></span>
                          ))
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Timelines */}
              <div className="bg-[#1B4332] p-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-px bg-[#74C69D]" />
                  <p className="font-semibold tracking-[0.25em] uppercase text-white/50" style={{ fontSize: "var(--text-label)" }}>
                    Response Timelines
                  </p>
                </div>
                <h3 className="font-black text-white mb-8" style={{ fontSize: "var(--text-heading)" }}>
                  When to expect a response
                </h3>
                <div className="border-t border-white/[0.08]">
                  {timelines.map((t, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 py-5 border-b border-white/[0.08]">
                      <p className="text-white/60" style={{ fontSize: "var(--text-sm)" }}>{t.label}</p>
                      <p className="text-[#74C69D] font-semibold shrink-0" style={{ fontSize: "var(--text-sm)" }}>{t.time}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-5 border border-[#74C69D]/20 bg-[#74C69D]/5">
                  <p className="text-white/60 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                    <strong className="text-[#74C69D]">DPDP Act, 2023:</strong> For data-protection
                    requests, if we fail to respond within 30 days or if you are dissatisfied, you
                    may approach the <strong className="text-white">Data Protection Board of India</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                Raise a Concern
              </p>
            </div>
            <h2
              className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Ready to raise a concern?
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              Email us directly — we are a government body and take every complaint seriously.
            </p>
            <a
              href="mailto:grievance@primemeghalaya.com"
              className="inline-flex items-center gap-3 px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              <HiMail size={16} />
              grievance@primemeghalaya.com
            </a>

            <div className="mt-10 flex flex-wrap gap-6" style={{ fontSize: "var(--text-sm)" }}>
              <Link href="/privacy-policy" className="text-white/35 hover:text-[#2D6A4F] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-white/35 hover:text-[#2D6A4F] transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
