import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrimeRural from "@/components/sections/PrimeRural";

export const metadata: Metadata = {
  title: "PRIME Rural — Enterprise at the Village Level",
  description:
    "PRIME Rural brings entrepreneurship support to every village, hill, and valley in Meghalaya through the PRIME-Sauramandala Rural Entrepreneurship Fellowship.",
};

const supportAreas = [
  "Registration & Licensing",
  "Business Planning",
  "Book Keeping & Unit Economics",
  "Raw Materials Linkages",
  "Branding & Packaging",
  "Product Development",
  "Mechanisation",
  "Trainings",
  "Exposure Visits",
  "Capacity Building",
  "Man-Power",
  "Marketing",
  "Market Linkages",
  "Built Environment",
  "Solar Electrification",
  "Funding",
];

const rolePillars = [
  {
    title: "Catalyzing Rural Change",
    body: "Your mission is to be a catalyst for change, nurturing a supportive environment for rural entrepreneurs in Meghalaya. Your contributions will empower these entrepreneurs, shifting focus from traditional government jobs to entrepreneurship. You will belong to an exclusive PSREF community seamlessly integrated with the PRIME ecosystem — enabling continuous collaboration with fellow members, the dedicated PRIME-Sauramandala team, and respected mentors from diverse sectors.",
  },
  {
    title: "Gaining Valuable Experience",
    body: "By collaborating closely with diverse teams, experts, and funding organisations, you will experience frequent cross-functional interactions and involvement in projects supported by international partners such as the World Bank, JICA, or IFAD. This guarantees a unique exposure to rural development unlike any other — enabling you to gain profound insights and contribute to state-level policy discussions.",
  },
  {
    title: "Influencing Policy Changes",
    body: "By collecting insights from the field and working in partnership with policymakers to address pressing challenges. Your role will entail regular engagement with high-level officials, including Deputy Commissioners, Principal Secretaries, and community leaders. This exposure provides insights into the decision-making processes at the highest levels, while you develop essential life skills — interpersonal communication, interdisciplinary collaboration, and critical and design thinking.",
  },
  {
    title: "Rural Immersion",
    body: "By becoming an integral part of the local community, sharing experiences, culture, and knowledge. The experiences you acquire during PSREF will thoroughly prepare you for a career in rural development, startup incubation, or entrepreneurship promotion with national or international organisations. Upon completion, you receive a comprehensive certificate highlighting your achievements and areas of expertise.",
  },
];

const phases = [
  {
    phase: "Phase I",
    duration: "2 Months",
    title: "Immersion",
    items: [
      "Onboarding & teambuilding",
      "Rural immersion",
      "Understanding local scenarios in villages/blocks",
      "Connecting with local players",
      "Project planning",
    ],
  },
  {
    phase: "Phase II",
    duration: "14 Months",
    title: "Intensive Scouting",
    items: [
      "Identification of high-potential entrepreneurs",
      "Mapping of gaps and challenges",
      "Diagnostic and intervention planning",
      "Hand-holding process",
      "Mentor sessions, training, capacity building, and exposure visits",
      "Cross-learning between blocks",
    ],
  },
  {
    phase: "Phase III",
    duration: "2 Months",
    title: "Policy Advocacy & Transition",
    items: [
      "Documentation of outcomes and learnings for Cycle 2 of PSREF",
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
    qualification:
      "Graduate/Postgraduate in any discipline. 2–3 years experience in rural development, entrepreneurship, agri-business, incubation or startups.",
    age: "24–35 years",
    stipend: "₹40,000 / month",
    slots: "12 (Phase 1)",
    language: "English",
    note: "Citizens/youth of Meghalaya with a minimum of 3 years of full-time technical experience, or who have completed the fellowship as an Associate, may also apply as a Fellow.",
  },
  {
    title: "PRIME Associates",
    origin: "Citizens / Youth of Meghalaya only",
    duration: "18 months (Full-time in Meghalaya)",
    qualification:
      "Graduate/Postgraduate in any discipline. Freshers accepted with demonstrated project, research, or field experience related to rural development, entrepreneurship, agri-business, incubation or startups.",
    age: "20–28 years",
    stipend: "₹30,000 / month",
    slots: "24 (Phase 1)",
    language: "English and local dialect of the respective block",
    note: "Must be native to or have strong roots in the block the candidate is applying for.",
  },
];

export default function PrimeRuralPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">

        {/* Scroll-driven intro section */}
        <PrimeRural />

        {/* PSREF intro */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p
                  className="font-semibold tracking-[0.25em] uppercase text-black/35"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  About the Fellowship
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: "var(--text-heading)" }}
              >
                A bridge between aspiration and opportunity
              </h2>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                The PRIME-Sauramandala Rural Entrepreneurship Fellowship (PSREF) is a rural entrepreneurship
                programme by the Planning Department of the Government of Meghalaya, in collaboration with the
                Sauramandala Foundation.
              </p>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                In a world that is rapidly urbanising, PSREF hopes to build a conducive ecosystem for entrepreneurs
                from the most disconnected remote areas. This fellowship is more than just a programme — it&apos;s a
                bridge between aspirations and opportunities, between traditional wisdom and modern innovation,
                between the quiet villages and the bustling global markets.
              </p>
              <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                Every entrepreneur that emerges from PSREF is not just an individual with a business plan, but a
                story of grit, resilience, and an undying spirit. PRIME Fellows and local PRIME Associates are
                placed in remote blocks of Meghalaya, where they actively promote rural entrepreneurship — working
                full-time to identify promising entrepreneurs and address their challenges.
              </p>
            </div>

            {/* Support areas */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p
                  className="font-semibold tracking-[0.25em] uppercase text-black/35"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  Entrepreneurs&apos; Support Areas
                </p>
              </div>
              <div className="border-t border-black/[0.08]">
                {supportAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-4 py-3.5 border-b border-black/[0.08]">
                    <span
                      className="font-black text-[#2D6A4F] shrink-0 w-8"
                      style={{ fontSize: "var(--text-label)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-black/50" style={{ fontSize: "var(--text-sm)" }}>
                      {area}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Role of a Fellow / Associate */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p
                  className="font-semibold tracking-[0.25em] uppercase text-black/35"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  What You Will Do
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight"
                style={{ fontSize: "var(--text-heading)" }}
              >
                The role of a Fellow / Associate
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
              {rolePillars.map((r, i) => (
                <div key={i} className="bg-white p-8 md:p-10">
                  <p
                    className="font-black text-[#2D6A4F] mb-1"
                    style={{ fontSize: "var(--text-label)", letterSpacing: "0.05em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="font-black text-black mb-5 leading-tight"
                    style={{ fontSize: "var(--text-lead)" }}
                  >
                    {r.title}
                  </h3>
                  <p
                    className="text-black/45 leading-[1.85]"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programme Phases */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p
                  className="font-semibold tracking-[0.25em] uppercase text-black/35"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  Programme Structure
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight"
                style={{ fontSize: "var(--text-heading)" }}
              >
                18 months across three phases
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
              {phases.map((p) => (
                <div key={p.phase} className="bg-white p-8">
                  <p
                    className="font-bold text-[#2D6A4F] uppercase tracking-widest mb-1"
                    style={{ fontSize: "var(--text-label)" }}
                  >
                    {p.phase} — {p.duration}
                  </p>
                  <h3
                    className="font-black text-black mb-6"
                    style={{ fontSize: "var(--text-lead)" }}
                  >
                    {p.title}
                  </h3>
                  <div className="border-t border-black/[0.08]">
                    {p.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 py-3 border-b border-black/[0.08]">
                        <span className="text-[#2D6A4F] font-bold shrink-0 mt-0.5">—</span>
                        <p
                          className="text-black/50 leading-relaxed"
                          style={{ fontSize: "var(--text-sm)" }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* At a Glance — roles comparison */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p
                  className="font-semibold tracking-[0.25em] uppercase text-black/35"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  At a Glance
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight"
                style={{ fontSize: "var(--text-heading)" }}
              >
                Fellows & Associates
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
              {roles.map((r) => (
                <div key={r.title} className="bg-white p-8 md:p-10">
                  <h3
                    className="font-black text-black mb-8"
                    style={{ fontSize: "var(--text-heading)" }}
                  >
                    {r.title}
                  </h3>
                  <dl className="space-y-5 mb-6">
                    {[
                      { label: "Candidate Origin", val: r.origin },
                      { label: "Duration",         val: r.duration },
                      { label: "Age",              val: r.age },
                      { label: "Stipend",          val: r.stipend },
                      { label: "Slots (Phase 1)", val: r.slots },
                      { label: "Working Language", val: r.language },
                    ].map((d) => (
                      <div key={d.label}>
                        <dt
                          className="text-black/35 font-semibold uppercase tracking-wide mb-0.5"
                          style={{ fontSize: "var(--text-label)" }}
                        >
                          {d.label}
                        </dt>
                        <dd
                          className="font-semibold text-black"
                          style={{ fontSize: "var(--text-sm)" }}
                        >
                          {d.val}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="border-t border-black/[0.07] pt-5 space-y-3">
                    <p
                      className="text-black/40 leading-relaxed"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      <span className="font-semibold text-black/60">Qualification:</span>{" "}
                      {r.qualification}
                    </p>
                    <p
                      className="text-black/40 leading-relaxed"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      {r.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application process */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p
                  className="font-semibold tracking-[0.25em] uppercase text-black/35"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  Application Process
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: "var(--text-heading)" }}
              >
                Three-stage process, rolling intake
              </h2>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                The application process for the PRIME-Sauramandala Rural Entrepreneurship Fellowship — for both
                PRIME Fellows and PRIME Associates — is a three-stage process. As we are looking for real
                changemakers, the process is slightly different from what you would expect.
              </p>
              <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                The interview process is conducted on a rolling basis — early applications are strongly encouraged.
                Applications not adhering to the requirements or process will be disqualified.
              </p>
            </div>
            <div className="bg-[#f5f5f5] border border-black/[0.07] p-8 md:p-10 space-y-6">
              <p
                className="font-semibold text-black/60 leading-relaxed border-b border-black/[0.08] pb-6"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Current employees or contractors of the Government of Meghalaya, PRIME, MBMA, MBDA, MIE, or their
                affiliated organisations and NGOs are not eligible to apply.
              </p>
              <div>
                <p
                  className="font-semibold uppercase tracking-widest text-black/35 mb-3"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  Contact for queries
                </p>
                <div className="space-y-1">
                  <a
                    href="mailto:info@primemeghalaya.com"
                    className="block text-[#1B4332] font-semibold hover:underline"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    info@primemeghalaya.com
                  </a>
                  <a
                    href="mailto:info@sauramandala.org"
                    className="block text-[#1B4332] font-semibold hover:underline"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    info@sauramandala.org
                  </a>
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
              <p
                className="font-semibold tracking-[0.25em] uppercase text-white/30"
                style={{ fontSize: "var(--text-label)" }}
              >
                Apply
              </p>
            </div>
            <h2
              className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Be the change in rural Meghalaya
            </h2>
            <p
              className="text-white/40 leading-[1.75] mb-10 max-w-lg"
              style={{ fontSize: "var(--text-lead)" }}
            >
              Applications are reviewed on a rolling basis. Early applications are strongly encouraged. Reach us
              at info@primemeghalaya.com or info@sauramandala.org with any questions.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Apply Now
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
