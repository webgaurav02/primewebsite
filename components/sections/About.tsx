import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  HiLightningBolt,
  HiChip,
  HiTrendingUp,
  HiCreditCard,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const stats = [
  { num: "2,847+", label: "CM Elevate Graduates" },
  { num: "1,350+", label: "Registered Startups"  },
  { num: "885+",   label: "Funding Cases"         },
  { num: "2019",   label: "Year Founded"          },
];

const pillars: { num: string; label: string; desc: string; Icon: IconType }[] = [
  { num: "01", label: "Skills",      desc: "Expert entrepreneurial training across every sector",      Icon: HiLightningBolt },
  { num: "02", label: "Technology",  desc: "Digital tools that multiply enterprise productivity",       Icon: HiChip          },
  { num: "03", label: "Market",      desc: "Demand-side networks that open real buying channels",      Icon: HiTrendingUp    },
  { num: "04", label: "Credit",      desc: "De-risked financing that unlocks capital access",          Icon: HiCreditCard    },
];

const photos = [
  { src: "/assets/images/about-image.jpg", label: "PRIME in Action"        },
  { src: "/assets/images/event-1.jpg",     label: "Act East Business Show" },
  { src: "/assets/images/event-2.jpg",     label: "Incubation Cohort"      },
  { src: "/assets/images/event-3.jpg",     label: "PRIME Hub Activity"     },
];

function PhotoCollage() {
  return (
    <AnimateIn direction="up" distance={24}>
      <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[480px] md:h-[560px]">
        {/* Main large image — left, spans 2 rows */}
        <div className="col-span-7 row-span-2 relative overflow-hidden bg-black/10 group">
          <Image
            src={photos[0].src}
            alt={photos[0].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 58vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 text-white/70 font-semibold tracking-wide" style={{ fontSize: "10px" }}>
            {photos[0].label}
          </span>
        </div>

        {/* Top-right */}
        <div className="col-span-5 row-span-1 relative overflow-hidden bg-black/10 group">
          <Image
            src={photos[1].src}
            alt={photos[1].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 42vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 text-white/70 font-semibold tracking-wide" style={{ fontSize: "10px" }}>
            {photos[1].label}
          </span>
        </div>

        {/* Bottom-right split: two images side by side */}
        <div className="col-span-3 row-span-1 relative overflow-hidden bg-black/10 group">
          <Image
            src={photos[2].src}
            alt={photos[2].label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="25vw"
          />
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute bottom-3 left-3 text-white/60 font-semibold tracking-wide" style={{ fontSize: "9px" }}>
            {photos[2].label}
          </span>
        </div>

        {/* Bottom-right accent */}
        <div className="col-span-2 row-span-1 relative overflow-hidden bg-[#1B4332] flex flex-col items-center justify-center p-4">
          <p className="font-black text-[#74C69D] text-center leading-tight" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            2019
          </p>
          <p className="text-white/40 font-medium text-center tracking-[0.12em] uppercase" style={{ fontSize: "9px" }}>
            Est.
          </p>
          <div className="mt-3 w-6 h-px bg-[#74C69D]/40" />
          <p className="mt-2 text-white/25 font-medium text-center" style={{ fontSize: "8px" }}>
            Govt. of<br />Meghalaya
          </p>
        </div>
      </div>
    </AnimateIn>
  );
}

export default function About() {
  return (
    <section id="about" className="bg-white border-t border-black/[0.06]">

      {/* Text + stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-36">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-24 items-start mb-16 md:mb-28">

          <AnimateIn direction="left">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Who We Are
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-display)" }}
            >
              Meghalaya&apos;s<br />
              most ambitious<br />
              bet on its<br />
              <span className="text-[#2D6A4F]">people.</span>
            </h2>
          </AnimateIn>

          <AnimateIn direction="right" delay={0.1}>
            <div className="flex flex-col gap-8 pt-1">
              <p className="text-black leading-[1.8]" style={{ fontSize: "var(--text-lead)" }}>
                Launched in 2019 by the Government of Meghalaya, PRIME — the Promotion and Incubation of Market-driven Enterprises programme — is the state&apos;s most comprehensive entrepreneurship initiative, supporting founders at every stage through a network of PRIME Hubs.
              </p>

              <div className="grid grid-cols-2 gap-px bg-black/[0.07] border border-black/[0.07]">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white px-5 py-5">
                    <p className="font-black text-black leading-none mb-1" style={{ fontSize: "var(--text-heading)" }}>{s.num}</p>
                    <p className="text-black/35 font-medium" style={{ fontSize: "var(--text-label)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about-us"
                className="group inline-flex items-center gap-3 font-semibold text-black hover:text-[#2D6A4F] transition-colors duration-300 self-start"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Our full story
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </Link>
            </div>
          </AnimateIn>

        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07]">
          {pillars.map((p, i) => (
            <AnimateIn key={p.label} delay={0.05 + i * 0.06}>
              <div className="bg-white p-6 md:p-8 flex flex-col gap-6 group hover:bg-[#1B4332] transition-colors duration-300 h-full cursor-default">
                <div className="w-14 h-14 flex items-center justify-center bg-[#74C69D]/20 group-hover:bg-[#2D6A4F] transition-colors duration-300">
                  <span className="text-[#2D6A4F] group-hover:text-white transition-colors duration-300">
                    <p.Icon size={28} />
                  </span>
                </div>
                <div>
                  <p className="font-black text-black group-hover:text-white text-[18px] mb-2 transition-colors duration-300">{p.label}</p>
                  <p className="text-black/40 group-hover:text-white/40 leading-relaxed transition-colors duration-300" style={{ fontSize: "var(--text-sm)" }}>{p.desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>

      {/* Mobile: simple 2×2 image grid */}
      <div className="grid grid-cols-2 md:hidden">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden bg-black/10">
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/25" />
            <p className="absolute bottom-3 left-3 text-white/70 font-semibold tracking-wide" style={{ fontSize: "10px" }}>
              {photo.label}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: photo collage */}
      <div className="hidden md:block px-6 lg:px-10 pb-16 md:pb-24 max-w-7xl mx-auto w-full">
        <PhotoCollage />
      </div>

    </section>
  );
}
