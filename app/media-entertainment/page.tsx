import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiSpeakerphone, HiFilm, HiPhotograph, HiMicrophone, HiDesktopComputer, HiNewspaper } from "react-icons/hi";
import type { IconType } from "react-icons";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Media & Entertainment — PRIME Meghalaya",
  description:
    "PRIME's Media & Entertainment sector supports outreach, storytelling, and communications — amplifying the PRIME ecosystem and its founders across Meghalaya and beyond.",
};

const focus: { Icon: IconType; title: string; desc: string }[] = [
  { Icon: HiFilm,           title: "Film & Cinema",         desc: "Supporting cinema theatre development and film production enterprises that promote Meghalaya's creative economy." },
  { Icon: HiSpeakerphone,   title: "Outreach & Campaigns",  desc: "State-wide communications campaigns promoting entrepreneurship, PRIME programmes, and success stories." },
  { Icon: HiMicrophone,     title: "Media Entrepreneurship",desc: "Supporting media startups — podcasts, digital content studios, community radio, and journalism ventures." },
  { Icon: HiPhotograph,     title: "Creative Content",      desc: "Photography, design, and visual content enterprises serving Meghalaya's tourism, government, and commercial sectors." },
  { Icon: HiDesktopComputer,title: "Digital & Social Media",desc: "Digital media operations, social content, and PRIME's online presence across platforms." },
  { Icon: HiNewspaper,      title: "PR & Storytelling",     desc: "Press relations, founder stories, impact documentation, and ecosystem narrative for PRIME's public profile." },
];

const initiatives = [
  { num: "01", title: "Founder Stories",      desc: "Documentary and editorial features highlighting entrepreneurs from across Meghalaya's 12 districts." },
  { num: "02", title: "PRIME Media Lab",       desc: "A dedicated content and communications unit producing campaign material, reports, and programme collateral." },
  { num: "03", title: "M&E Startup Support",   desc: "Tailored incubation and funding linkages for media and entertainment startups registered under PRIME." },
  { num: "04", title: "Cinema Theatre Scheme", desc: "CM Elevate support for establishment of cinema theatres — promoting culture and the creative economy." },
];

export default function MediaEntertainmentPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="Sectors of PRIME"
          title="Media & Entertainment"
          subtitle="Amplifying the PRIME ecosystem through storytelling, outreach, and a thriving creative sector — while supporting Meghalaya's media and entertainment entrepreneurs."
        />

        {/* Focus areas */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  What We Cover
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                The full spectrum of media & entertainment
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
              {focus.map((f) => (
                <HoverCard key={f.title} className="p-8">
                  <span className="text-[#2D6A4F] mb-5 block"><f.Icon size={24} /></span>
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{f.title}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{f.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Key initiatives */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Initiatives
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Key programmes & projects
              </h2>
            </div>
            <div className="border-t border-black/[0.08]">
              {initiatives.map((item) => (
                <div key={item.num} className="grid grid-cols-[56px_1fr] gap-6 py-6 border-b border-black/[0.08]">
                  <span className="font-black text-[#2D6A4F]" style={{ fontSize: "var(--text-sm)" }}>{item.num}</span>
                  <div>
                    <h3 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>{item.title}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1B4332] texture-hatch py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                Work With Us
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              Tell Meghalaya's entrepreneurship story.
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              Whether you are a media professional, content creator, or entertainment entrepreneur — reach out to explore how PRIME's M&E sector can support your work.
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
