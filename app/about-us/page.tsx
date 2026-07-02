import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import {
  HiOfficeBuilding,
  HiLightningBolt,
  HiHome,
  HiUsers,
  HiCreditCard,
  HiAcademicCap,
  HiChip,
  HiTrendingUp,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const pillars: { title: string; description: string; Icon: IconType }[] = [
  { title: "Skills",         description: "Skills and mindsets cut across the entire entrepreneurial journey, from aspiring to nano entrepreneur. We work with expert organisations to deliver entrepreneurial training, mentoring, and domain expertise.", Icon: HiLightningBolt },
  { title: "Technology",     description: "Technology is a crucial driver for disseminating knowledge, increasing enterprise productivity and operational efficiencies — from online peer networks to opportunity maps.", Icon: HiChip },
  { title: "Market",         description: "We build strong demand-side networks that support entrepreneurs while enabling them to recognise and serve local demand. Geography and sector-specific value chain support is at the core of our model.", Icon: HiTrendingUp },
  { title: "Credit & Finance", description: "Timely, low-cost and adequate financing is essential. We create solutions to de-risk lending, reduce opex of loan servicing, and unlock new approaches to capital access for entrepreneurs.", Icon: HiCreditCard },
];

const components: { label: string; detail: string; Icon: IconType }[] = [
  { label: "PRIME Hubs",              detail: "Anchors for enterprise promotion set up in all district and block HQs, serving as centres for innovation, knowledge sharing, incubation and skill development.", Icon: HiOfficeBuilding },
  { label: "Startup Enterprises",     detail: "~100 top entrepreneurial ideas selected and incubated annually — innovation-based and the vanguard of entrepreneurship in Meghalaya.", Icon: HiLightningBolt },
  { label: "Nano & Micro Enterprises", detail: "10,000 micro and nano enterprises incubated over five years through comprehensive business development, market access, technology and credit linkages.", Icon: HiHome },
  { label: "Livelihood Enterprises",  detail: "Support for 50,000 livelihood enterprises through networks of Self Help Groups and Cooperative Societies.", Icon: HiUsers },
  { label: "Dedicated Funding Windows", detail: "Interest subvention programs and credit enhancement through First Loan Default Guarantee (FLDG) schemes to improve access to bank finance.", Icon: HiCreditCard },
  { label: "Mindset Interventions",   detail: "Nurturing entrepreneurial mindsets in schools and colleges to create a culture of enterprise from the ground up.", Icon: HiAcademicCap },
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
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Our Story
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Built to make entrepreneurship a preferred career for Meghalaya&apos;s youth
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              In August 2018, the Government of Meghalaya launched the Meghalaya Startup Policy with one goal: to emerge as one of India&apos;s leading Startup Hubs through strategic partnerships, a conducive ecosystem, investment, and policy interventions.
            </p>
            <p className="text-black/50 leading-[1.8] mb-8" style={{ fontSize: "var(--text-body)" }}>
              <strong className="text-black">PRIME</strong> — the Promotion and Incubation of Market-driven Enterprises programme — is the vehicle for implementing that policy. It provides holistic, systematic support to aspiring entrepreneurs through a network of PRIME Hubs that act as one-stop-shops across the state.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-2 border-[#2D6A4F] pl-4">
                <p className="font-bold text-[#2D6A4F] uppercase tracking-wide mb-2" style={{ fontSize: "var(--text-label)" }}>
                  Vision
                </p>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  Make entrepreneurship a preferred career choice through a dynamic, collaborative ecosystem with easy access to credit, technology, skilling, mentoring and high-leverage markets.
                </p>
              </div>
              <div className="border-l-2 border-black pl-4">
                <p className="font-bold text-black uppercase tracking-wide mb-2" style={{ fontSize: "var(--text-label)" }}>
                  Mission
                </p>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  Provide systematic, targeted support to aspiring entrepreneurs through a network of PRIME Hubs — one-stop-shops for every segment of entrepreneur in Meghalaya.
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden">
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
      <section className="bg-[#f5f5f5] py-24 md:py-36" id="overview">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Programme Architecture
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Key components of the PRIME programme
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {components.map((c) => (
              <div key={c.label} className="bg-white p-8 group hover:bg-[#f5f5f5] transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-[#74C69D]/20 mb-6">
                  <span className="text-[#2D6A4F]"><c.Icon size={24} /></span>
                </div>
                <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>
                  {c.label}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy / Pillars */}
      <section className="bg-white py-24 md:py-36" id="journey">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Our Approach
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              The growth quartet that drives every entrepreneur
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white p-8 group hover:bg-[#f5f5f5] transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-[#74C69D]/20 mb-6">
                  <span className="text-[#2D6A4F]"><p.Icon size={24} /></span>
                </div>
                <h3 className="font-black text-black mb-4" style={{ fontSize: "var(--text-lead)" }}>
                  {p.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-[#1B4332] py-24 md:py-36" id="partners">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
              In partnership with
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-16"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Our institutional partners
          </h2>
          <div className="flex flex-wrap items-center gap-x-14 gap-y-10">
            {[
              { name: "Startup India",                           src: "/assets/partners/startup-india.png", w: 541, h: 140 },
              { name: "IIM Calcutta Innovation Park",            src: "/assets/partners/iim-calcutta.png",  w: 350, h: 381 },
              { name: "MBMA",                                    src: "/assets/partners/mbma.png",          w: 445, h: 155 },
              { name: "Meghalaya Institute of Entrepreneurship", src: "/assets/partners/mie.png",           w: 168, h: 190 },
            ].map((p) => (
              <div key={p.name} className="bg-white px-6 py-4 flex items-center justify-center">
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  className="object-contain"
                  style={{ height: 44, width: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
