import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Image from "next/image";
import { HiCollection, HiDesktopComputer, HiArchive, HiChip, HiStar } from "react-icons/hi";
import type { IconType } from "react-icons";

const categories: { label: string; desc: string; Icon: IconType }[] = [
  { label: "Advanced Handicrafts & Handicraft Design", desc: "Centres providing advanced skill development in traditional and contemporary handicraft techniques, helping artisans build export-ready products.", Icon: HiCollection },
  { label: "Videography & Filmmaking",                  desc: "Professional training facilities for visual storytelling, video production, and digital content creation — supporting Meghalaya's growing creative economy.", Icon: HiDesktopComputer },
  { label: "Advanced Packaging & Packaging Design",      desc: "Training in modern packaging technologies and design thinking, enabling entrepreneurs to enhance shelf appeal and meet national retail standards.", Icon: HiArchive },
  { label: "New Technologies",                           desc: "Covering App Development, Artificial Intelligence, and emerging digital tools — helping Meghalaya's entrepreneurs stay competitive in the digital economy.", Icon: HiChip },
  { label: "Wildcard Category",                          desc: "Open to advanced tourism, nursery development and spawn production, traditional tribal healing and medicines, and other high-impact sectors unique to Meghalaya.", Icon: HiStar },
];

const funding = [
  { type: "Non-Refundable Grant", amount: "Up to ₹20 Lakhs", desc: "Direct grant for qualified training centre proposals — no repayment required." },
  { type: "Zero-Interest Loan", amount: "Up to ₹30 Lakhs", desc: "Zero-interest loan with up to 1 year moratorium and a 5-year repayment period." },
  { type: "Total Support", amount: "Up to ₹50 Lakhs", desc: "Combined grant and loan support per selected training centre proposal." },
];

export default function TrainingCentresPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Sector"
        title="Training Centre Establishment"
        subtitle="Financial support for local entrepreneurs setting up advanced, innovation-based training facilities in Meghalaya."
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
              Training Centre Establishment Competition
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              Training and Capacity Building is a core component for every entrepreneur to build the necessary skills across technical and business aspects to build a sustainable and successful enterprise. At this point, the availability of high-quality training facilities in Meghalaya is very limited — and in certain sectors, non-existent.
            </p>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              For high-quality advanced training in most sectors, entrepreneurs currently have to travel long distances and spend significant amounts. PRIME is changing this by financially supporting local entrepreneurs to establish world-class training centres right here in Meghalaya.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              The best proposals are selected through a transparent competition process — awarding up to <strong className="text-black">₹50 Lakhs</strong> per selected training centre.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <Image src="/assets/incubation.jpg" alt="Training Centre" width={800} height={600} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Funding breakdown */}
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
              Funding available per selected centre
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {funding.map((f) => (
              <div key={f.type} className="bg-white p-8 flex flex-col">
                <p className="text-black/35 font-semibold uppercase tracking-wide mb-4" style={{ fontSize: "var(--text-label)" }}>
                  {f.type}
                </p>
                <p className="font-black text-[#2D6A4F] leading-[0.9] mb-4" style={{ fontSize: "var(--text-heading)" }}>
                  {f.amount}
                </p>
                <p className="text-black/50 leading-relaxed mt-auto" style={{ fontSize: "var(--text-sm)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training images */}
      <section className="bg-[#f5f5f5] pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="aspect-[4/3] overflow-hidden">
              <Image src="/assets/dsc02064.jpg" alt="PRIME training participants" width={700} height={525} quality={90} className="w-full h-full object-cover object-top" />
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <Image src="/assets/partnership-bfs.jpg" alt="PRIME co-working training session" width={700} height={525} quality={90} className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Eligible Sectors
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Competition categories
            </h2>
          </div>
          <div className="border-t border-black/[0.08]">
            {categories.map((c) => (
              <div key={c.label} className="flex items-start gap-6 py-6 border-b border-black/[0.08] group hover:bg-[#f5f5f5] px-2 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-[#74C69D]/20 shrink-0 group-hover:bg-[#2D6A4F] transition-colors">
                  <span className="text-[#2D6A4F] group-hover:text-white transition-colors"><c.Icon size={20} /></span>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2" style={{ fontSize: "var(--text-body)" }}>{c.label}</h3>
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{c.desc}</p>
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
              Get in Touch
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Have a training centre idea?
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Submit your proposal and compete for up to ₹50 Lakhs in financial support to establish an advanced training centre in Meghalaya.
          </p>
          <a
            href="mailto:info@primemeghalaya.com"
            className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Get in touch
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
