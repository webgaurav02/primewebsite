"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY            = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex items-center min-h-[100svh] overflow-hidden bg-[#1B4332]"
      aria-label="Hero — PRIME Meghalaya"
    >
      {/* Video background — poster is the fallback image; swap src when video is available */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/images/hero-bg.jpg"
        >
          <source src="/assets/videos/hero.mp4" type="video/mp4" />
          {/* Falls back to poster image when video file is not available */}
        </video>
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content — centred */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-32 flex flex-col items-center text-center"
        style={{ opacity: contentOpacity }}
      >
        {/* Logo lockup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="flex flex-col items-center gap-5 mb-12"
        >
          {/* Government seal row */}
          <div className="flex items-center gap-3">
            {/* Emblem SVG */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="13" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <circle cx="14" cy="14" r="9"  stroke="rgba(116,198,157,0.5)"  strokeWidth="0.8" />
              <path d="M14 5 L15.5 9.5 L20 9.5 L16.5 12.5 L18 17 L14 14 L10 17 L11.5 12.5 L8 9.5 L12.5 9.5 Z" fill="rgba(116,198,157,0.7)" />
            </svg>
            <span className="text-white/55 font-semibold tracking-[0.22em] uppercase" style={{ fontSize: "var(--text-label)" }}>
              Government of Meghalaya
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <span className="text-[#74C69D]/70 font-medium tracking-[0.18em] uppercase" style={{ fontSize: "var(--text-label)" }}>
              Est. 2019
            </span>
          </div>

          {/* PRIME logo */}
          <Image
            src="/logo-white.png"
            alt="PRIME Meghalaya"
            width={280}
            height={84}
            className="h-16 md:h-20 w-auto object-contain animate-prime-glow"
            priority
          />
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="font-black text-white leading-[0.88] tracking-tight"
            style={{ fontSize: "var(--text-hero)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, delay: 0.35, ease: EASE }}
          >
            Meghalaya&apos;s Hub<br />
            for <span className="text-[#74C69D]">Entrepreneurs.</span>
          </motion.h1>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          className="text-white/60 leading-[1.75] max-w-md mb-10"
          style={{ fontSize: "var(--text-lead)" }}
        >
          Real support for real founders — incubation, funding, mentorship, and market access, right here in Meghalaya.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease: EASE }}
          className="flex flex-wrap items-center gap-4 justify-center"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors duration-300"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Apply for PRIME ID <span>→</span>
          </Link>
          <Link
            href="/about-us"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white/70 font-semibold hover:border-white/50 hover:text-white transition-all duration-300"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Learn more
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
        className="absolute bottom-8 right-8 md:right-10 flex flex-col items-center gap-2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-[#74C69D]/60 to-transparent"
        />
        <span className="text-white/25 tracking-[0.2em] uppercase rotate-90 origin-center mt-4" style={{ fontSize: "var(--text-label)" }}>Scroll</span>
      </motion.div>
    </section>
  );
}
