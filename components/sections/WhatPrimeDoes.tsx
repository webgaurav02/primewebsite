"use client";

import { useState } from "react";
import Link from "next/link";
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

const services: { num: string; title: string; description: string; href: string; Icon: IconType; color: string }[] = [
  {
    num: "01",
    title: "Incubation",
    description: "9-month programme with co-working, mentorship, and IIM Calcutta certification.",
    href: "/incubation",
    Icon: HiOfficeBuilding,
    color: "#EF4444",
  },
  {
    num: "02",
    title: "Mentorship",
    description: "Direct access to founders, industry leaders, and domain experts nationwide.",
    href: "/about-us",
    Icon: HiUsers,
    color: "#F97316",
  },
  {
    num: "03",
    title: "Funding & Schemes",
    description: "Grants, zero-interest loans, and startup investment — up to ₹75 Lakhs.",
    href: "/funding-schemes",
    Icon: HiCurrencyRupee,
    color: "#FACC15",
  },
  {
    num: "04",
    title: "Training",
    description: "Sector-specific skill programmes at PRIME-supported Training Centres statewide.",
    href: "/trainingcentres",
    Icon: HiAcademicCap,
    color: "#22C55E",
  },
  {
    num: "05",
    title: "Market Access",
    description: "Exhibitions, ONDC onboarding, B2B connections, and national trade show exposure.",
    href: "/market-linkage",
    Icon: HiGlobe,
    color: "#14B8A6",
  },
  {
    num: "06",
    title: "Business Facilitation",
    description: "Government liaison and complete handholding from idea to operational business.",
    href: "/business-facilitation",
    Icon: HiBriefcase,
    color: "#3B82F6",
  },
];

function ServiceCard({ svc }: { svc: typeof services[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={svc.href}
      className="group flex flex-col gap-6 p-6 md:p-8 border bg-white transition-all duration-300"
      style={{
        borderColor: hovered ? svc.color : "rgba(0,0,0,0.08)",
        boxShadow: hovered ? `0 0 0 1px ${svc.color}, 0 0 24px ${svc.color}33` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 flex items-center justify-center shrink-0 transition-colors duration-300"
          style={{ backgroundColor: hovered ? `${svc.color}20` : "rgba(116,198,157,0.15)" }}
        >
          <span
            className="transition-colors duration-300"
            style={{ color: hovered ? svc.color : "#2D6A4F" }}
          >
            <svc.Icon size={24} />
          </span>
        </div>
        <p
          className="font-bold tracking-[0.14em] text-black/15 transition-colors duration-300"
          style={{ fontSize: "9px" }}
        >
          {svc.num}
        </p>
      </div>
      <div>
        <p className="font-black text-black text-[15px] md:text-[17px] leading-tight mb-2">
          {svc.title}
        </p>
        <p className="text-black/40 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
          {svc.description}
        </p>
      </div>
    </Link>
  );
}

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

        {/* Service cards grid */}
        <AnimateIn delay={0.08}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {services.map((svc) => (
              <ServiceCard key={svc.num} svc={svc} />
            ))}
          </div>
        </AnimateIn>

      </div>
    </section>
  );
}
