import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const channels = [
  { title: "Trade Fairs & Exhibitions", desc: "PRIME entrepreneurs participate in state, national, and international exhibitions to showcase products and directly access buyers — from the North East Woolen Expo to IITF." },
  { title: "E-Commerce Onboarding", desc: "PRIME helps entrepreneurs list their products on platforms like ONDC, Amazon, and Flipkart through partnerships, workshops, and hands-on onboarding support." },
  { title: "B2B Buyer Connections", desc: "PRIME actively facilitates introductions between entrepreneurs and institutional buyers — hotels, retail chains, government procurement, and corporate clients." },
  { title: "Act East Business Shows", desc: "PRIME entrepreneurs showcase products at regional forums, connecting Meghalaya's businesses with markets across South-East Asia and North East India." },
  { title: "PRIME Product Catalogue", desc: "A curated catalogue of PRIME-verified products makes it easy for bulk buyers, retailers, and platforms to discover and source from Meghalaya's entrepreneurs." },
  { title: "Cross-Border Linkages", desc: "Strategic MoUs with buyers and institutions within and outside Meghalaya open new distribution channels for startups ready to scale beyond the state." },
];

const stats = [
  { value: "7th", label: "Act East Business Show" },
  { value: "IITF", label: "2025 participation" },
  { value: "16+", label: "Startups on ONDC" },
  { value: "Multi-state", label: "Exhibition reach" },
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The Challenge</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
              Great products need great markets
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              One of the biggest barriers for entrepreneurs in Meghalaya is market access. Building a strong demand-side network is at the core of PRIME's model — ensuring entrepreneurs can not only build great products, but actually sell them.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              PRIME builds strong demand-side networks that support entrepreneurs while enabling them to recognise and serve local demand. Geography and sector-specific value chain support runs through everything we do.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8]">
              From placing Meghalaya&apos;s entrepreneurs at national trade fairs to onboarding startups onto e-commerce platforms, PRIME actively opens doors that would otherwise remain closed.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded overflow-hidden">
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
      <section className="bg-[#0d0d0d] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[#9EC84A] text-[32px] font-black leading-none mb-1">{s.value}</p>
              <p className="text-gray-400 text-[12px]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">How We Help</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Market access channels for PRIME entrepreneurs
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {channels.map((c, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-6 hover:border-[#9EC84A]/40 transition-colors group">
                <div className="w-7 h-7 rounded-full bg-[#9EC84A]/10 flex items-center justify-center mb-4 group-hover:bg-[#9EC84A]/20 transition-colors">
                  <span className="text-[#9EC84A] font-black text-xs">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[#111111] mb-2">{c.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Recent Activity</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Where PRIME entrepreneurs have been
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "IITF 2025", loc: "New Delhi", desc: "Meghalaya entrepreneurs showcased culture, crafts, and commerce at India International Trade Fair, India's largest trade exhibition." },
              { title: "North East Woolen Expo 2024", loc: "Guwahati", desc: "PRIME entrepreneurs showcased handcrafted woolens and textiles to buyers from across the North East and beyond." },
              { title: "Tamil Nadu Global Startup Summit 2025", loc: "Chennai", desc: "PRIME represented Meghalaya's innovation ecosystem at one of India's premier startup summits." },
            ].map((e) => (
              <div key={e.title} className="border border-gray-100 rounded p-6 hover:border-[#9EC84A]/30 transition-colors">
                <p className="text-[10px] text-[#9EC84A] font-bold uppercase tracking-widest mb-2">{e.loc}</p>
                <h3 className="text-[14px] font-bold text-[#111111] mb-2">{e.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[40px] font-black text-white mb-4">Ready to find your market?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Register on the PRIME portal and our team will help connect your business to the right buyers, platforms, and events.
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
