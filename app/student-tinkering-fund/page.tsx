import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import HoverCard from "@/components/ui/HoverCard";

const tranches = [
  {
    label: "First Tranche",
    amount: "₹25,000",
    desc: "Disbursed directly to the student team upon recommendation by the E-Cell of a PRIME-supported academic institute.",
    condition: "Initial lump sum to get your project started.",
  },
  {
    label: "Second Tranche",
    amount: "₹25,000",
    desc: "Available to student teams demonstrating exceptional progress and strong utilisation of first-tranche funds.",
    condition: "Subject to report submission and performance review.",
  },
];

const steps = [
  { step: "01", title: "Connect with your E-Cell", desc: "Reach out to the Entrepreneurship Cell (E-Cell) of your college or university that is part of the PRIME ecosystem." },
  { step: "02", title: "Submit your idea", desc: "Present your innovative business or research idea to your E-Cell. They will evaluate it and bring forward recommendations to PRIME." },
  { step: "03", title: "Receive the grant", desc: "Upon E-Cell recommendation, PRIME disburses ₹25,000 directly to your team to begin working on your project." },
  { step: "04", title: "Report & scale", desc: "Submit a progress report. High performers may receive the second tranche of ₹25,000 to continue scaling their project." },
];

const pathways = [
  { label: "Pre-Incubation", desc: "Connect with other early-stage student entrepreneurs and get structured support to refine your business concept." },
  { label: "Incubation", desc: "Move into the PRIME incubation programme — mentorship, co-working, and a pathway to funding for the most promising ideas." },
  { label: "Funding", desc: "Access PRIME's broader suite of funding instruments as your business matures beyond the student stage." },
];

export default function StudentTinkeringFundPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Funding & Schemes"
        title="Student Tinkering Fund"
        subtitle="Up to ₹50,000 in seed funding for student entrepreneurs in Meghalaya's colleges and universities — turning ideas into ventures."
      />

      {/* Intro */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
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
              Funding for student innovators
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              PRIME has established a dedicated funding vehicle for students or student teams working on innovative, entrepreneurship-related business and research ideas. This initiative is part of PRIME&apos;s Entrepreneurship Promotion and Development Programmes (EPDP) for academic institutes in Meghalaya.
            </p>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              Based on recommendations brought forward by the E-Cells of PRIME-supported academic institutes, an initial lump sum of ₹25,000 is disbursed directly to the student team — with a second tranche of ₹25,000 available to top performers.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              Students who successfully implement their funded project are closely linked to PRIME&apos;s broader ecosystem — gaining access to pre-incubation, incubation, and advanced funding programmes.
            </p>
          </div>
        </div>
      </section>

      {/* Tranches */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Grant Structure
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Up to ₹50,000 in two tranches
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
            {tranches.map((t) => (
              <div key={t.label} className="bg-white p-8 flex flex-col">
                <p className="text-black/35 font-semibold uppercase tracking-wide mb-4" style={{ fontSize: "var(--text-label)" }}>
                  {t.label}
                </p>
                <p className="font-black text-[#2D6A4F] leading-[0.9] mb-4" style={{ fontSize: "var(--text-heading)" }}>
                  {t.amount}
                </p>
                <p className="text-black/50 leading-relaxed mb-3 mt-auto" style={{ fontSize: "var(--text-body)" }}>{t.desc}</p>
                <p className="text-black/35 italic" style={{ fontSize: "var(--text-sm)" }}>{t.condition}</p>
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
                How It Works
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              The application process
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
            {steps.map((s) => (
              <HoverCard key={s.step} className="p-8">
                <div className="h-px w-10 bg-[#2D6A4F] mb-8" />
                <p className="font-black text-[#2D6A4F] mb-3" style={{ fontSize: "var(--text-label)" }}>
                  {s.step}
                </p>
                <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>
                  {s.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {s.desc}
                </p>
              </HoverCard>
            ))}
          </div>
          <p className="text-black/40 mt-8 max-w-2xl" style={{ fontSize: "var(--text-sm)" }}>
            Not sure if your institute has an E-Cell? Contact PRIME directly at{" "}
            <a href="mailto:info@primemeghalaya.com" className="text-[#2D6A4F] hover:underline">
              info@primemeghalaya.com
            </a>{" "}
            and we&apos;ll guide you to the right resource.
          </p>
        </div>
      </section>

      {/* What's next */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Your Journey After
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              The Tinkering Fund is just the beginning
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {pathways.map((p, i) => (
              <HoverCard key={i} className="p-8">
                <p className="font-black text-[#2D6A4F] mb-5" style={{ fontSize: "var(--text-label)" }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{p.label}</h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
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
            Are you a student with a big idea?
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Talk to your college E-Cell or contact PRIME directly. Your idea could be the next success story from Meghalaya.
          </p>
          <a
            href="mailto:info@primemeghalaya.com"
            className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Contact PRIME
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
