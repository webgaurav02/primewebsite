import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">About the Fund</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
              Grant for Agroecology Program
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              PRIME Meghalaya, in collaboration with the GAP Fund and Access, introduced the IFAD-backed Grant for Agroecology Program at the PRIME Startup Hub Shillong. This fund offers a unique opportunity for Producer Groups and Micro & Small Enterprises (MSEs) to access substantial funding for agroecology-focused projects.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              The session was attended by 40 entrepreneurs both in person and virtually, featuring experience sharing from the All-Garo Hills Multipurpose Cooperative Society — which successfully secured funding for cashew plantation and revival, addressing the shift towards arecanut monoculture in the region.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8]">
              The fund is managed by <strong className="text-[#111111]">Access Development Services</strong> and backed by the International Fund for Agricultural Development (IFAD).
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="bg-[#f9f9f9] rounded p-6 border border-gray-100">
              <p className="text-[11px] text-[#9EC84A] font-bold uppercase tracking-widest mb-2">Eligibility</p>
              <ul className="flex flex-col gap-2">
                {["Producer Groups (farmer collectives, cooperatives, SHGs)", "Micro and Small Enterprises (MSEs) in agri and allied sectors", "Enterprises based in Meghalaya or other target states"].map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12px] text-gray-600">
                    <span className="text-[#9EC84A] font-bold mt-0.5 shrink-0">—</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f9f9f9] rounded p-6 border border-gray-100">
              <p className="text-[11px] text-[#9EC84A] font-bold uppercase tracking-widest mb-2">Focus Areas</p>
              <ul className="flex flex-col gap-2">
                {["Agroecology and sustainable farming", "Cashew, spice, and plantation crops", "Rural supply chain development", "Value-addition and processing", "Women-led and cooperative enterprises"].map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12px] text-gray-600">
                    <span className="text-[#9EC84A] font-bold mt-0.5 shrink-0">—</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fund types */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Fund Typologies</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Two funding tracks available
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {fundTypes.map((f) => (
              <div
                key={f.name}
                className={`rounded p-8 border ${f.highlight ? "bg-[#0d0d0d] border-[#9EC84A]/30" : "bg-white border-gray-100"}`}
              >
                <h3 className={`text-[18px] font-black mb-2 ${f.highlight ? "text-white" : "text-[#111111]"}`}>{f.name}</h3>
                <p className={`text-[28px] font-black text-[#9EC84A] leading-none mb-5`}>{f.range}</p>
                <dl className="flex flex-col gap-3">
                  {[
                    { label: "Scope", val: f.scope },
                    { label: "Availability", val: f.availability },
                    { label: "Eligibility", val: f.eligibility },
                  ].map((d) => (
                    <div key={d.label}>
                      <dt className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${f.highlight ? "text-gray-400" : "text-gray-400"}`}>{d.label}</dt>
                      <dd className={`text-[12px] ${f.highlight ? "text-gray-300" : "text-gray-600"}`}>{d.val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Application Process</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              How to apply for GAP funding
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((t) => (
              <div key={t.step} className="group">
                <div className="h-1 w-10 bg-[#9EC84A] mb-5 group-hover:w-full transition-all duration-500" />
                <p className="text-[#9EC84A] font-black text-xs mb-2">{t.step}</p>
                <h3 className="text-[14px] font-black text-[#111111] mb-2">{t.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-white mb-4">Interested in GAP Funding?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            PRIME Meghalaya can help you navigate the application process. Register on our portal or reach out directly for guidance.
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
