import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const instruments = [
  {
    name: "Kick Start Grant",
    amount: "Up to ₹10 Lakhs",
    type: "Non-Returnable",
    target: "Early-stage startups",
    purpose: "Product Development & R&D",
    desc: "To support Research & Development activities and help innovators transform concepts into viable, market-ready solutions.",
    highlight: false,
  },
  {
    name: "Scale-up Innovation Loan",
    amount: "Up to ₹75 Lakhs",
    type: "Zero-Interest Loan",
    target: "Startups with existing revenue",
    purpose: "Scaling Up",
    desc: "To provide capital for scaling operations, refining business models, and expanding market reach — all without incurring interest burdens.",
    highlight: true,
  },
  {
    name: "Small Support Grant",
    amount: "Up to ₹3 Lakhs",
    type: "Grant",
    target: "Registered micro or small enterprises",
    purpose: "Technology Adoption",
    desc: "To enhance technology adoption or infrastructure upgrades, enabling productivity and competitiveness among local businesses.",
    highlight: false,
  },
  {
    name: "InnoVenture Grant",
    amount: "Up to ₹35 Lakhs",
    type: "Grant",
    target: "High-impact innovators",
    purpose: "Scaling Up",
    desc: "To fund transformative ideas that address key challenges and have the potential for sector-wide or cross-sectoral impact.",
    highlight: false,
  },
];

const eligibilityPoints = [
  "Every entrepreneur from Meghalaya is eligible to apply",
  "Applications open through the official PRIME website (www.primemeghalaya.com)",
  "Both registered and unregistered entities may apply",
  "Application windows and timelines are published on the PRIME portal",
];

export default function PrimeEntrepreneurshipFundingPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Funding & Schemes"
        title="PRIME Entrepreneurship Funding"
        subtitle="A comprehensive suite of funding instruments supporting Meghalaya's entrepreneurs from first idea to full-scale growth."
      />

      {/* Overview */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Catalysing Innovation
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Funding at every stage of your journey
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              PRIME Meghalaya offers a comprehensive suite of funding instruments designed to support entrepreneurs at various stages of their business journey. These initiatives aim to foster innovation, drive local economic growth, and empower the entrepreneurial ecosystem across the state.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              PRIME Funding is open for every entrepreneur from Meghalaya. These initiatives are part of the Government of Meghalaya&apos;s broader strategy to build a resilient, inclusive, and innovation-driven economy.
            </p>
          </div>
        </div>
      </section>

      {/* Instruments */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Funding Instruments
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Four ways PRIME funds your business
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
            {instruments.map((ins) => (
              <div
                key={ins.name}
                className={`p-8 ${ins.highlight ? "bg-[#1B4332]" : "bg-white hover:bg-[#f5f5f5]"} transition-colors`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className={`font-bold uppercase tracking-widest mb-2 ${ins.highlight ? "text-[#74C69D]" : "text-[#2D6A4F]"}`} style={{ fontSize: "var(--text-label)" }}>
                      {ins.type}
                    </p>
                    <h3
                      className={`font-black ${ins.highlight ? "text-white" : "text-black"}`}
                      style={{ fontSize: "var(--text-lead)" }}
                    >
                      {ins.name}
                    </h3>
                  </div>
                  <span
                    className={`font-semibold px-2 py-1 shrink-0 mt-1 ${ins.highlight ? "border border-[#74C69D]/40 text-[#74C69D]" : "border border-[#2D6A4F]/30 text-[#2D6A4F]"}`}
                    style={{ fontSize: "var(--text-label)" }}
                  >
                    {ins.purpose}
                  </span>
                </div>
                <p className={`font-black leading-[0.9] mb-5 ${ins.highlight ? "text-[#74C69D]" : "text-[#2D6A4F]"}`} style={{ fontSize: "var(--text-heading)" }}>
                  {ins.amount}
                </p>
                <div className="mb-4">
                  <p className={`font-semibold uppercase tracking-wide mb-1 ${ins.highlight ? "text-white/30" : "text-black/35"}`} style={{ fontSize: "var(--text-label)" }}>
                    Target
                  </p>
                  <p className={ins.highlight ? "text-white/50" : "text-black/50"} style={{ fontSize: "var(--text-sm)" }}>
                    {ins.target}
                  </p>
                </div>
                <p className={`leading-relaxed ${ins.highlight ? "text-white/40" : "text-black/50"}`} style={{ fontSize: "var(--text-sm)" }}>
                  {ins.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary table */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                At a Glance
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Compare the funding instruments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.08]">
                  <th className="text-left py-4 pr-6 font-semibold text-black/35 uppercase tracking-wide" style={{ fontSize: "var(--text-label)" }}>Instrument</th>
                  <th className="text-left py-4 pr-6 font-semibold text-black/35 uppercase tracking-wide" style={{ fontSize: "var(--text-label)" }}>Max Amount</th>
                  <th className="text-left py-4 pr-6 font-semibold text-black/35 uppercase tracking-wide" style={{ fontSize: "var(--text-label)" }}>Type</th>
                  <th className="text-left py-4 font-semibold text-black/35 uppercase tracking-wide" style={{ fontSize: "var(--text-label)" }}>Stage</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((ins, i) => (
                  <tr key={i} className="border-b border-black/[0.08] hover:bg-[#f5f5f5] transition-colors">
                    <td className="py-4 pr-6 font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{ins.name}</td>
                    <td className="py-4 pr-6 text-[#2D6A4F] font-bold" style={{ fontSize: "var(--text-sm)" }}>{ins.amount}</td>
                    <td className="py-4 pr-6 text-black/50" style={{ fontSize: "var(--text-sm)" }}>{ins.type}</td>
                    <td className="py-4 text-black/50" style={{ fontSize: "var(--text-sm)" }}>{ins.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Eligibility
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Who can apply?
            </h2>
            <div className="border-t border-black/[0.08]">
              {eligibilityPoints.map((e, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-black/[0.08]">
                  <span className="font-black text-[#2D6A4F] shrink-0 mt-0.5" style={{ fontSize: "var(--text-label)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{e}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Important Note
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Check current windows
            </h2>
            <p className="text-black/50 leading-relaxed mb-6" style={{ fontSize: "var(--text-body)" }}>
              Application windows and specific timelines for each funding instrument are regularly updated on the PRIME Meghalaya portal. Check the portal for the latest open rounds before applying.
            </p>
            <a
              href="https://portal.primemeghalaya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D6A4F] font-semibold hover:underline"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Visit portal.primemeghalaya.com →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
              Apply Now
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Apply for PRIME funding
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Register on the portal, find the right instrument for your stage, and take the next step in building your business.
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
