import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import RegistrationForm from "@/components/ui/RegistrationForm";
import { HiCurrencyRupee, HiTrendingUp, HiGlobe, HiShieldCheck } from "react-icons/hi";
import type { IconType } from "react-icons";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Investors — PRIME Meghalaya",
  description:
    "Connect with high-potential startups from Meghalaya's growing entrepreneurship ecosystem. PRIME bridges investors with vetted, mission-driven founders.",
};

const reasons: { Icon: IconType; title: string; desc: string }[] = [
  { Icon: HiTrendingUp,    title: "High-Growth Pipeline",    desc: "Access to 1,350+ registered startups and a continuous pipeline from PRIME's incubation and CM Elevate programmes." },
  { Icon: HiCurrencyRupee, title: "Government Co-investment", desc: "Many PRIME startups already receive state-backed grants and subsidies — reducing early-stage risk for private investors." },
  { Icon: HiGlobe,         title: "Untapped Market",         desc: "Meghalaya's unique geography, demographics, and resource base create first-mover opportunities unavailable in saturated markets." },
  { Icon: HiShieldCheck,   title: "Vetted Founders",         desc: "Every PRIME entrepreneur goes through structured screening, mentorship, and programme milestones before investor introduction." },
];

const stages = [
  { label: "Pre-Seed",  desc: "Idea-stage founders completing PRIME incubation and seeking their first external capital." },
  { label: "Seed",      desc: "Post-revenue startups that have validated market demand and are ready to scale." },
  { label: "Series A",  desc: "Growth-stage businesses with proven unit economics seeking institutional investment." },
  { label: "Impact",    desc: "Agri, rural, and social-sector enterprises aligned with ESG and development finance mandates." },
];

export default function InvestorsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">

        <PageHero
          breadcrumb="Our Network"
          title="Investors"
          subtitle="Connect with high-potential startups emerging from Meghalaya's growing entrepreneurship ecosystem — vetted, mission-driven, and ready for capital."
        />

        {/* Why invest */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  The Opportunity
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Why invest in the PRIME ecosystem
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
              {reasons.map((r) => (
                <HoverCard key={r.title} className="p-8 md:p-10">
                  <span className="text-[#2D6A4F] mb-5 block"><r.Icon size={26} /></span>
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{r.title}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{r.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Investment stages */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Stages We Support
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Opportunities across every stage
              </h2>
            </div>
            <div className="border-t border-black/[0.08]">
              {stages.map((s, i) => (
                <div key={s.label} className="grid grid-cols-[56px_1fr] gap-6 py-6 border-b border-black/[0.08]">
                  <span className="font-black text-black/20" style={{ fontSize: "var(--text-sm)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>{s.label}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="bg-white texture-grid py-24 md:py-36 border-t border-black/[0.06]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <RegistrationForm
              title="Register as an Investor"
              subtitle="Share your investment profile and we'll connect you with curated deal flow from PRIME's portfolio of vetted entrepreneurs."
              submitLabel="Submit Investor Profile"
              fields={[
                { id: "name",     label: "Full Name / Organisation", type: "text",   placeholder: "Name or fund name",       required: true  },
                { id: "email",    label: "Email Address",            type: "email",  placeholder: "you@example.com",         required: true  },
                { id: "phone",    label: "Phone Number",             type: "tel",    placeholder: "+91 XXXXX XXXXX"                           },
                { id: "type",     label: "Investor Type",            type: "select", required: true, options: ["Angel Investor", "Venture Capital", "Family Office", "Development Finance Institution", "Corporate / CVC", "Other"] },
                { id: "stage",    label: "Preferred Stage",          type: "select", required: true, options: ["Pre-Seed", "Seed", "Series A", "Impact / ESG", "Any Stage"] },
                { id: "ticket",   label: "Typical Ticket Size",      type: "select", options: ["Under ₹10L", "₹10L – ₹50L", "₹50L – ₹2Cr", "₹2Cr – ₹10Cr", "Above ₹10Cr"] },
                { id: "sectors",  label: "Sectors of Interest",      type: "text",   placeholder: "e.g. Agri, Tourism, Tech, Rural"           },
                { id: "message",  label: "Additional Notes",         type: "textarea", placeholder: "Anything else you'd like us to know about your investment thesis…", span: "full" },
              ]}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                Connect
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              Back the next generation of Northeast founders.
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              Whether you are an angel, a VC, or a development finance institution — PRIME can connect you with curated deal flow from Meghalaya's most promising founders.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Register as an Investor →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
