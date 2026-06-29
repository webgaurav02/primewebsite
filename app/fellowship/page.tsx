import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const supportAreas = [
  "Registration & Licensing",
  "Book Keeping & Unit Economics",
  "Raw Materials Linkages",
  "Branding & Packaging",
  "Solar Electrification",
];

const phases = [
  {
    phase: "Phase I",
    duration: "2 Months",
    title: "Immersion",
    items: ["Onboarding & teambuilding", "Understanding local scenarios in villages/blocks", "Connecting with local players"],
  },
  {
    phase: "Phase II",
    duration: "14 Months",
    title: "Intensive Scouting",
    items: [
      "Identification of high-potential entrepreneurs",
      "Mapping of gaps and challenges",
      "Diagnostic and intervention planning",
      "Mentor sessions, training, capacity building, exposure visits",
      "Cross-learning between blocks",
    ],
  },
  {
    phase: "Phase III",
    duration: "2 Months",
    title: "Policy Advocacy & Transition",
    items: [
      "Documentation of outcomes and learnings",
      "Presentation of insights to administration",
      "Implementation of feedbacks into PSREF structure",
      "Handover of responsibilities to new Fellows/Associates",
    ],
  },
];

const roles = [
  {
    title: "PRIME Fellows",
    origin: "From across India",
    duration: "18 months (Full-time in Meghalaya)",
    qualification: "Graduate/Postgraduate in any discipline. 2–3 years experience in rural development, entrepreneurship, agri-business, or incubation.",
    age: "24–35 years",
    stipend: "₹40,000/month",
    slots: "12 (Phase 1)",
  },
  {
    title: "PRIME Associates",
    origin: "Citizens/Youth of Meghalaya only",
    duration: "18 months (Full-time in Meghalaya)",
    qualification: "Graduate/Postgraduate in any discipline. Freshers accepted with demonstrated project or field experience.",
    age: "20–28 years",
    stipend: "₹30,000/month",
    slots: "24 (Phase 1)",
  },
];

export default function FellowshipPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Sector"
        title="PRIME-Sauramandala Rural Entrepreneurship Fellowship"
        subtitle="A one-of-a-kind opportunity for young changemakers to build an entrepreneurial ecosystem in Meghalaya's most remote communities."
      />

      {/* Overview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">About the Fellowship</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
              A bridge between aspiration and opportunity
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              The PRIME-Sauramandala Rural Entrepreneurship Fellowship (PSREF) is a rural entrepreneurship programme by the Planning Department of the Government of Meghalaya, in collaboration with the Sauramandala Foundation.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              In a world that is rapidly urbanising, PSREF hopes to build a conducive ecosystem for entrepreneurs from the most disconnected remote areas. This fellowship is more than just a programme — it&apos;s a bridge between aspirations and opportunities, between traditional wisdom and modern innovation.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8]">
              Fellows and Associates are placed in remote blocks of Meghalaya, where they actively promote rural entrepreneurship — working full-time to identify promising entrepreneurs and address their challenges.
            </p>
          </div>
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Entrepreneurs&apos; Support Areas</p>
            <ul className="flex flex-col gap-2 mb-8">
              {supportAreas.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-[#9EC84A]/15 flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#9EC84A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="bg-[#f9f9f9] rounded p-5 text-[12px] text-gray-500 leading-relaxed border border-gray-100">
              Upon completion, Fellows and Associates receive a comprehensive certificate highlighting achievements and expertise — and are prepared for careers in rural development, startup incubation, or entrepreneurship promotion with national or international organisations.
            </div>
          </div>
        </div>
      </section>

      {/* Programme Phases */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Programme Structure</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              18 months across three phases
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((p) => (
              <div key={p.phase} className="bg-white border border-gray-100 rounded p-6">
                <p className="text-[10px] text-[#9EC84A] font-bold uppercase tracking-widest mb-1">{p.phase} — {p.duration}</p>
                <h3 className="text-[15px] font-black text-[#111111] mb-4">{p.title}</h3>
                <ul className="flex flex-col gap-2">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-gray-500 leading-relaxed">
                      <span className="text-[#9EC84A] font-bold shrink-0 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Who Can Apply</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Fellows & Associates
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((r) => (
              <div key={r.title} className="border border-gray-100 rounded p-7">
                <h3 className="text-[16px] font-black text-[#111111] mb-5">{r.title}</h3>
                <dl className="grid grid-cols-2 gap-y-4 gap-x-6">
                  {[
                    { label: "Origin", val: r.origin },
                    { label: "Duration", val: r.duration },
                    { label: "Age", val: r.age },
                    { label: "Stipend", val: r.stipend },
                    { label: "Slots", val: r.slots },
                  ].map((d) => (
                    <div key={d.label}>
                      <dt className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{d.label}</dt>
                      <dd className="text-[12px] font-semibold text-[#111111]">{d.val}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">{r.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-white mb-4">Be the change in rural Meghalaya</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
            Applications are reviewed on a rolling basis. Early applications are strongly encouraged. Contact us at info@primemeghalaya.com or info@sauramandala.org.
          </p>
          <a
            href="mailto:info@primemeghalaya.com"
            className="inline-block px-9 py-3 rounded-sm bg-[#9EC84A] text-white text-sm font-semibold hover:bg-[#8BB53F] transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
