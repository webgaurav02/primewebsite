import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import {
  HiFlag,
  HiShoppingBag,
  HiUsers,
  HiGlobe,
  HiClipboardList,
  HiGlobeAlt,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const channels: { title: string; desc: string; Icon: IconType }[] = [
  { title: "Trade Fairs & Exhibitions", desc: "PRIME entrepreneurs participate in state, national, and international exhibitions to showcase products and directly access buyers — from the North East Woolen Expo to IITF.", Icon: HiFlag },
  { title: "E-Commerce Onboarding",    desc: "PRIME helps entrepreneurs list their products on platforms like ONDC, Amazon, and Flipkart through partnerships, workshops, and hands-on onboarding support.", Icon: HiShoppingBag },
  { title: "B2B Buyer Connections",    desc: "PRIME actively facilitates introductions between entrepreneurs and institutional buyers — hotels, retail chains, government procurement, and corporate clients.", Icon: HiUsers },
  { title: "Act East Business Shows",  desc: "PRIME entrepreneurs showcase products at regional forums, connecting Meghalaya's businesses with markets across South-East Asia and North East India.", Icon: HiGlobe },
  { title: "PRIME Product Catalogue",  desc: "A curated catalogue of PRIME-verified products makes it easy for bulk buyers, retailers, and platforms to discover and source from Meghalaya's entrepreneurs.", Icon: HiClipboardList },
  { title: "Cross-Border Linkages",    desc: "Strategic MoUs with buyers and institutions within and outside Meghalaya open new distribution channels for startups ready to scale beyond the state.", Icon: HiGlobeAlt },
];

const stats = [
  { value: "7th", label: "Act East Business Show" },
  { value: "IITF", label: "2025 participation" },
  { value: "16+", label: "Startups on ONDC" },
  { value: "Multi-state", label: "Exhibition reach" },
];

const events = [
  { title: "IITF 2025", loc: "New Delhi", desc: "Meghalaya entrepreneurs showcased culture, crafts, and commerce at India International Trade Fair, India's largest trade exhibition." },
  { title: "North East Woolen Expo 2024", loc: "Guwahati", desc: "PRIME entrepreneurs showcased handcrafted woolens and textiles to buyers from across the North East and beyond." },
  { title: "Tamil Nadu Global Startup Summit 2025", loc: "Chennai", desc: "PRIME represented Meghalaya's innovation ecosystem at one of India's premier startup summits." },
];

export default function MarketLinkagePage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Sector"
        title="Market Linkage"
        subtitle="PRIME connects Meghalaya's entrepreneurs with buyers, platforms, and markets — local, national, and international."
      />

      {/* Intro */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
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
              Great products need great markets
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              One of the biggest barriers for entrepreneurs in Meghalaya is market access. Building a strong demand-side network is at the core of PRIME&apos;s model — ensuring entrepreneurs can not only build great products, but actually sell them.
            </p>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              PRIME builds strong demand-side networks that support entrepreneurs while enabling them to recognise and serve local demand. Geography and sector-specific value chain support runs through everything we do.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              From placing Meghalaya&apos;s entrepreneurs at national trade fairs to onboarding startups onto e-commerce platforms, PRIME actively opens doors that would otherwise remain closed.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/assets/images/event-1.jpg"
              alt="PRIME Market Linkage"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#1B4332] texture-hatch border-t border-b border-white/[0.08] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#1B4332] px-6 py-10 md:px-10 md:py-14 text-center flex flex-col items-center gap-3">
                <p
                  className="font-black text-[#74C69D] leading-none"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  {s.value}
                </p>
                <p className="text-white/40 leading-snug" style={{ fontSize: "var(--text-sm)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                How We Help
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Market access channels for PRIME entrepreneurs
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {channels.map((c) => (
              <div key={c.title} className="bg-white p-8 group hover:bg-[#f5f5f5] transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-[#74C69D]/20 mb-6">
                  <span className="text-[#2D6A4F]"><c.Icon size={24} /></span>
                </div>
                <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>
                  {c.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Recent Activity
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Where PRIME entrepreneurs have been
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {events.map((e) => (
              <div key={e.title} className="bg-white p-8 hover:bg-[#f5f5f5] transition-colors">
                <p className="font-bold text-[#2D6A4F] uppercase tracking-widest mb-3" style={{ fontSize: "var(--text-label)" }}>
                  {e.loc}
                </p>
                <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>
                  {e.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {e.desc}
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
              Get Started
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Ready to find your market?
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Register on the PRIME portal and our team will help connect your business to the right buyers, platforms, and events.
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
