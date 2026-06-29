import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const schemes = [
  {
    tag: "Flagship",
    name: "CM Elevate",
    tagline: "Chief Minister's E-Championship Challenge",
    desc: "The government's flagship incubation challenge. 75 entrepreneurs selected annually for a 9-month intensive programme. Top 35 receive ₹2 lakh grants; the next 40 receive ₹1 lakh each.",
    href: "/cm-elevate",
    highlight: true,
  },
  {
    tag: "Innovation Fund",
    name: "PRIME Entrepreneurship Fund",
    tagline: "Dedicated innovation-based funding",
    desc: "A dedicated fund for innovation-based startups incubated through PRIME. Provides direct financing to businesses that show strong growth potential and are beyond the seed stage.",
    href: "/prime-entrepreneurship-funding",
    highlight: false,
  },
  {
    tag: "Credit Access",
    name: "FLDG Mechanism",
    tagline: "First Loss Default Guarantee",
    desc: "PRIME's credit enhancement scheme that de-risks lending for banks and financial institutions, enabling micro, nano, and solo entrepreneurs to access formal bank credit with reduced collateral requirements.",
    href: "/funding-schemes",
    highlight: false,
  },
  {
    tag: "Youth",
    name: "Student Tinkering Fund",
    tagline: "Empowering student entrepreneurs",
    desc: "Targeted support for students turning ideas into businesses. Provides seed capital, mentorship, and access to PRIME co-working facilities for early-stage student-led ventures.",
    href: "/student-tinkering-fund",
    highlight: false,
  },
  {
    tag: "Agriculture",
    name: "IFAD GAP Funding",
    tagline: "International Fund for Agricultural Development",
    desc: "Funding support for agri-entrepreneurs and rural enterprises through the IFAD-backed programme, focused on bridging financing gaps in Meghalaya's agricultural and rural enterprise ecosystem.",
    href: "/ifad-gap-funding",
    highlight: false,
  },
  {
    tag: "Food Processing",
    name: "Interest-Free Bank Loans",
    tagline: "For food processing entrepreneurs",
    desc: "Interest-free bank loans targeted at entrepreneurs in the food processing sector — reducing the cost of capital and encouraging value addition to Meghalaya's rich agricultural produce.",
    href: "/funding-schemes",
    highlight: false,
  },
];

const creditChallenges = [
  "High collateral requirements that exclude nano and micro entrepreneurs",
  "Lack of formal credit history among first-generation entrepreneurs",
  "Limited bank presence in rural and remote areas of Meghalaya",
  "Information asymmetry between borrowers and financial institutions",
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded overflow-hidden order-last md:order-first">
            <Image
              src="/assets/images/funding.jpg"
              alt="PRIME Funding Schemes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The Challenge</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
              Unlocking credit for Meghalaya&apos;s entrepreneurs
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-5">
              Access to timely, low-cost financing remains one of the biggest barriers facing entrepreneurs in Meghalaya — particularly micro, nano, and solo operators who fall outside the reach of traditional banking.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-6">
              PRIME addresses this through a combination of direct grants, interest-free loans, credit enhancement mechanisms, and a dedicated innovation fund — ensuring every entrepreneur, regardless of stage or sector, has a pathway to capital.
            </p>
            <ul className="flex flex-col gap-2.5">
              {creditChallenges.map((c, i) => (
                <li key={i} className="flex items-start gap-3 text-[12px] text-gray-500 leading-relaxed">
                  <span className="w-4 h-4 rounded-full border border-[#9EC84A]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9EC84A]" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Schemes grid */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Programmes</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Funding windows available through PRIME
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((s) => (
              <div
                key={s.name}
                className={`rounded p-6 flex flex-col border transition-colors ${
                  s.highlight
                    ? "bg-[#0d0d0d] border-[#9EC84A]/30 hover:border-[#9EC84A]/60"
                    : "bg-white border-gray-100 hover:border-[#9EC84A]/40"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${
                    s.highlight ? "text-[#9EC84A]" : "text-[#9EC84A]"
                  }`}
                >
                  {s.tag}
                </span>
                <h3
                  className={`text-[15px] font-black mb-1 ${
                    s.highlight ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {s.name}
                </h3>
                <p
                  className={`text-[11px] mb-3 ${
                    s.highlight ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {s.tagline}
                </p>
                <p
                  className={`text-[12px] leading-relaxed flex-1 ${
                    s.highlight ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Next Steps</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              How to access funding through PRIME
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Register on the portal", desc: "Create an account on the PRIME entrepreneur portal at portal.primemeghalaya.com to begin your application." },
              { step: "02", title: "Connect with your PRIME Hub", desc: "Visit or contact the nearest PRIME Hub in your district. Our team will assess your stage and match you to the right funding window." },
              { step: "03", title: "Apply & pitch", desc: "Submit your business plan and go through the assessment process. Selected entrepreneurs receive grants, loans, or credit linkages based on their profile." },
            ].map((s) => (
              <div key={s.step} className="group">
                <div className="h-1 w-10 bg-[#9EC84A] mb-5 group-hover:w-full transition-all duration-500" />
                <p className="text-[#9EC84A] font-black text-xs mb-2">{s.step}</p>
                <h3 className="text-[15px] font-black text-[#111111] mb-2">{s.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[40px] font-black text-white mb-4">
            Find the right scheme for you
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Register on the PRIME portal and our team will guide you to the most suitable funding opportunity for your business.
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
