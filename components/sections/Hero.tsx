"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const headline = ["Meghalaya's", "hub for", "Entrepreneurs."];

const stats = [
  { value: "2847+", label: "CM Elevate Graduates" },
  { value: "1350+", label: "Registered Startups" },
  { value: "885+",  label: "Funding Cases" },
  { value: "353",   label: "Incubated" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  show: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

function FadeUp({ delay, children, className }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex items-center min-h-[100svh] overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero — PRIME Meghalaya"
    >
      {/* Background photo — real people, visible */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/hero-bg.jpg')",
          y: bgY,
        }}
      />

      {/* Warm gradient overlay — dark left for text, opens right to reveal photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-28"
        style={{ opacity: contentOpacity }}
      >
        {/* Badge */}
        <FadeUp delay={0}>
          <div className="inline-flex items-center gap-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9EC84A] animate-pulse" />
            <span className="text-[11px] text-[#9EC84A] font-semibold tracking-[0.2em] uppercase">
              A Government of Meghalaya Initiative · Since 2019
            </span>
          </div>
        </FadeUp>

        {/* Staggered headline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {headline.map((line, i) => (
            <div key={i}>
              <motion.div variants={wordVariant}>
                <h1
                  className={`block font-black leading-[0.9] tracking-tight ${
                    i === 2 ? "text-[#9EC84A]" : "text-white"
                  }`}
                  style={{ fontSize: "clamp(52px, 9vw, 128px)" }}
                >
                  {line}
                </h1>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Subtext */}
        <FadeUp delay={1.0}>
          <p className="mt-8 text-[15px] text-white/60 max-w-sm leading-relaxed">
            Real support for real people building real businesses — right here in Meghalaya.
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={1.15}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-[#9EC84A] text-black text-[13px] font-bold overflow-hidden rounded-sm"
            >
              <span className="relative z-10">Join PRIME</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            </Link>
            <Link
              href="/funding-schemes"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/70 hover:border-[#9EC84A]/60 hover:text-white text-[13px] font-semibold transition-all duration-300 rounded-sm"
            >
              Explore Schemes
            </Link>
          </div>
        </FadeUp>

        {/* Stats row */}
        <FadeUp delay={1.4}>
          <div className="mt-16 md:mt-20 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-10">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[30px] md:text-[38px] font-black text-white leading-none">
                  {s.value}
                </span>
                <span className="text-[11px] text-white/55 mt-1.5 tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/25 tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#9EC84A]/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
