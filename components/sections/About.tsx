import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";

const pillars = [
  { label: "Skills", desc: "Expert entrepreneurial training across every sector" },
  { label: "Technology", desc: "Digital tools that multiply enterprise productivity" },
  { label: "Market", desc: "Demand-side networks that open real buying channels" },
  { label: "Credit", desc: "De-risked financing that unlocks capital access" },
];

export default function About() {
  return (
    <section id="about" className="bg-[#0a0a0a] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top: label + heading */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-16 mb-16 md:mb-20">
          <AnimateIn direction="left">
            <p className="text-[11px] text-[#9EC84A] font-semibold tracking-[0.25em] uppercase mb-4">Who We Are</p>
            <h2
              className="font-black text-white leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
            >
              Meghalaya&apos;s<br />
              most ambitious<br />
              <span className="text-[#9EC84A]">bet on its people.</span>
            </h2>
          </AnimateIn>
          <AnimateIn direction="right" delay={0.1}>
            <div className="flex flex-col justify-end h-full pt-8 md:pt-0">
              <p className="text-[14px] text-white/50 leading-[1.8] mb-6">
                Launched in 2019 by the Government of Meghalaya, PRIME — the Promotion and Incubation of Market-driven Enterprises programme — is the state&apos;s most comprehensive entrepreneurship initiative. We provide systematic, targeted support through a network of PRIME Hubs that act as one-stop-shops for every kind of founder.
              </p>
              <Link
                href="/about-us"
                className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#9EC84A] hover:gap-4 transition-all duration-300"
              >
                Our full story
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </AnimateIn>
        </div>

        {/* Image + pillars */}
        <div className="grid md:grid-cols-5 gap-6">
          <AnimateIn className="md:col-span-3 relative aspect-[16/10] rounded overflow-hidden" direction="up" delay={0.05}>
            <Image
              src="/assets/images/about-image.jpg"
              alt="PRIME in action"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </AnimateIn>

          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            {pillars.map((p, i) => (
              <AnimateIn key={p.label} delay={0.1 + i * 0.07} direction="up">
                <div className="h-full bg-[#111] border border-white/8 rounded p-5 hover:border-[#9EC84A]/30 transition-colors group">
                  <p className="text-[11px] text-[#9EC84A] font-bold uppercase tracking-widest mb-2">{p.label}</p>
                  <p className="text-[12px] text-white/50 leading-relaxed">{p.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
