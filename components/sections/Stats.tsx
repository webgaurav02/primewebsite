"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimateIn from "@/components/ui/AnimateIn";
import CountUp from "@/components/ui/CountUp";

const EASE = [0.22, 1, 0.36, 1] as const;

const bars = [
  { num: 2847, suffix: "+", label: "CM Elevate\nGraduates",       gradient: "linear-gradient(180deg, #C5E07A 0%, #9EC84A 100%)", height: 280, textColor: "#0a0a0a" },
  { num: 287,  suffix: "",  label: "Rural\nEnterprises",           gradient: "linear-gradient(180deg, #F5E84A 0%, #C4A800 100%)", height: 52,  textColor: "#0a0a0a" },
  { num: 459,  suffix: "",  label: "BFS Sector\nStartups",         gradient: "linear-gradient(180deg, #F08080 0%, #B52B2B 100%)", height: 90,  textColor: "#fff" },
  { num: 353,  suffix: "",  label: "Incubation\nCohort",           gradient: "linear-gradient(180deg, #80D8F4 0%, #2D9EC8 100%)", height: 70,  textColor: "#0a0a0a" },
  { num: 885,  suffix: "+", label: "Funding Cases\nSupported",     gradient: "linear-gradient(180deg, #F5B856 0%, #C86E00 100%)", height: 155, textColor: "#0a0a0a" },
  { num: 1350, suffix: "+", label: "PRIME\nRegistered Startups",   gradient: "linear-gradient(180deg, #888 0%, #222 100%)",       height: 200, textColor: "#fff" },
];

function AnimatedBar({ bar, index }: { bar: typeof bars[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="flex flex-col items-stretch flex-1">
      <div
        ref={ref}
        className="relative w-full overflow-hidden"
        style={{ height: `${bar.height}px` }}
      >
        <motion.div
          className="absolute inset-0 origin-bottom"
          style={{ background: bar.gradient }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.0, delay: index * 0.08, ease: EASE }}
        />
        <motion.span
          className="absolute top-2.5 left-2.5 text-[11px] md:text-[13px] font-extrabold leading-none z-10"
          style={{ color: bar.textColor }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.08 + 0.4 }}
        >
          {inView && <CountUp to={bar.num} suffix={bar.suffix} duration={1.5} />}
        </motion.span>
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <AnimateIn>
          <p className="text-center text-[10px] font-semibold tracking-[0.35em] uppercase text-gray-400 mb-4">
            Ecosystem Reach
          </p>
        </AnimateIn>

        <AnimateIn delay={0.08}>
          <h2 className="text-[32px] md:text-[52px] font-black text-[#111111] leading-[1.1] mb-14 text-center">
            Prime is everywhere.<br />
            The numbers prove it.
          </h2>
        </AnimateIn>

        {/* Animated bar chart */}
        <div className="flex items-end gap-2 md:gap-4">
          {bars.map((bar, i) => (
            <AnimatedBar key={bar.label} bar={bar} index={i} />
          ))}
        </div>

        {/* Labels */}
        <div className="flex gap-2 md:gap-4 mt-3">
          {bars.map((bar) => (
            <div key={bar.label} className="flex-1">
              <p className="text-[9px] md:text-[11px] font-semibold text-[#111111] leading-[1.4] whitespace-pre-line">
                {bar.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
