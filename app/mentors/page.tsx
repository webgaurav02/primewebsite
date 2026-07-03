import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import RegistrationForm from "@/components/ui/RegistrationForm";
import {
  HiAcademicCap,
  HiBriefcase,
  HiLightBulb,
  HiGlobe,
  HiTrendingUp,
  HiCurrencyRupee,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Mentors — PRIME Meghalaya",
  description:
    "Meet the mentors behind PRIME — experienced founders, investors, and domain experts guiding Meghalaya's next generation of entrepreneurs.",
};

const domains: { Icon: IconType; title: string; desc: string }[] = [
  { Icon: HiTrendingUp,    title: "Business Strategy",     desc: "Growth planning, market positioning, and competitive strategy for early and growth-stage startups." },
  { Icon: HiCurrencyRupee, title: "Finance & Fundraising", desc: "Access to capital, investor readiness, financial modelling, and grant application support." },
  { Icon: HiGlobe,         title: "Market Linkage",        desc: "Connections to national buyers, ONDC onboarding, trade shows, and B2B distribution networks." },
  { Icon: HiLightBulb,     title: "Product & Innovation",  desc: "Product development, design thinking, IP strategy, and technology adoption guidance." },
  { Icon: HiBriefcase,     title: "Operations & Legal",    desc: "Business registration, compliance, HR, contracts, and day-to-day operational excellence." },
  { Icon: HiAcademicCap,   title: "Sector Specialists",    desc: "Deep expertise across agriculture, tourism, wellness, manufacturing, and the creative economy." },
];

const steps = [
  { num: "01", title: "Express Interest",  desc: "Fill out the mentor interest form with your background, domain expertise, and availability." },
  { num: "02", title: "Profile Review",    desc: "The PRIME team reviews your profile and matches you with founders in your domain." },
  { num: "03", title: "Onboarding",        desc: "A brief orientation to the PRIME ecosystem, our cohort structure, and mentorship expectations." },
  { num: "04", title: "Mentorship Begins", desc: "Engage with founders through scheduled sessions, workshops, and ad-hoc advisory." },
];

export default function MentorsPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="Our Network"
          title="Mentors"
          subtitle="Experienced founders, investors, and domain experts guiding Meghalaya's next generation of entrepreneurs through the PRIME ecosystem."
        />

        {/* What mentors do */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  About the Programme
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight mb-8" style={{ fontSize: "var(--text-heading)" }}>
                Practical guidance from those who have been there
              </h2>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                PRIME mentors are practitioners — founders who have built companies, investors who have backed them, and specialists who have solved the exact problems our entrepreneurs are facing. They work directly with startups and entrepreneurs across all PRIME programmes.
              </p>
              <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                Mentorship at PRIME is structured but flexible — ranging from dedicated cohort mentor roles with incubation batches, to open advisory for any registered entrepreneur in the ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
              {domains.map((d) => (
                <HoverCard key={d.title} className="p-6">
                  <span className="text-[#2D6A4F] mb-4 block"><d.Icon size={22} /></span>
                  <h3 className="font-bold text-black mb-2" style={{ fontSize: "var(--text-sm)" }}>{d.title}</h3>
                  <p className="text-black/40 leading-relaxed" style={{ fontSize: "var(--text-label)", lineHeight: "1.7" }}>{d.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* How to join */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Join the Network
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Become a PRIME Mentor
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
              {steps.map((s) => (
                <HoverCard key={s.num} className="p-8">
                  <p className="font-black text-[#2D6A4F] mb-4" style={{ fontSize: "var(--text-label)", letterSpacing: "0.1em" }}>{s.num}</p>
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{s.title}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{s.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="bg-white texture-grid py-24 md:py-36 border-t border-black/[0.06]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <RegistrationForm
              title="Become a PRIME Mentor"
              subtitle="Fill in your details and the PRIME team will reach out within 5 working days to discuss how you can contribute to Meghalaya's entrepreneurship ecosystem."
              submitLabel="Submit Mentor Application"
              fields={[
                { id: "name",     label: "Full Name",        type: "text",     placeholder: "Your full name",          required: true  },
                { id: "email",    label: "Email Address",    type: "email",    placeholder: "you@example.com",          required: true  },
                { id: "phone",    label: "Phone Number",     type: "tel",      placeholder: "+91 XXXXX XXXXX"                           },
                { id: "linkedin", label: "LinkedIn Profile", type: "text",     placeholder: "linkedin.com/in/yourname"                  },
                { id: "domain",   label: "Primary Domain",   type: "select",   required: true, options: ["Business Strategy", "Finance & Fundraising", "Market Linkage", "Product & Innovation", "Operations & Legal", "Agriculture & Rural", "Tourism & Hospitality", "Technology", "Other"] },
                { id: "exp",      label: "Years of Experience", type: "select", required: true, options: ["1–3 years", "4–7 years", "8–15 years", "15+ years"] },
                { id: "org",      label: "Current Organisation", type: "text", placeholder: "Company / Institution"                     },
                { id: "avail",    label: "Availability",     type: "select",   options: ["1–2 hours/month", "3–5 hours/month", "6–10 hours/month", "More than 10 hours/month"] },
                { id: "bio",      label: "Brief Bio & Motivation", type: "textarea", placeholder: "Tell us about your background and why you want to mentor PRIME entrepreneurs…", required: true, span: "full" },
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
                Get Involved
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              Share your expertise. Shape Meghalaya.
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              We are always looking for experienced professionals who want to give back. If you have built something, invested in something, or solved problems at scale — our entrepreneurs need you.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Express Interest →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
