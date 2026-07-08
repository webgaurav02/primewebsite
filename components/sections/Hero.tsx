"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  { src: "/assets/home-5.jpg", position: "center 30%" },
  { src: "/assets/home-7.jpg", position: "center 20%" },
  { src: "/assets/home-1.jpg", position: "center 45%" },
  { src: "/assets/home-2.jpg", position: "center 35%" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY            = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex items-center min-h-[100svh] overflow-hidden bg-[#1B4332]"
      aria-label="Hero — PRIME Meghalaya"
    >
      {/* Slideshow background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          >
            <Image
              src={HERO_IMAGES[current].src}
              alt=""
              fill
              priority={current === 0}
              className="object-cover"
              style={{ objectPosition: HERO_IMAGES[current].position }}
              sizes="100vw"
              quality={95}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-44 pb-24 md:py-32 flex flex-col items-center text-center"
        style={{ opacity: contentOpacity }}
      >
        {/* Headline */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="font-black text-white leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, delay: 0.3, ease: EASE }}
          >
            Meghalaya&apos;s Hub<br />
            for <span className="text-[#74C69D]">Entrepreneurs.</span>
          </motion.h1>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
          className="text-white/60 leading-[1.75] mb-10 md:whitespace-nowrap"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Real support for real founders — incubation, funding, mentorship, and market access, right here in Meghalaya.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: EASE }}
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

      {/* Slide dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

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
