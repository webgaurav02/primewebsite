import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import {
  HiNewspaper, HiSpeakerphone, HiVideoCamera, HiGlobe,
  HiPhotograph, HiPencilAlt,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import HoverCard from "@/components/ui/HoverCard";

export const metadata: Metadata = {
  title: "Media & Comms — PRIME Meghalaya",
  description:
    "PRIME's media and communications wing — press relations, storytelling, publications, and outreach that amplify the impact of Meghalaya's entrepreneurs.",
};

const pillars: { Icon: IconType; title: string; desc: string }[] = [
  { Icon: HiNewspaper,    title: "Press & Media Relations",  desc: "Coordinating with print, broadcast, and digital media to share PRIME's announcements, milestones, and programme launches across Meghalaya and beyond." },
  { Icon: HiPencilAlt,    title: "Storytelling",             desc: "Documenting the journeys of PRIME entrepreneurs — success stories that inspire the next generation of founders in every district." },
  { Icon: HiSpeakerphone, title: "Campaigns & Outreach",     desc: "Awareness campaigns that take PRIME's schemes and opportunities to villages, campuses, and communities across the state." },
  { Icon: HiVideoCamera,  title: "Video & Multimedia",       desc: "Films, interviews, and event coverage that capture the energy of Meghalaya's entrepreneurship movement." },
  { Icon: HiPhotograph,   title: "Publications & Design",    desc: "Newsletters, catalogues, brochures, and reports — designed and published to showcase PRIME's programmes and its entrepreneurs' products." },
  { Icon: HiGlobe,        title: "Digital Presence",         desc: "Managing PRIME's website and social channels so entrepreneurs, partners, and citizens always have accurate, up-to-date information." },
];

export default function MediaCommsPage() {
  return (
    <>
      <Navbar />
      <main>

        <PageHero
          breadcrumb="Sectors of PRIME"
          title="Media & Comms"
          subtitle="The voice of PRIME — communications, press relations, and media outreach amplifying the stories and impact of Meghalaya's entrepreneurs."
        />

        {/* Pillars */}
        <section className="bg-white texture-grid py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  What We Do
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Telling Meghalaya&apos;s entrepreneurship story
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
              {pillars.map((p) => (
                <HoverCard key={p.title} className="p-8">
                  <span className="text-[#2D6A4F] mb-5 block"><p.Icon size={24} /></span>
                  <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-body)" }}>{p.title}</h3>
                  <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Latest from PRIME */}
        <section className="bg-[#f5f5f5] texture-dots py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Explore
                </p>
              </div>
              <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
                Our output, in one place
              </h2>
            </div>
            <div className="border-t border-black/[0.08]">
              {[
                { label: "Success Stories", desc: "Entrepreneur journeys from across Meghalaya's districts.",            href: "/updates#success-stories" },
                { label: "Updates",         desc: "Programme news, announcements, and milestones.",                      href: "/updates#updates"         },
                { label: "Newsletters",     desc: "Periodic round-ups of everything happening in the PRIME ecosystem.",  href: "/updates#newsletter"      },
                { label: "Catalogues & Brochures", desc: "Publications showcasing PRIME programmes and entrepreneur products.", href: "/updates#catalogue" },
              ].map((item, i) => (
                <Link key={item.label} href={item.href} className="grid grid-cols-[56px_1fr] gap-6 py-6 border-b border-black/[0.08] group hover:bg-white px-2 transition-colors">
                  <span className="font-black text-black/20 group-hover:text-[#2D6A4F] transition-colors" style={{ fontSize: "var(--text-sm)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>{item.label}</h3>
                    <p className="text-black/45 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{item.desc}</p>
                  </div>
                </Link>
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
                Media Enquiries
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl" style={{ fontSize: "var(--text-heading)" }}>
              Covering PRIME? Talk to us.
            </h2>
            <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
              For press enquiries, interview requests, media kits, or coverage of PRIME events and programmes, reach out to the communications team.
            </p>
            <a
              href="mailto:info@primemeghalaya.com"
              className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Contact Media Team →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
