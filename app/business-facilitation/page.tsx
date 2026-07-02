import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import {
  HiBell,
  HiMap,
  HiAcademicCap,
  HiUsers,
  HiChat,
  HiBookOpen,
  HiBadgeCheck,
  HiCheckCircle,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const supports: { title: string; desc: string; Icon: IconType }[] = [
  { title: "Awareness Programs",               desc: "Informing entrepreneurs about available government schemes, financial aid, and PRIME initiatives — ensuring no opportunity goes unnoticed.", Icon: HiBell },
  { title: "Exposure Visits",                  desc: "Organising visits to industries and businesses to help entrepreneurs learn from real-world experiences and best practices.", Icon: HiMap },
  { title: "Technical Training",               desc: "Providing hands-on training to improve skills and enhance product and service quality across key sectors.", Icon: HiAcademicCap },
  { title: "Market Connections & Networking",  desc: "Helping businesses find buyers, build partnerships, and participate in exhibitions inside and outside the state.", Icon: HiUsers },
  { title: "Interactive Sessions",             desc: "Engaging directly with entrepreneurs to understand their unique challenges and offer targeted, actionable solutions.", Icon: HiChat },
  { title: "Training Opportunities",           desc: "Connecting entrepreneurs with expert trainers through MSSDS to improve their professional and technical skills.", Icon: HiBookOpen },
  { title: "Empanelment of Training Providers", desc: "Partnering with recognised training providers to expand skill development programmes for entrepreneurs across Meghalaya.", Icon: HiBadgeCheck },
];

const eomWinners = [
  { name: "Chisa's Home Bakes & Ice-Cream Hub", tagline: "A self-taught baker from Karkutta, North Garo Hills, who turned passion into a thriving local business — now employing five people and training women in baking." },
  { name: "Bakyrshan — Health Food Truck", tagline: "From selling juice off his bike in 2021 to running a fully equipped food truck by 2023 — Shillong's most inspiring health-focused food brand." },
  { name: "Oge. Chi Knots", tagline: "Co-founded with Darisha Synrem, blending craft, culture, and sustainability — eco-friendly bags, baskets, and home décor rooted in handmade artistry." },
  { name: "EZER Wine", tagline: "Started with ₹50,000, Probina grew EZER Wine from 2 flavours to 19 varieties — earning international acclaim while donating 5% of profits to charity." },
];

const prize = [
  "Cash prize of ₹50,000",
  "Feature on PRIME Meghalaya's website and social media",
  "Media coverage and promotional opportunities",
  "Networking access to PRIME's ecosystem",
];

const eligibility = [
  "Open to entrepreneurs operating in Meghalaya across all sectors",
  "Must be a resident of Meghalaya aged 18 or above",
  "Must not be a government employee",
  "Registered or unregistered entity accepted",
];

export default function BusinessFacilitationPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Sector"
        title="Business Facilitation"
        subtitle="Connecting entrepreneurs with the resources, guidance, and opportunities they need to build and grow sustainable businesses in Meghalaya."
      />

      {/* Intro */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                What We Do
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Complete guidance for business success
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              The Business Facilitation sector helps entrepreneurs gain the right support to grow their businesses. It connects them with resources, mentors, and opportunities while working with different government departments and MBMA block staff to ensure they receive the help they need.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              From trainings to market access, PRIME&apos;s Business Facilitation team provides end-to-end guidance — meeting entrepreneurs where they are and taking them where they need to go.
            </p>
          </div>
          <div className="border-t border-black/[0.08]">
            {supports.map((s) => (
              <div key={s.title} className="flex items-start gap-4 py-5 border-b border-black/[0.08]">
                <div className="w-9 h-9 flex items-center justify-center bg-[#74C69D]/20 shrink-0 mt-0.5">
                  <span className="text-[#2D6A4F]"><s.Icon size={18} /></span>
                </div>
                <div>
                  <p className="font-bold text-black mb-1" style={{ fontSize: "var(--text-body)" }}>{s.title}</p>
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured image */}
      <section className="bg-white texture-grid">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 md:pb-36">
          <ImagePlaceholder label="Business Facilitation in Action" className="w-full aspect-[16/7]" />
        </div>
      </section>

      {/* Entrepreneur of the Month */}
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Recognition
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Entrepreneur of the Month
            </h2>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              PRIME&apos;s newest initiative to celebrate and reward the state&apos;s most inspiring entrepreneurial stories. Every month, one outstanding entrepreneur whose journey reflects innovation, resilience, and the spirit of Meghalaya&apos;s growing startup ecosystem is spotlighted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07] mb-12">
            {eomWinners.map((w) => (
              <div key={w.name} className="bg-white p-8 hover:bg-[#f5f5f5] transition-colors">
                <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{w.name}</h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{w.tagline}</p>
              </div>
            ))}
          </div>

          {/* Prize + Eligibility */}
          <div className="bg-[#1B4332] p-8 md:p-12 grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                  The Prize
                </p>
              </div>
              <div className="border-t border-white/[0.06]">
                {prize.map((p, i) => (
                  <div key={i} className="flex items-start gap-4 py-4 border-b border-white/[0.06]">
                    <HiCheckCircle className="text-[#74C69D] shrink-0 mt-0.5" size={18} />
                    <p className="text-white/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                  Eligibility
                </p>
              </div>
              <div className="border-t border-white/[0.06]">
                {eligibility.map((e, i) => (
                  <div key={i} className="flex items-start gap-4 py-4 border-b border-white/[0.06]">
                    <HiCheckCircle className="text-[#74C69D] shrink-0 mt-0.5" size={18} />
                    <p className="text-white/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{e}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white texture-grid py-24 md:py-36 border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
              Get Support
            </p>
          </div>
          <h2
            className="font-black text-black leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Need business support?
          </h2>
          <p className="text-black/50 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Visit or contact your nearest PRIME Hub. Our Business Facilitation team is ready to connect you with the right resources.
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
