"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { num: 2847, suffix: "+", label: "CM Elevate Graduates" },
  { num: 1350, suffix: "+", label: "Registered Startups"  },
  { num: 885,  suffix: "+", label: "Funding Cases"        },
  { num: 459,  suffix: "",  label: "BFS Sector Startups"  },
  { num: 353,  suffix: "",  label: "Incubation Cohort"    },
  { num: 287,  suffix: "",  label: "Rural Enterprises"    },
];

function StatItem({ stat, delay }: { stat: typeof stats[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-2 px-6 py-8 border-r border-white/[0.08] last:border-r-0"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-white/35 font-medium leading-snug" style={{ fontSize: "var(--text-label)" }}>
        {stat.label}
      </p>
      <p className="font-black text-white leading-none" style={{ fontSize: "var(--text-heading)" }}>
        {inView ? <CountUp to={stat.num} suffix={stat.suffix} duration={1.6} /> : "0"}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="bg-[#1B4332]">

      {/* Top: heading + CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 md:pt-28 pb-10 md:pb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

          <AnimateIn direction="left">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-[#74C69D]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-white/35" style={{ fontSize: "var(--text-label)" }}>
                Ecosystem Reach
              </p>
            </div>
            <h2
              className="font-black text-white leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-display)" }}
            >
              The scale of PRIME,<br />
              by the <span className="text-[#74C69D]">numbers.</span>
            </h2>
          </AnimateIn>

          <AnimateIn direction="right" delay={0.1} className="flex flex-col items-start md:items-end gap-5 shrink-0">
            <p className="text-white/25 font-medium" style={{ fontSize: "var(--text-label)" }}>
              All figures since inception · 2019
            </p>
            <Link
              href="/ecosystem-data"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white/60 font-semibold hover:border-[#74C69D] hover:text-[#74C69D] transition-all duration-300"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Read more <span>→</span>
            </Link>
          </AnimateIn>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.08]" />

      {/* Bottom: 6-column stats strip */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 md:pb-28">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-white/[0.08] border-b border-white/[0.08]">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} delay={i * 0.07} />
          ))}
        </div>
      </div>

    </section>
  );
}
