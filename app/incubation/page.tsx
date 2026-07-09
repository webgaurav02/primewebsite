import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiCheckCircle } from "react-icons/hi";

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
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                The Programme
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Chief Minister&apos;s E-Championship Challenge
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              Now in its <strong className="text-black">sixth edition</strong>, the CM&apos;s E-Championship Challenge is the flagship initiative behind PRIME — a state-wide, recurring annual event where Meghalaya&apos;s most promising entrepreneurs pitch in front of industry experts, government officials, and academic leaders.
            </p>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              A cohort of <strong className="text-black">75 entrepreneurs</strong> is selected to join a dedicated <strong className="text-black">9-month intensive incubation programme</strong>, receiving structured support to launch, grow, and become funding-ready.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              The Acceleration programme takes it further — fast-tracked mentorship, market access, and strategic assistance to help businesses compete at the next level.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
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
      <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Financial Support
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Business Support Grants
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {grants.map((g) => (
              <div key={g.label} className="bg-white p-8 flex flex-col">
                <p className="text-black/35 font-semibold uppercase tracking-wide mb-4" style={{ fontSize: "var(--text-label)" }}>
                  {g.label}
                </p>
                <p className="font-black text-[#2D6A4F] leading-[0.9] mb-4" style={{ fontSize: "var(--text-heading)" }}>
                  {g.amount}
                </p>
                <p className="text-black/50 mt-auto" style={{ fontSize: "var(--text-sm)" }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Award ceremony image */}
      <section className="bg-[#f5f5f5] pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="w-full aspect-[16/7] overflow-hidden">
            <Image src="/assets/dsc00880.jpg" alt="PRIME Entrepreneur of the Month award ceremony" width={1400} height={612} quality={90} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </section>

      {/* Benefits + Objectives */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                What You Get
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-10"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Benefits of the programme
            </h2>
            <div className="border-t border-black/[0.08]">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-black/[0.08]">
                  <HiCheckCircle className="text-[#2D6A4F] shrink-0 mt-0.5" size={20} />
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Programme Goals
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-10"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Objectives of the challenge
            </h2>
            <div className="border-t border-black/[0.08]">
              {objectives.map((o, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-black/[0.08]">
                  <HiCheckCircle className="text-[#2D6A4F] shrink-0 mt-0.5" size={20} />
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>{o}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
              Apply Now
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Ready to apply?
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Register on the PRIME portal and take the first step towards joining Meghalaya&apos;s most ambitious cohort of entrepreneurs.
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
