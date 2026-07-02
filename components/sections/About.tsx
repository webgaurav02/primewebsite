"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
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

function ScrollImageCycler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [labelIndex, setLabelIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress — adds natural lag so fast scrolling still feels fluid
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 22, restDelta: 0.001 });

  // Per-image opacities driven directly by the motion value — no re-renders, GPU smooth
  const opacity0 = useTransform(smooth, [0,    0.20, 0.28], [1, 1, 0]);
  const opacity1 = useTransform(smooth, [0.20, 0.28, 0.45, 0.53], [0, 1, 1, 0]);
  const opacity2 = useTransform(smooth, [0.45, 0.53, 0.70, 0.78], [0, 1, 1, 0]);
  const opacity3 = useTransform(smooth, [0.70, 0.78, 1.0 ], [0, 1, 1]);
  const opacities = [opacity0, opacity1, opacity2, opacity3];

  // Progress bar width
  const barWidth = useTransform(smooth, [0, 1], ["0%", "100%"]);

  // Label text only (discrete — just for the counter/label UI)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setLabelIndex(Math.min(Math.floor(p * photos.length), photos.length - 1));
  });

  return (
    <div ref={containerRef} style={{ height: `${photos.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* All images stacked — opacity controlled by scroll */}
        {photos.map((photo, i) => (
          <motion.div key={photo.src} className="absolute inset-0" style={{ opacity: opacities[i] }}>
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>
        ))}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
          <motion.div className="h-full bg-[#74C69D]" style={{ width: barWidth }} />
        </div>

        {/* Counter + label */}
        <div className="absolute bottom-8 left-6 lg:left-10 flex items-center gap-4">
          <span className="font-black text-white/20 tabular-nums" style={{ fontSize: "var(--text-heading)" }}>
            {String(labelIndex + 1).padStart(2, "0")}
          </span>
          <span className="w-px h-6 bg-white/20" />
          <AnimatePresence mode="wait">
            <motion.p
              key={labelIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-white/50 font-semibold tracking-[0.2em] uppercase"
              style={{ fontSize: "11px" }}
            >
              {photos[labelIndex].label}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-10 right-6 lg:right-10 flex gap-2 items-center">
          {photos.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-white transition-all duration-500"
              style={{ width: i === labelIndex ? 24 : 6, opacity: i === labelIndex ? 1 : 0.25 }}
            />
          ))}
        </div>

      </div>
    </div>
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

      {/* Desktop: scroll-driven image cycler — full bleed */}
      <div className="hidden md:block">
        <ScrollImageCycler />
      </div>

    </section>
  );
}
