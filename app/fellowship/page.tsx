import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

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
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                About the Fellowship
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              A bridge between aspiration and opportunity
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              The PRIME-Sauramandala Rural Entrepreneurship Fellowship (PSREF) is a rural entrepreneurship programme by the Planning Department of the Government of Meghalaya, in collaboration with the Sauramandala Foundation.
            </p>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              In a world that is rapidly urbanising, PSREF hopes to build a conducive ecosystem for entrepreneurs from the most disconnected remote areas. This fellowship is more than just a programme — it&apos;s a bridge between aspirations and opportunities, between traditional wisdom and modern innovation.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              Fellows and Associates are placed in remote blocks of Meghalaya, where they actively promote rural entrepreneurship — working full-time to identify promising entrepreneurs and address their challenges.
            </p>
          </div>
          <div>
            <ImagePlaceholder label="Fellowship in the Field" className="aspect-[4/3] mb-10" />
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Entrepreneurs&apos; Support Areas
              </p>
            </div>
            <div className="border-t border-black/[0.08] mb-10">
              {supportAreas.map((a, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-black/[0.08]">
                  <span className="font-black text-[#2D6A4F] shrink-0" style={{ fontSize: "var(--text-label)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-black/50" style={{ fontSize: "var(--text-body)" }}>{a}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#f5f5f5] p-6 border border-black/[0.07]">
              <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                Upon completion, Fellows and Associates receive a comprehensive certificate highlighting achievements and expertise — and are prepared for careers in rural development, startup incubation, or entrepreneurship promotion with national or international organisations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Phases */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
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
                <p className="font-bold text-[#2D6A4F] uppercase tracking-widest mb-1" style={{ fontSize: "var(--text-label)" }}>
                  {p.phase} — {p.duration}
                </p>
                <h3 className="font-black text-black mb-6" style={{ fontSize: "var(--text-lead)" }}>
                  {p.title}
                </h3>
                <div className="border-t border-black/[0.08]">
                  {p.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-black/[0.08]">
                      <span className="text-[#2D6A4F] font-bold shrink-0 mt-0.5">—</span>
                      <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Who Can Apply
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
              <div key={r.title} className="bg-white p-8">
                <h3 className="font-black text-black mb-8" style={{ fontSize: "var(--text-heading)" }}>
                  {r.title}
                </h3>
                <dl className="grid grid-cols-2 gap-y-6 gap-x-6 mb-6">
                  {[
                    { label: "Origin", val: r.origin },
                    { label: "Duration", val: r.duration },
                    { label: "Age", val: r.age },
                    { label: "Stipend", val: r.stipend },
                    { label: "Slots", val: r.slots },
                  ].map((d) => (
                    <div key={d.label}>
                      <dt className="text-black/35 font-semibold uppercase tracking-wide mb-1" style={{ fontSize: "var(--text-label)" }}>
                        {d.label}
                      </dt>
                      <dd className="font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{d.val}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-black/40 leading-relaxed border-t border-black/[0.07] pt-4" style={{ fontSize: "var(--text-sm)" }}>
                  {r.qualification}
                </p>
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
              Apply
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Be the change in rural Meghalaya
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Applications are reviewed on a rolling basis. Early applications are strongly encouraged. Contact us at info@primemeghalaya.com or info@sauramandala.org.
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

      <Footer />
    </>
  );
}
