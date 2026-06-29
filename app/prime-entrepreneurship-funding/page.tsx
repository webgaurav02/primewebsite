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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 max-w-3xl">
          <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Catalysing Innovation</p>
          <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
            Funding at every stage of your journey
          </h2>
          <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
            PRIME Meghalaya offers a comprehensive suite of funding instruments designed to support entrepreneurs at various stages of their business journey. These initiatives aim to foster innovation, drive local economic growth, and empower the entrepreneurial ecosystem across the state.
          </p>
          <p className="text-[13px] text-gray-600 leading-[1.8]">
            PRIME Funding is open for every entrepreneur from Meghalaya. These initiatives are part of the Government of Meghalaya&apos;s broader strategy to build a resilient, inclusive, and innovation-driven economy.
          </p>
        </div>
      </section>

      {/* Instruments */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Funding Instruments</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Four ways PRIME funds your business
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {instruments.map((ins) => (
              <div
                key={ins.name}
                className={`rounded p-8 border ${ins.highlight ? "bg-[#0d0d0d] border-[#9EC84A]/30" : "bg-white border-gray-100 hover:border-[#9EC84A]/40"} transition-colors`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${ins.highlight ? "text-[#9EC84A]" : "text-[#9EC84A]"}`}>{ins.type}</p>
                    <h3 className={`text-[16px] font-black ${ins.highlight ? "text-white" : "text-[#111111]"}`}>{ins.name}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border text-[#9EC84A] border-[#9EC84A]/30 font-semibold shrink-0 mt-1`}>{ins.purpose}</span>
                </div>
                <p className={`text-[36px] font-black text-[#9EC84A] leading-none mb-4`}>{ins.amount}</p>
                <dl className="flex flex-col gap-2 mb-4">
                  <div>
                    <dt className={`text-[10px] font-semibold uppercase tracking-wide ${ins.highlight ? "text-gray-400" : "text-gray-400"}`}>Target</dt>
                    <dd className={`text-[12px] ${ins.highlight ? "text-gray-300" : "text-gray-600"}`}>{ins.target}</dd>
                  </div>
                </dl>
                <p className={`text-[12px] leading-relaxed ${ins.highlight ? "text-gray-400" : "text-gray-500"}`}>{ins.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary table */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-10">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">At a Glance</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Compare the funding instruments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 pr-6 font-semibold text-gray-400 text-[10px] uppercase tracking-wide">Instrument</th>
                  <th className="text-left py-3 pr-6 font-semibold text-gray-400 text-[10px] uppercase tracking-wide">Max Amount</th>
                  <th className="text-left py-3 pr-6 font-semibold text-gray-400 text-[10px] uppercase tracking-wide">Type</th>
                  <th className="text-left py-3 font-semibold text-gray-400 text-[10px] uppercase tracking-wide">Stage</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((ins, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 pr-6 font-semibold text-[#111111]">{ins.name}</td>
                    <td className="py-4 pr-6 text-[#9EC84A] font-bold">{ins.amount}</td>
                    <td className="py-4 pr-6 text-gray-500">{ins.type}</td>
                    <td className="py-4 text-gray-500">{ins.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-[#f9f9f9] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Eligibility</p>
            <h2 className="text-[22px] font-black text-[#111111] leading-snug mb-5">Who can apply?</h2>
            <ul className="flex flex-col gap-3">
              {[
                "Every entrepreneur from Meghalaya is eligible to apply",
                "Applications open through the official PRIME website (www.primemeghalaya.com)",
                "Both registered and unregistered entities may apply",
                "Application windows and timelines are published on the PRIME portal",
              ].map((e, i) => (
                <li key={i} className="flex items-start gap-3 text-[12px] text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#9EC84A]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#9EC84A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Important Note</p>
            <h2 className="text-[22px] font-black text-[#111111] leading-snug mb-5">Check current windows</h2>
            <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
              Application windows and specific timelines for each funding instrument are regularly updated on the PRIME Meghalaya portal. Check the portal for the latest open rounds before applying.
            </p>
            <a
              href="https://portal.primemeghalaya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9EC84A] text-[12px] font-semibold hover:underline"
            >
              Visit portal.primemeghalaya.com →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-white mb-4">Apply for PRIME funding</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Register on the portal, find the right instrument for your stage, and take the next step in building your business.
          </p>
          <a
            href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-9 py-3 rounded-sm bg-[#9EC84A] text-white text-sm font-semibold hover:bg-[#8BB53F] transition-colors"
          >
            Register on PRIME Portal
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
