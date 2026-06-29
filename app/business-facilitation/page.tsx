import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const supports = [
  { title: "Awareness Programs", desc: "Informing entrepreneurs about available government schemes, financial aid, and PRIME initiatives — ensuring no opportunity goes unnoticed." },
  { title: "Exposure Visits", desc: "Organising visits to industries and businesses to help entrepreneurs learn from real-world experiences and best practices." },
  { title: "Technical Training", desc: "Providing hands-on training to improve skills and enhance product and service quality across key sectors." },
  { title: "Market Connections & Networking", desc: "Helping businesses find buyers, build partnerships, and participate in exhibitions inside and outside the state." },
  { title: "Interactive Sessions", desc: "Engaging directly with entrepreneurs to understand their unique challenges and offer targeted, actionable solutions." },
  { title: "Training Opportunities", desc: "Connecting entrepreneurs with expert trainers through MSSDS to improve their professional and technical skills." },
  { title: "Empanelment of Training Providers", desc: "Partnering with recognised training providers to expand skill development programmes for entrepreneurs across Meghalaya." },
];

const eomWinners = [
  { name: "Chisa's Home Bakes & Ice-Cream Hub", tagline: "A self-taught baker from Karkutta, North Garo Hills, who turned passion into a thriving local business — now employing five people and training women in baking." },
  { name: "Bakyrshan — Health Food Truck", tagline: "From selling juice off his bike in 2021 to running a fully equipped food truck by 2023 — Shillong's most inspiring health-focused food brand." },
  { name: "Oge. Chi Knots", tagline: "Co-founded with Darisha Synrem, blending craft, culture, and sustainability — eco-friendly bags, baskets, and home décor rooted in handmade artistry." },
  { name: "EZER Wine", tagline: "Started with ₹50,000, Probina grew EZER Wine from 2 flavours to 19 varieties — earning international acclaim while donating 5% of profits to charity." },
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">What We Do</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
              Complete guidance for business success
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              The Business Facilitation sector helps entrepreneurs gain the right support to grow their businesses. It connects them with resources, mentors, and opportunities while working with different government departments and MBMA block staff to ensure they receive the help they need.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8]">
              From trainings to market access, PRIME&apos;s Business Facilitation team provides end-to-end guidance — meeting entrepreneurs where they are and taking them where they need to go.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {supports.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded border border-gray-100 hover:border-[#9EC84A]/30 transition-colors">
                <span className="text-[#9EC84A] font-black text-xs mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[13px] font-bold text-[#111111] mb-0.5">{s.title}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entrepreneur of the Month */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-4">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Recognition</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-3">
              Entrepreneur of the Month
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8]">
              PRIME&apos;s newest initiative to celebrate and reward the state&apos;s most inspiring entrepreneurial stories. Every month, one outstanding entrepreneur whose journey reflects innovation, resilience, and the spirit of Meghalaya&apos;s growing startup ecosystem is spotlighted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-10">
            {eomWinners.map((w) => (
              <div key={w.name} className="bg-white border border-gray-100 rounded p-6 hover:border-[#9EC84A]/40 transition-colors">
                <h3 className="text-[14px] font-bold text-[#111111] mb-2">{w.name}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{w.tagline}</p>
              </div>
            ))}
          </div>

          {/* Prize info */}
          <div className="mt-12 bg-[#0d0d0d] rounded p-8 grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The Prize</p>
              <ul className="flex flex-col gap-2">
                {[
                  "Cash prize of ₹50,000",
                  "Feature on PRIME Meghalaya's website and social media",
                  "Media coverage and promotional opportunities",
                  "Networking access to PRIME's ecosystem",
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12px] text-gray-300">
                    <span className="w-4 h-4 rounded-full bg-[#9EC84A]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="#9EC84A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Eligibility</p>
              <ul className="flex flex-col gap-2">
                {[
                  "Open to entrepreneurs operating in Meghalaya across all sectors",
                  "Must be a resident of Meghalaya aged 18 or above",
                  "Must not be a government employee",
                  "Registered or unregistered entity accepted",
                ].map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12px] text-gray-300">
                    <span className="text-[#9EC84A] font-black text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-[#111111] mb-4">Need business support?</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Visit or contact your nearest PRIME Hub. Our Business Facilitation team is ready to connect you with the right resources.
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
