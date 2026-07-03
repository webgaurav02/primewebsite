import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiShieldCheck, HiClipboardList, HiChartBar, HiDocumentText, HiUsers, HiCog } from "react-icons/hi";
import type { IconType } from "react-icons";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Admin & Governance — PRIME Meghalaya",
  description:
    "PRIME's administrative and governance framework — the operations, compliance, and institutional structures that ensure programme delivery at scale across Meghalaya.",
};

const pillars: { Icon: IconType; title: string; desc: string }[] = [
  { Icon: HiShieldCheck,   title: "Compliance & Legal",       desc: "Ensuring all PRIME programmes operate within the regulatory framework of the Government of Meghalaya and applicable central laws." },
  { Icon: HiClipboardList, title: "Programme Management",     desc: "End-to-end administration of PRIME's portfolio of programmes — from application processing to beneficiary tracking." },
  { Icon: HiChartBar,      title: "Monitoring & Evaluation",  desc: "Impact measurement, data collection, and programme performance tracking across all PRIME verticals." },
  { Icon: HiDocumentText,  title: "Policy & Documentation",   desc: "Development of scheme guidelines, Standard Operating Procedures, and policy recommendations for the state government." },
  { Icon: HiUsers,         title: "Human Resources",          desc: "Recruitment, capacity building, and professional development for PRIME's growing team across districts and blocks." },
  { Icon: HiCog,           title: "IT & Systems",             desc: "Technology infrastructure, PRIME Portal management, data systems, and digital operations." },
];

const structure = [
  { role: "Governing Board",             desc: "Chaired by senior government officials, the Governing Board sets strategic direction and provides oversight of PRIME's operations." },
  { role: "Executive Management",        desc: "Day-to-day leadership responsible for programme delivery, stakeholder management, and operational excellence." },
  { role: "Programme Teams",             desc: "Dedicated teams for each PRIME vertical — Incubation, CM Elevate, Rural, Business Facilitation, and Market Linkage." },
  { role: "District Implementation",     desc: "PRIME representatives embedded in key districts to ensure local delivery, outreach, and entrepreneur support." },
];

export default function AdminGovernancePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">

        <PageHero
          breadcrumb="Sectors of PRIME"
          title="Admin & Governance"
          subtitle="The operational and institutional backbone that enables PRIME to deliver at scale — ensuring every programme is accountable, compliant, and impactful."
        />

        {/* Pillars */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  What We Manage
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Six pillars of operational excellence
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
              {pillars.map((p) => (
                <HoverCard key={p.title} className="p-8">
                  <span className="text-[#2D6A4F] mb-5 block"><p.Icon size={24} /></span>
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{p.title}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Governance structure */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Structure
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Governance structure
              </h2>
            </div>
            <div className="border-t border-black/[0.08]">
              {structure.map((s, i) => (
                <div key={s.role} className="grid grid-cols-[56px_1fr] gap-6 py-6 border-b border-black/[0.08]">
                  <span className="font-black text-black/20" style={{ fontSize: "var(--text-sm)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>{s.role}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                Contact
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              For administrative enquiries
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              For RTI requests, programme documentation, compliance queries, or institutional partnerships, reach out to the PRIME administrative team.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Contact Admin →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
