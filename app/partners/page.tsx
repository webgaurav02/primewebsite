import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Image from "next/image";
import RegistrationForm from "@/components/ui/RegistrationForm";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Partners — PRIME Meghalaya",
  description:
    "PRIME's institutional partners and ecosystem allies — knowledge partners, implementation partners, and ecosystem enablers powering Meghalaya's entrepreneurship mission.",
};

const partners = [
  {
    name: "Meghalaya Institute of Entrepreneurship",
    logo: "/assets/partners/mie.png",
    w: 168, h: 190,
    type: "Implementation Partner",
    desc: "MIE supports PRIME in delivering incubation, training, and entrepreneurship development programmes across the state.",
    href: "https://mie.gov.in/",
  },
  {
    name: "MBMA",
    logo: "/assets/partners/mbma.png",
    w: 445, h: 155,
    type: "Implementation Partner",
    desc: "The Meghalaya Basin Management Agency supports grassroots programme delivery and rural enterprise development.",
    href: "https://mbma.org.in/",
  },
  {
    name: "IIM Calcutta Innovation Park",
    logo: "/assets/partners/iim-calcutta.png",
    w: 350, h: 381,
    type: "Knowledge Partner",
    desc: "IIMCIP provides academic rigour, curriculum design, mentorship access, and certification for PRIME's flagship incubation programme.",
    href: "https://iimcip.org/",
  },
  {
    name: "Startup India",
    logo: "/assets/partners/startup-india.png",
    w: 541, h: 140,
    type: "Ecosystem Partner",
    desc: "Startup India connects PRIME's entrepreneurs to the national startup ecosystem, recognition schemes, and pan-India networks.",
    href: "https://www.startupindia.gov.in/",
  },
];

const partnerTypes = [
  { label: "Implementation Partners", desc: "Organisations that co-deliver PRIME programmes on the ground across Meghalaya's districts and blocks." },
  { label: "Knowledge Partners",      desc: "Academic and research institutions that bring curriculum, certification, and intellectual depth to PRIME programmes." },
  { label: "Ecosystem Partners",      desc: "National and international bodies that connect PRIME entrepreneurs to wider networks, markets, and recognition." },
  { label: "Funding Partners",        desc: "Development finance institutions and grant bodies that back PRIME's mission through project funding and capital." },
];

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="Our Network"
          title="Partners"
          subtitle="Institutional allies and ecosystem enablers that help PRIME deliver on its mission across Meghalaya and beyond."
        />

        {/* Partner types */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Partnership Types
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                How we partner
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
              {partnerTypes.map((p) => (
                <HoverCard key={p.label} className="p-8">
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{p.label}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Current partners */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Current Partners
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Our partner network
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
              {partners.map((p) => (
                <HoverCard key={p.name} as="a" href={p.href} target="_blank" rel="noopener noreferrer" className="p-8 md:p-10 flex flex-col gap-6">
                  <div className="h-14 flex items-center">
                    <Image
                      src={p.logo}
                      alt={p.name}
                      width={p.w}
                      height={p.h}
                      className="grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 object-contain"
                      style={{ height: "clamp(32px, 4vw, 48px)", width: "auto", maxWidth: "160px" }}
                    />
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-[0.15em] text-[#2D6A4F] mb-2" style={{ fontSize: "var(--text-label)" }}>{p.type}</p>
                    <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{p.name}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
                  </div>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership in action */}
        <section className="bg-[#f5f5f5] pb-24 md:pb-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="aspect-[4/3] overflow-hidden">
                <Image src="/assets/partnership-1.jpg" alt="PRIME international partnership meeting" width={600} height={450} quality={90} className="w-full h-full object-cover object-top" />
              </div>
              <div className="aspect-[4/3] overflow-hidden">
                <Image src="/assets/partnership-mou.jpg" alt="PRIME MoU signing ceremony" width={600} height={450} quality={90} className="w-full h-full object-cover object-top" />
              </div>
              <div className="aspect-[4/3] overflow-hidden">
                <Image src="/assets/photo42.jpg" alt="PRIME at International Purple Fest Goa 2025" width={600} height={450} quality={90} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="bg-white texture-grid py-24 md:py-36 border-t border-black/[0.06]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <RegistrationForm
              title="Partner with PRIME"
              subtitle="Tell us about your organisation and how you'd like to work with PRIME. We'll follow up within 5 working days."
              submitLabel="Submit Partner Application"
              fields={[
                { id: "org",      label: "Organisation Name",   type: "text",   placeholder: "Your organisation",        required: true  },
                { id: "type",     label: "Organisation Type",   type: "select", required: true, options: ["Government Body", "Academic / Research Institution", "Corporate / Private Sector", "NGO / Non-Profit", "International Development Organisation", "Other"] },
                { id: "name",     label: "Contact Person",      type: "text",   placeholder: "Full name",                required: true  },
                { id: "email",    label: "Email Address",       type: "email",  placeholder: "you@organisation.com",     required: true  },
                { id: "phone",    label: "Phone Number",        type: "tel",    placeholder: "+91 XXXXX XXXXX"                           },
                { id: "website",  label: "Website",             type: "text",   placeholder: "https://yourorg.com"                       },
                { id: "interest", label: "Partnership Interest",type: "select", required: true, options: ["Implementation Partner", "Knowledge Partner", "Ecosystem Partner", "Funding Partner", "Other"] },
                { id: "message",  label: "How would you like to partner?", type: "textarea", placeholder: "Describe the nature of your proposed collaboration…", required: true, span: "full" },
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
                Partner With Us
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              Build Meghalaya&apos;s entrepreneurship future, together.
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              Whether you are an institution, a corporate, or an international body — if your mission aligns with building entrepreneurs, we would like to hear from you.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Get in Touch →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
