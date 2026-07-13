import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import {
  HiHome,
  HiLightningBolt,
  HiSparkles,
  HiShieldCheck,
  HiLocationMarker,
  HiSearch,
  HiCreditCard,
} from "react-icons/hi";
import type { IconType } from "react-icons";

export const metadata: Metadata = {
  title: "PRIME DSPP — Doorstep Services at Your Door",
  description:
    "PRIME DSPP connects you with verified local professionals for home services — cleaning, carpentry, electrical, plumbing, and more. Book. Pay. Done.",
};

const categories: { Icon: IconType; label: string }[] = [
  { Icon: HiHome,          label: "Cleaning"              },
  { Icon: HiSparkles,      label: "Gardening & Landscaping" },
  { Icon: HiLightningBolt, label: "Electrician"           },
  { Icon: HiShieldCheck,   label: "Plumbing"              },
  { Icon: HiHome,          label: "Carpenter"             },
  { Icon: HiShieldCheck,   label: "Boutique & Tailor"     },
  { Icon: HiLightningBolt, label: "Welder"                },
  { Icon: HiSparkles,      label: "Instant Help"          },
];

const steps: { Icon: IconType; title: string; desc: string }[] = [
  {
    Icon: HiLocationMarker,
    title: "Set your location",
    desc: "Allow GPS or search your area to see verified professionals near you.",
  },
  {
    Icon: HiSearch,
    title: "Browse & choose",
    desc: "Explore categories, compare providers, read reviews — no account required.",
  },
  {
    Icon: HiCreditCard,
    title: "Book & pay securely",
    desc: "Confirm your booking and pay online. The professional arrives at your doorstep.",
  },
];

export default function PrimeDSPPPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="PRIME Initiative"
          title="PRIME DSPP"
          subtitle="Book all types of services at your doorstep — verified professionals, transparent pricing, right in Meghalaya."
        />

        {/* What is DSPP */}
        <section className="bg-white py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  About the Platform
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight mb-8" style={{ fontSize: "var(--text-heading)" }}>
                Professional home services, on demand
              </h2>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                PRIME DSPP is Meghalaya&apos;s first organised doorstep services platform — connecting households and businesses with skilled, verified local professionals across a wide range of trades and services.
              </p>
              <p className="text-black/50 leading-[1.8] mb-5" style={{ fontSize: "var(--text-body)" }}>
                Whether you need a plumber, an electrician, a cleaning crew, or a tailor, DSPP brings trusted professionals to your door — booked online, paid securely, with real-time tracking and customer reviews.
              </p>
              <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
                Launched under PRIME Meghalaya, the platform also creates formal livelihood opportunities for skilled tradespeople across the state — connecting them with a steady pipeline of verified customers.
              </p>
            </div>

            {/* Book Pay Done */}
            <div className="bg-[#0d2318] p-10 flex flex-col gap-10">
              <div>
                <p className="font-semibold tracking-[0.25em] uppercase text-white/30 mb-5" style={{ fontSize: "var(--text-label)" }}>
                  Doorstep services in minutes
                </p>
                <p className="font-black text-white leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  Book.&nbsp;<span className="text-white">Pay.</span>&nbsp;<span className="text-[#74C69D]">Done.</span>
                </p>
              </div>
              <div className="flex flex-col gap-8">
                {steps.map((s) => (
                  <div key={s.title} className="flex gap-5">
                    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-[#74C69D]/10 border border-[#74C69D]/20">
                      <span className="text-[#74C69D]"><s.Icon size={18} /></span>
                    </div>
                    <div>
                      <p className="font-black text-white mb-1" style={{ fontSize: "var(--text-sm)" }}>{s.title}</p>
                      <p className="text-white/40 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service categories */}
        <section className="bg-[#f5f5f5] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  What We Cover
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Services across every trade
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
              {categories.map((c) => (
                <div key={c.label} className="bg-white p-8 flex flex-col items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#74C69D]/15">
                    <span className="text-[#2D6A4F]"><c.Icon size={20} /></span>
                  </div>
                  <p className="font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{c.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-black/35 text-center" style={{ fontSize: "var(--text-sm)" }}>
              And many more — browse all categories on the DSPP platform.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1B4332] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#74C69D]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                  Book Now
                </p>
              </div>
              <h2 className="font-black text-white leading-[0.9] tracking-tight mb-6" style={{ fontSize: "var(--text-heading)" }}>
                Need a service<br />at your doorstep?
              </h2>
              <p className="text-white/40 leading-[1.75] max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
                Visit the PRIME DSPP platform to browse available professionals in your area, check reviews, and book your service in minutes.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="https://primedspp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#74C69D] text-[#1B4332] font-black hover:bg-white transition-colors duration-300"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Open PRIME DSPP →
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
