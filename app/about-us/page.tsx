import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const pillars = [
  {
    title: "Skills",
    description:
      "Skills and mindsets cut across the entire entrepreneurial journey, from aspiring to nano entrepreneur. We work with expert organisations to deliver entrepreneurial training, mentoring, and domain expertise.",
  },
  {
    title: "Technology",
    description:
      "Technology is a crucial driver for disseminating knowledge, increasing enterprise productivity and operational efficiencies — from online peer networks to opportunity maps.",
  },
  {
    title: "Market",
    description:
      "We build strong demand-side networks that support entrepreneurs while enabling them to recognise and serve local demand. Geography and sector-specific value chain support is at the core of our model.",
  },
  {
    title: "Credit & Finance",
    description:
      "Timely, low-cost and adequate financing is essential. We create solutions to de-risk lending, reduce opex of loan servicing, and unlock new approaches to capital access for entrepreneurs.",
  },
];

const components = [
  {
    label: "PRIME Hubs",
    detail: "Anchors for enterprise promotion set up in all district and block HQs, serving as centres for innovation, knowledge sharing, incubation and skill development.",
  },
  {
    label: "Startup Enterprises",
    detail: "~100 top entrepreneurial ideas selected and incubated annually — innovation-based and the vanguard of entrepreneurship in Meghalaya.",
  },
  {
    label: "Nano & Micro Enterprises",
    detail: "10,000 micro and nano enterprises incubated over five years through comprehensive business development, market access, technology and credit linkages.",
  },
  {
    label: "Livelihood Enterprises",
    detail: "Support for 50,000 livelihood enterprises through networks of Self Help Groups and Cooperative Societies.",
  },
  {
    label: "Dedicated Funding Windows",
    detail: "Interest subvention programs and credit enhancement through First Loan Default Guarantee (FLDG) schemes to improve access to bank finance.",
  },
  {
    label: "Mindset Interventions",
    detail: "Nurturing entrepreneurial mindsets in schools and colleges to create a culture of enterprise from the ground up.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Who we are"
        title="Promotion & Incubation of Market-driven Enterprises"
        subtitle="The Government of Meghalaya's comprehensive programme to build an entrepreneurial ecosystem that works for every kind of founder."
      />

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Story</p>
            <h2 className="text-[28px] md:text-[36px] font-black text-[#111111] leading-snug mb-5">
              Built to make entrepreneurship a preferred career for Meghalaya's youth
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              In August 2018, the Government of Meghalaya launched the Meghalaya Startup Policy with one goal: to emerge as one of India's leading Startup Hubs through strategic partnerships, a conducive ecosystem, investment, and policy interventions.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              <strong className="text-[#111111]">PRIME</strong> — the Promotion and Incubation of Market-driven Enterprises programme — is the vehicle for implementing that policy. It provides holistic, systematic support to aspiring entrepreneurs through a network of PRIME Hubs that act as one-stop-shops across the state.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="border-l-2 border-[#9EC84A] pl-4">
                <p className="text-xs font-bold text-[#9EC84A] uppercase tracking-wide mb-1">Vision</p>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Make entrepreneurship a preferred career choice through a dynamic, collaborative ecosystem with easy access to credit, technology, skilling, mentoring and high-leverage markets.
                </p>
              </div>
              <div className="border-l-2 border-[#111111] pl-4">
                <p className="text-xs font-bold text-[#111111] uppercase tracking-wide mb-1">Mission</p>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Provide systematic, targeted support to aspiring entrepreneurs through a network of PRIME Hubs — one-stop-shops for every segment of entrepreneur in Meghalaya.
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded overflow-hidden">
            <Image
              src="/assets/images/prime-about.jpg"
              alt="PRIME Meghalaya team in action"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Key Components */}
      <section className="bg-[#f9f9f9] py-20" id="overview">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Programme Architecture</p>
            <h2 className="text-[28px] md:text-[36px] font-black text-[#111111] leading-snug">
              Key components of the PRIME programme
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {components.map((c, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-6 hover:border-[#9EC84A]/40 transition-colors group">
                <div className="w-7 h-7 rounded-full bg-[#9EC84A]/10 flex items-center justify-center mb-4 group-hover:bg-[#9EC84A]/20 transition-colors">
                  <span className="text-[#9EC84A] font-black text-xs">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[#111111] mb-2">{c.label}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="bg-white py-20" id="journey">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Approach</p>
            <h2 className="text-[28px] md:text-[36px] font-black text-[#111111] leading-snug">
              The growth quartet that drives every entrepreneur
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="group">
                <div className="h-1 w-10 bg-[#9EC84A] mb-5 group-hover:w-full transition-all duration-500" />
                <h3 className="text-[15px] font-black text-[#111111] mb-3">{p.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-[#0d0d0d] py-16" id="partners">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">In partnership with</p>
          <h2 className="text-[24px] md:text-[32px] font-black text-white mb-8">Our institutional partners</h2>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-70">
            {["Government of Meghalaya", "IIM Calcutta Innovation Park", "MBMA", "MIE", "Startup India"].map((p) => (
              <span key={p} className="text-white text-sm font-semibold tracking-wide">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
