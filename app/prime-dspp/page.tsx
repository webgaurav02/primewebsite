import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiLocationMarker, HiUserGroup, HiLightningBolt, HiCurrencyRupee, HiAcademicCap, HiTrendingUp } from "react-icons/hi";
import type { IconType } from "react-icons";

export const metadata: Metadata = {
  title: "PRIME DSPP — District Startup Promotion Programme",
  description:
    "PRIME DSPP brings entrepreneurship support directly to every district in Meghalaya — connecting grassroots founders with training, funding, and market access.",
};

const pillars: { Icon: IconType; title: string; desc: string }[] = [
  {
    Icon: HiLocationMarker,
    title: "District-Level Reach",
    desc: "DSPP embeds PRIME's support infrastructure into every district, ensuring entrepreneurs no longer have to travel to Shillong to access incubation, mentorship, or scheme applications.",
  },
  {
    Icon: HiUserGroup,
    title: "Community-Driven",
    desc: "Working with village headmen, community leaders, and district administrations to identify and onboard first-generation entrepreneurs who fall outside traditional startup pipelines.",
  },
  {
    Icon: HiLightningBolt,
    title: "Rapid Onboarding",
    desc: "Streamlined registration and verification at the district level — cutting bureaucratic delays so entrepreneurs can access PRIME schemes within days, not months.",
  },
  {
    Icon: HiCurrencyRupee,
    title: "Funding Access",
    desc: "District-based facilitation of CM-ELEVATE, IFAD GAP Funding, and other PRIME schemes — with local officers guiding applicants through the process end-to-end.",
  },
  {
    Icon: HiAcademicCap,
    title: "Localised Training",
    desc: "Capacity building programmes delivered in local languages and community settings — from business planning workshops to digital literacy and financial management.",
  },
  {
    Icon: HiTrendingUp,
    title: "Market Linkages",
    desc: "Connecting district-level entrepreneurs with PRIME's statewide buyer networks, trade shows, and e-commerce platforms to open real revenue channels.",
  },
];

const districts = [
  "East Khasi Hills", "West Khasi Hills", "South West Khasi Hills",
  "Ri Bhoi", "East Jaintia Hills", "West Jaintia Hills",
  "East Garo Hills", "West Garo Hills", "South Garo Hills",
  "North Garo Hills", "Eastern West Khasi Hills", "Mairang",
];

export default function PrimeDSPPPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="PRIME Initiative"
          title="PRIME DSPP"
          subtitle="District Startup Promotion Programme — taking PRIME's full support system to every corner of Meghalaya."
        />

        {/* What is DSPP */}
        <section className="bg-white py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  About the Programme
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight mb-8" style={{ fontSize: "var(--text-heading)" }}>
                Entrepreneurship support, brought to your district
              </h2>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                PRIME DSPP — the District Startup Promotion Programme — is PRIME&apos;s on-ground extension that decentralises entrepreneurship support across all 12 districts of Meghalaya. While PRIME Hubs in Shillong and Tura serve as the nerve centres, DSPP ensures that no aspiring entrepreneur is left out because of geography.
              </p>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                Through a dedicated district officer network, DSPP identifies high-potential micro and nano entrepreneurs, connects them with PRIME&apos;s funding schemes, and provides hands-on support through every step — from registration to scheme disbursement.
              </p>
              <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                The programme is built on the belief that Meghalaya&apos;s next generation of entrepreneurs is not just in its cities — it is in every village, every market, and every district of this remarkable state.
              </p>
            </div>

            {/* Districts covered */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Districts Covered
                </p>
              </div>
              <div className="border-t border-black/[0.08]">
                {districts.map((d, i) => (
                  <div key={d} className="flex items-center gap-5 py-4 border-b border-black/[0.08]">
                    <span className="font-black text-black/15 shrink-0" style={{ fontSize: "var(--text-label)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Six pillars */}
        <section className="bg-[#f5f5f5] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  How It Works
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Six pillars of district-level support
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
              {pillars.map((p) => (
                <div key={p.title} className="bg-white p-8 flex flex-col gap-5">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#74C69D]/20">
                    <span className="text-[#2D6A4F]"><p.Icon size={22} /></span>
                  </div>
                  <div>
                    <h3 className="font-black text-black mb-2" style={{ fontSize: "var(--text-body)" }}>{p.title}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — redirect to DSPP site */}
        <section className="bg-[#1B4332] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#74C69D]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                  Visit the Portal
                </p>
              </div>
              <h2 className="font-black text-white leading-[0.9] tracking-tight mb-6" style={{ fontSize: "var(--text-heading)" }}>
                Ready to register<br />
                with PRIME DSPP?
              </h2>
              <p className="text-white/40 leading-[1.75] max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
                Head to the PRIME DSPP portal to register your business, apply for district-level support, and connect with your nearest PRIME district officer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a
                href="https://primedspp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#74C69D] text-[#1B4332] font-black hover:bg-white transition-colors duration-300"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Go to PRIME DSPP →
              </a>
              <a
                href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/20 text-white/60 font-semibold hover:border-white/50 hover:text-white transition-all duration-300"
                style={{ fontSize: "var(--text-sm)" }}
              >
                PRIME Main Portal
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
