import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const grants = [
  { label: "Top 35 entrepreneurs", amount: "₹2 Lakhs", desc: "Business Support Grant each" },
  { label: "Next 40 entrepreneurs", amount: "₹1 Lakh", desc: "Business Support Grant each" },
  { label: "Remaining 75 (Top 150)", amount: "Pre-Incubation", desc: "Transition to the pre-incubation programme" },
];

const benefits = [
  "Exclusive networking opportunities with industry professionals",
  "Intensive mentoring and access to marketing, legal, branding & accounting services",
  "Market access to expand your customer base",
  "Free co-working spaces in Shillong and Tura (subject to availability)",
  "Media visibility to raise the profile of your business",
  "Diverse funding sources — grants, loans, and venture capital",
  "Certificate of Excellence from the Government of Meghalaya & IIM Calcutta Innovation Park",
];

const objectives = [
  "Promote the spirit of entrepreneurship and enterprise ecosystem in Meghalaya",
  "Identify promising business ideas through a fair, transparent and rigorous selection process",
  "Encourage and support people to avail growing entrepreneurship opportunities",
  "Provide a state-wide platform for entrepreneurial thinking and ambition",
  "Highlight and showcase existing and emerging entrepreneurs",
  "Provide recognition, rewards and a range of support mechanisms for maturing business ideas",
];

export default function IncubationPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Sector"
        title="Incubation & Acceleration"
        subtitle="From idea to impact — PRIME's incubation programme is designed to turn Meghalaya's most promising startups into thriving, scalable businesses."
      />

      {/* Intro */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The Programme</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
              Chief Minister&apos;s E-Championship Challenge
            </h2>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              Now in its <strong className="text-[#111111]">sixth edition</strong>, the CM&apos;s E-Championship Challenge is the flagship initiative behind PRIME — a state-wide, recurring annual event where Meghalaya&apos;s most promising entrepreneurs pitch in front of industry experts, government officials, and academic leaders.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
              A cohort of <strong className="text-[#111111]">75 entrepreneurs</strong> is selected to join a dedicated <strong className="text-[#111111]">9-month intensive incubation programme</strong>, receiving structured support to launch, grow, and become funding-ready.
            </p>
            <p className="text-[13px] text-gray-600 leading-[1.8]">
              The Acceleration programme takes it further — fast-tracked mentorship, market access, and strategic assistance to help businesses compete at the next level.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded overflow-hidden">
            <Image
              src="/assets/images/incubation.jpg"
              alt="PRIME Incubation Programme"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Grants */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Financial Support</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Business Support Grants
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {grants.map((g) => (
              <div key={g.label} className="bg-white border border-gray-100 rounded p-7 hover:border-[#9EC84A]/40 transition-colors">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">{g.label}</p>
                <p className="text-[36px] font-black text-[#9EC84A] leading-none mb-2">{g.amount}</p>
                <p className="text-[12px] text-gray-500">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">What You Get</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-8">
              Benefits of the programme
            </h2>
            <ul className="flex flex-col gap-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#9EC84A]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#9EC84A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Programme Goals</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-8">
              Objectives of the challenge
            </h2>
            <ul className="flex flex-col gap-3">
              {objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-gray-600 leading-relaxed">
                  <span className="text-[#9EC84A] font-black text-xs mt-1">{String(i + 1).padStart(2, "0")}</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[40px] font-black text-white mb-4">
            Ready to apply?
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Register on the PRIME portal and take the first step towards joining Meghalaya&apos;s most ambitious cohort of entrepreneurs.
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
