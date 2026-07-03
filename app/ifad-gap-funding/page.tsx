import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import HoverCard from "@/components/ui/HoverCard";

const fundTypes = [
  {
    name: "Regular Fund",
    range: "₹20 Lakhs – ₹1 Crore",
    scope: "Available for 10 target states including Meghalaya",
    availability: "Open all year round",
    eligibility: "Producer Groups and Micro & Small Enterprises (MSEs)",
    highlight: false,
  },
  {
    name: "Challenge Fund",
    range: "₹1 Crore – ₹2 Crores",
    scope: "Open to applicants from all over India",
    availability: "Exclusively on a quarterly basis",
    eligibility: "Producer Groups and Micro & Small Enterprises (MSEs)",
    highlight: true,
  },
];

const timeline = [
  { step: "01", title: "Submit Concept Note", desc: "Apply through the GAP Fund website with a clear concept note outlining your agricultural or rural enterprise idea." },
  { step: "02", title: "Selection Process", desc: "Applications are assessed by Sheena Kapoor's team at Access. Shortlisted applicants go through a detailed review and site assessment." },
  { step: "03", title: "One-on-One Briefing", desc: "Selected applicants receive a one-on-one session with the GAP Fund team to finalise the application and understand fund utilisation requirements." },
  { step: "04", title: "Funding Disbursement", desc: "Upon approval, funds are disbursed for agroecology-focused activities including plantation, processing, and supply chain development." },
];

const eligibility = [
  "Producer Groups (farmer collectives, cooperatives, SHGs)",
  "Micro and Small Enterprises (MSEs) in agri and allied sectors",
  "Enterprises based in Meghalaya or other target states",
];

const focusAreas = [
  "Agroecology and sustainable farming",
  "Cashew, spice, and plantation crops",
  "Rural supply chain development",
  "Value-addition and processing",
  "Women-led and cooperative enterprises",
];

export default function IFADGAPFundingPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Funding & Schemes"
        title="IFAD GAP Funding"
        subtitle="The Grant for Agroecology Program (GAP Fund) — supporting Meghalaya's producer groups and micro enterprises with significant capital for agricultural and rural enterprises."
      />

      {/* What is it */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                About the Fund
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Grant for Agroecology Program
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              PRIME Meghalaya, in collaboration with the GAP Fund and Access, introduced the IFAD-backed Grant for Agroecology Program at the PRIME Startup Hub Shillong. This fund offers a unique opportunity for Producer Groups and Micro & Small Enterprises (MSEs) to access substantial funding for agroecology-focused projects.
            </p>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              The session was attended by 40 entrepreneurs both in person and virtually, featuring experience sharing from the All-Garo Hills Multipurpose Cooperative Society — which successfully secured funding for cashew plantation and revival, addressing the shift towards arecanut monoculture in the region.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              The fund is managed by <strong className="text-black">Access Development Services</strong> and backed by the International Fund for Agricultural Development (IFAD).
            </p>
          </div>
          <div className="flex flex-col gap-px bg-black/[0.07] border border-black/[0.07]">
            <div className="bg-white p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-6 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Eligibility
                </p>
              </div>
              <div className="border-t border-black/[0.08]">
                {eligibility.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-black/[0.08]">
                    <span className="text-[#2D6A4F] font-bold shrink-0">—</span>
                    <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{e}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-6 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Focus Areas
                </p>
              </div>
              <div className="border-t border-black/[0.08]">
                {focusAreas.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-black/[0.08]">
                    <span className="text-[#2D6A4F] font-bold shrink-0">—</span>
                    <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fund types */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Fund Typologies
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Two funding tracks available
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
            {fundTypes.map((f) => (
              <div
                key={f.name}
                className={`p-8 ${f.highlight ? "bg-[#1B4332]" : "bg-white hover:bg-[#f5f5f5]"} transition-colors`}
              >
                <h3
                  className={`font-black mb-3 ${f.highlight ? "text-white" : "text-black"}`}
                  style={{ fontSize: "var(--text-lead)" }}
                >
                  {f.name}
                </h3>
                <p className={`font-black ${f.highlight ? "text-[#74C69D]" : "text-[#2D6A4F]"} leading-[0.9] mb-6`} style={{ fontSize: "var(--text-heading)" }}>
                  {f.range}
                </p>
                <dl className="flex flex-col gap-4">
                  {[
                    { label: "Scope", val: f.scope },
                    { label: "Availability", val: f.availability },
                    { label: "Eligibility", val: f.eligibility },
                  ].map((d) => (
                    <div key={d.label}>
                      <dt className={`font-semibold uppercase tracking-wide mb-1 ${f.highlight ? "text-white/30" : "text-black/35"}`} style={{ fontSize: "var(--text-label)" }}>
                        {d.label}
                      </dt>
                      <dd className={f.highlight ? "text-white/50" : "text-black/50"} style={{ fontSize: "var(--text-sm)" }}>
                        {d.val}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Application Process
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              How to apply for GAP funding
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
            {timeline.map((t) => (
              <HoverCard key={t.step} className="p-8">
                <div className="h-px w-10 bg-[#2D6A4F] mb-8" />
                <p className="font-black text-[#2D6A4F] mb-3" style={{ fontSize: "var(--text-label)" }}>
                  {t.step}
                </p>
                <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>
                  {t.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {t.desc}
                </p>
              </HoverCard>
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
              Get Started
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Interested in GAP Funding?
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            PRIME Meghalaya can help you navigate the application process. Register on our portal or reach out directly for guidance.
          </p>
          <a
            href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Register on PRIME Portal
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
