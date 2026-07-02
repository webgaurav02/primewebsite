import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import {
  HiStar,
  HiFire,
  HiShieldCheck,
  HiAcademicCap,
  HiHome,
  HiCurrencyRupee,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const schemes: { tag: string; name: string; tagline: string; desc: string; href: string; highlight: boolean; Icon: IconType }[] = [
  { tag: "Flagship",        name: "CM Elevate",                  tagline: "Chief Minister's E-Championship Challenge",    desc: "The government's flagship incubation challenge. 75 entrepreneurs selected annually for a 9-month intensive programme. Top 35 receive ₹2 lakh grants; the next 40 receive ₹1 lakh each.",                                                                                               href: "/cm-elevate",                     highlight: true,  Icon: HiStar },
  { tag: "Innovation Fund", name: "PRIME Entrepreneurship Fund", tagline: "Dedicated innovation-based funding",           desc: "A dedicated fund for innovation-based startups incubated through PRIME. Provides direct financing to businesses that show strong growth potential and are beyond the seed stage.",                                                                                        href: "/prime-entrepreneurship-funding", highlight: false, Icon: HiFire },
  { tag: "Credit Access",   name: "FLDG Mechanism",              tagline: "First Loss Default Guarantee",                 desc: "PRIME's credit enhancement scheme that de-risks lending for banks and financial institutions, enabling micro, nano, and solo entrepreneurs to access formal bank credit with reduced collateral requirements.",                                                             href: "/funding-schemes",                highlight: false, Icon: HiShieldCheck },
  { tag: "Youth",           name: "Student Tinkering Fund",      tagline: "Empowering student entrepreneurs",            desc: "Targeted support for students turning ideas into businesses. Provides seed capital, mentorship, and access to PRIME co-working facilities for early-stage student-led ventures.",                                                                                   href: "/student-tinkering-fund",         highlight: false, Icon: HiAcademicCap },
  { tag: "Agriculture",     name: "IFAD GAP Funding",            tagline: "International Fund for Agricultural Development", desc: "Funding support for agri-entrepreneurs and rural enterprises through the IFAD-backed programme, focused on bridging financing gaps in Meghalaya's agricultural and rural enterprise ecosystem.",                                                               href: "/ifad-gap-funding",               highlight: false, Icon: HiHome },
  { tag: "Food Processing", name: "Interest-Free Bank Loans",    tagline: "For food processing entrepreneurs",           desc: "Interest-free bank loans targeted at entrepreneurs in the food processing sector — reducing the cost of capital and encouraging value addition to Meghalaya's rich agricultural produce.",                                                                        href: "/funding-schemes",                highlight: false, Icon: HiCurrencyRupee },
];

const creditChallenges = [
  "High collateral requirements that exclude nano and micro entrepreneurs",
  "Lack of formal credit history among first-generation entrepreneurs",
  "Limited bank presence in rural and remote areas of Meghalaya",
  "Information asymmetry between borrowers and financial institutions",
];

const steps = [
  { step: "01", title: "Register on the portal", desc: "Create an account on the PRIME entrepreneur portal at portal.primemeghalaya.com to begin your application." },
  { step: "02", title: "Connect with your PRIME Hub", desc: "Visit or contact the nearest PRIME Hub in your district. Our team will assess your stage and match you to the right funding window." },
  { step: "03", title: "Apply & pitch", desc: "Submit your business plan and go through the assessment process. Selected entrepreneurs receive grants, loans, or credit linkages based on their profile." },
];

export default function FundingSchemesPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Funding & Schemes"
        title="Financing Meghalaya's entrepreneurs"
        subtitle="From seed grants to credit guarantees — PRIME runs a suite of funding mechanisms designed to get capital into the hands of the state's most ambitious founders."
      />

      {/* Intro with image */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden order-last md:order-first">
            <Image
              src="/assets/images/funding.jpg"
              alt="PRIME Funding Schemes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                The Challenge
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Unlocking credit for Meghalaya&apos;s entrepreneurs
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              Access to timely, low-cost financing remains one of the biggest barriers facing entrepreneurs in Meghalaya — particularly micro, nano, and solo operators who fall outside the reach of traditional banking.
            </p>
            <p className="text-black/50 leading-[1.8] mb-8" style={{ fontSize: "var(--text-body)" }}>
              PRIME addresses this through a combination of direct grants, interest-free loans, credit enhancement mechanisms, and a dedicated innovation fund — ensuring every entrepreneur, regardless of stage or sector, has a pathway to capital.
            </p>
            <div className="border-t border-black/[0.08]">
              {creditChallenges.map((c, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-black/[0.08]">
                  <span className="font-black text-[#2D6A4F] shrink-0 mt-0.5" style={{ fontSize: "var(--text-label)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schemes grid */}
      <section className="bg-[#f5f5f5] py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Our Programmes
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Funding windows available through PRIME
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {schemes.map((s) => (
              <div
                key={s.name}
                className={`flex flex-col p-8 transition-colors ${
                  s.highlight ? "bg-[#1B4332]" : "bg-white hover:bg-[#f5f5f5]"
                }`}
              >
                <div className={`w-12 h-12 flex items-center justify-center mb-6 ${s.highlight ? "bg-white/10" : "bg-[#74C69D]/20"}`}>
                  <span className={s.highlight ? "text-[#74C69D]" : "text-[#2D6A4F]"}><s.Icon size={24} /></span>
                </div>
                <p className="font-bold text-[#2D6A4F] uppercase tracking-widest mb-4" style={{ fontSize: "var(--text-label)" }}>
                  {s.tag}
                </p>
                <h3
                  className={`font-black mb-2 ${s.highlight ? "text-white" : "text-black"}`}
                  style={{ fontSize: "var(--text-lead)" }}
                >
                  {s.name}
                </h3>
                <p className={`mb-4 ${s.highlight ? "text-white/35" : "text-black/35"}`} style={{ fontSize: "var(--text-sm)" }}>
                  {s.tagline}
                </p>
                <p
                  className={`leading-relaxed flex-1 ${s.highlight ? "text-white/50" : "text-black/50"}`}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Next Steps
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              How to access funding through PRIME
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {steps.map((s) => (
              <div key={s.step} className="bg-white p-8 group hover:bg-[#f5f5f5] transition-colors">
                <div className="h-px w-10 bg-[#2D6A4F] mb-8 group-hover:w-full transition-all duration-500" />
                <p className="font-black text-[#2D6A4F] mb-3" style={{ fontSize: "var(--text-label)" }}>
                  {s.step}
                </p>
                <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-lead)" }}>
                  {s.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4332] py-24 md:py-36">
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
            Find the right scheme for you
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Register on the PRIME portal and our team will guide you to the most suitable funding opportunity for your business.
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
