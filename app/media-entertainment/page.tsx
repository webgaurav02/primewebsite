import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiChartBar, HiClipboardList, HiDatabase, HiEye, HiSearch, HiDocumentText } from "react-icons/hi";
import type { IconType } from "react-icons";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Monitoring & Evaluation — PRIME Meghalaya",
  description:
    "PRIME's Monitoring & Evaluation framework tracks programme impact, measures outcomes for entrepreneurs, and ensures evidence-based delivery across Meghalaya.",
};

const focus: { Icon: IconType; title: string; desc: string }[] = [
  { Icon: HiChartBar,     title: "Impact Measurement",      desc: "Quantifying outcomes across PRIME's portfolio — jobs created, revenue generated, funding accessed, and enterprises sustained." },
  { Icon: HiEye,          title: "Field Monitoring",        desc: "On-ground verification by district teams ensuring programme delivery matches commitments to beneficiary entrepreneurs." },
  { Icon: HiDatabase,     title: "MIS & Data Systems",      desc: "Management Information Systems tracking every registered entrepreneur, application, and scheme disbursement across PRIME." },
  { Icon: HiClipboardList, title: "Programme Evaluation",  desc: "Structured periodic evaluations assessing effectiveness, relevance, and efficiency of PRIME's schemes and interventions." },
  { Icon: HiSearch,       title: "Third-party Assessment",  desc: "Independent evaluations commissioned to provide unbiased analysis of PRIME's impact on Meghalaya's entrepreneurship ecosystem." },
  { Icon: HiDocumentText, title: "Reporting & Compliance", desc: "Annual impact reports, government submissions, donor reporting, and accountability documentation for all PRIME programmes." },
];

const initiatives = [
  { num: "01", title: "Annual Impact Report",       desc: "Comprehensive year-end publication documenting PRIME's reach, outcomes, case studies, and ecosystem-level impact across all sectors." },
  { num: "02", title: "Real-time MIS Dashboard",    desc: "A live dashboard tracking beneficiary numbers, funding disbursements, scheme uptake, and programme milestones across all districts." },
  { num: "03", title: "District Monitoring Visits", desc: "Structured field visits by PRIME district officers to verify programme implementation and collect ground-level feedback from entrepreneurs." },
  { num: "04", title: "Outcome Tracking Framework", desc: "A standardised results framework defining indicators, baselines, and targets for each PRIME programme — enabling consistent progress measurement." },
];

export default function MonitoringEvaluationPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="Sectors of PRIME"
          title="Monitoring & Evaluation"
          subtitle="Tracking impact, measuring outcomes, and ensuring PRIME delivers evidence-based results for every entrepreneur in Meghalaya."
        />

        {/* Focus areas */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  What We Do
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                How PRIME measures what matters
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
              {focus.map((f) => (
                <HoverCard key={f.title} className="p-8">
                  <span className="text-[#2D6A4F] mb-5 block"><f.Icon size={24} /></span>
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{f.title}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{f.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Key initiatives */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Initiatives
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Key M&E programmes
              </h2>
            </div>
            <div className="border-t border-black/[0.08]">
              {initiatives.map((item) => (
                <div key={item.num} className="grid grid-cols-[56px_1fr] gap-6 py-6 border-b border-black/[0.08]">
                  <span className="font-black text-[#2D6A4F]" style={{ fontSize: "var(--text-sm)" }}>{item.num}</span>
                  <div>
                    <h3 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>{item.title}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{item.desc}</p>
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
                Data & Insights
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              Access PRIME's impact data.
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              For data requests, evaluation reports, or programme performance information, reach out to the PRIME M&E team.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Get in Touch →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
