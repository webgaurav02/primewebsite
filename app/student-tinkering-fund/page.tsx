import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 max-w-3xl">
          <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">About the Fund</p>
          <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
            Funding for student innovators
          </h2>
          <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
            PRIME has established a dedicated funding vehicle for students or student teams working on innovative, entrepreneurship-related business and research ideas. This initiative is part of PRIME&apos;s Entrepreneurship Promotion and Development Programmes (EPDP) for academic institutes in Meghalaya.
          </p>
          <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
            Based on recommendations brought forward by the E-Cells of PRIME-supported academic institutes, an initial lump sum of ₹25,000 is disbursed directly to the student team — with a second tranche of ₹25,000 available to top performers.
          </p>
          <p className="text-[13px] text-gray-600 leading-[1.8]">
            Students who successfully implement their funded project are closely linked to PRIME&apos;s broader ecosystem — gaining access to pre-incubation, incubation, and advanced funding programmes.
          </p>
        </div>
      </section>

      {/* Tranches */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Grant Structure</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Up to ₹50,000 in two tranches
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {tranches.map((t) => (
              <div key={t.label} className="bg-white border border-gray-100 rounded p-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t.label}</p>
                <p className="text-[44px] font-black text-[#9EC84A] leading-none mb-3">{t.amount}</p>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{t.desc}</p>
                <p className="text-[11px] text-gray-400 italic">{t.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">How It Works</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              The application process
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="group">
                <div className="h-1 w-10 bg-[#9EC84A] mb-5 group-hover:w-full transition-all duration-500" />
                <p className="text-[#9EC84A] font-black text-xs mb-2">{s.step}</p>
                <h3 className="text-[14px] font-black text-[#111111] mb-2">{s.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-gray-400 mt-10 max-w-2xl">
            Not sure if your institute has an E-Cell? Contact PRIME directly at{" "}
            <a href="mailto:info@primemeghalaya.com" className="text-[#9EC84A] hover:underline">info@primemeghalaya.com</a>{" "}
            and we&apos;ll guide you to the right resource.
          </p>
        </div>
      </section>

      {/* What's next */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Your Journey After</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              The Tinkering Fund is just the beginning
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pathways.map((p, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-6 hover:border-[#9EC84A]/40 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#9EC84A]/10 flex items-center justify-center mb-4">
                  <span className="text-[#9EC84A] font-black text-xs">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[#111111] mb-2">{p.label}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-white mb-4">Are you a student with a big idea?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Talk to your college E-Cell or contact PRIME directly. Your idea could be the next success story from Meghalaya.
          </p>
          <a
            href="mailto:info@primemeghalaya.com"
            className="inline-block px-9 py-3 rounded-sm bg-[#9EC84A] text-white text-sm font-semibold hover:bg-[#8BB53F] transition-colors"
          >
            Contact PRIME
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
