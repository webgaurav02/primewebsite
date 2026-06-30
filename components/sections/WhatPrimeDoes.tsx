"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  HiOfficeBuilding,
  HiUsers,
  HiCurrencyRupee,
  HiAcademicCap,
  HiGlobe,
  HiBriefcase,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const services: { num: string; title: string; description: string; href: string; Icon: IconType }[] = [
  {
    num: "01",
    title: "Incubation",
    description: "9-month programme with co-working, mentorship, and IIM Calcutta certification.",
    href: "/incubation",
    Icon: HiOfficeBuilding,
  },
  {
    num: "02",
    title: "Mentorship",
    description: "Direct access to founders, industry leaders, and domain experts nationwide.",
    href: "/about-us",
    Icon: HiUsers,
  },
  {
    num: "03",
    title: "Funding & Schemes",
    description: "Grants, zero-interest loans, and startup investment — up to ₹75 Lakhs.",
    href: "/funding-schemes",
    Icon: HiCurrencyRupee,
  },
  {
    num: "04",
    title: "Training",
    description: "Sector-specific skill programmes at PRIME-supported Training Centres statewide.",
    href: "/trainingcentres",
    Icon: HiAcademicCap,
  },
  {
    num: "05",
    title: "Market Access",
    description: "Exhibitions, ONDC onboarding, B2B connections, and national trade show exposure.",
    href: "/market-linkage",
    Icon: HiGlobe,
  },
  {
    num: "06",
    title: "Business Facilitation",
    description: "Government liaison and complete handholding from idea to operational business.",
    href: "/business-facilitation",
    Icon: HiBriefcase,
  },
];

export default function WhatPrimeDoes() {
  return (
    <section id="services" className="bg-white py-24 md:py-36 border-t border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <AnimateIn>
          <div className="flex items-center gap-4 mb-12">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
              What We Offer
            </p>
          </div>
        </AnimateIn>

        <AnimateIn direction="left">
          <h2 className="font-black text-black leading-[0.9] tracking-tight mb-12" style={{ fontSize: "var(--text-display)" }}>
            Everything a founder<br />
            needs to{" "}
            <span className="text-[#2D6A4F]">succeed.</span>
          </h2>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div />
          <AnimateIn direction="right" delay={0.1}>
            <p className="text-black/45 leading-[1.75] mb-6" style={{ fontSize: "var(--text-lead)" }}>
              PRIME delivers six interlocking pillars of support — from your first idea to your fastest growth stage.
            </p>
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-3 font-semibold text-black hover:text-[#2D6A4F] transition-colors duration-300"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Full programme overview
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </AnimateIn>
        </div>

        {/* Visual process grid — bold icon boxes, dark invert on hover */}
        <AnimateIn delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-black/[0.07] border border-black/[0.07] mb-14">
            {services.map((svc) => (
              <Link
                key={svc.num}
                href={svc.href}
                className="group flex flex-col items-center text-center gap-4 p-5 md:p-7 bg-white hover:bg-[#1B4332] transition-colors duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#74C69D]/20 group-hover:bg-[#2D6A4F] transition-colors duration-300 shrink-0">
                  <span className="text-[#2D6A4F] group-hover:text-white transition-colors duration-300">
                    <svc.Icon size={28} />
                  </span>
                </div>
                <div>
                  <p className="font-bold text-black/20 group-hover:text-white/20 transition-colors leading-none mb-1.5 tracking-[0.14em]" style={{ fontSize: "9px" }}>
                    {svc.num}
                  </p>
                  <p className="font-black text-black group-hover:text-white text-[12px] md:text-[13px] leading-tight transition-colors">
                    {svc.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </AnimateIn>

        {/* Detailed list */}
        <div className="border-t border-black/[0.08]">
          {services.map((svc, i) => (
            <AnimateIn key={svc.title} delay={i * 0.04}>
              <motion.div
                className="group grid grid-cols-[44px_1fr_auto] md:grid-cols-[56px_1fr_auto] items-center gap-6 md:gap-10 py-5 md:py-6 border-b border-black/[0.08] cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="w-11 h-11 flex items-center justify-center bg-black/[0.04] group-hover:bg-[#2D6A4F] transition-colors duration-300 shrink-0">
                  <span className="text-black/30 group-hover:text-white transition-colors duration-300">
                    <svc.Icon size={18} />
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
                  <h3 className="font-black text-black group-hover:text-[#2D6A4F] transition-colors duration-300 shrink-0 text-[18px]">
                    {svc.title}
                  </h3>
                  <p className="text-black/40 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                    {svc.description}
                  </p>
                </div>

                <Link
                  href={svc.href}
                  className="shrink-0 w-9 h-9 flex items-center justify-center border border-black/10 group-hover:border-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white transition-all duration-300 text-black/30"
                  aria-label={`Learn more about ${svc.title}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  );
}
