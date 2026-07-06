"use client";

import { useState } from "react";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  HiOfficeBuilding,
  HiUsers,
  HiCurrencyRupee,
  HiHome,
  HiBriefcase,
  HiSpeakerphone,
  HiLink,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const services: { num: string; title: string; description: string; href: string; Icon: IconType; color: string }[] = [
  {
    num: "01",
    title: "Incubation",
    description: "CM's E-Championship — 9-month programme with co-working, mentorship, and IIM Calcutta certification.",
    href: "/incubation",
    Icon: HiOfficeBuilding,
    color: "#EF4444",
  },
  {
    num: "02",
    title: "CM Elevate",
    description: "Credit-linked subsidy programme targeting 20,000 entrepreneurs across 15+ sectors over 5 years.",
    href: "/cm-elevate",
    Icon: HiCurrencyRupee,
    color: "#F97316",
  },
  {
    num: "03",
    title: "PRIME Rural",
    description: "Village-level enterprise development bringing PRIME's support system to grassroots entrepreneurs.",
    href: "/prime-rural",
    Icon: HiHome,
    color: "#22C55E",
  },
  {
    num: "04",
    title: "Business Facilitation",
    description: "Government liaison and complete handholding from idea to fully operational business.",
    href: "/business-facilitation",
    Icon: HiBriefcase,
    color: "#FACC15",
  },
  {
    num: "05",
    title: "Partnership",
    description: "Institutional alliances with knowledge partners, industry bodies, and ecosystem enablers.",
    href: "/partners",
    Icon: HiLink,
    color: "#14B8A6",
  },
  {
    num: "06",
    title: "Monitoring & Evaluation",
    description: "Impact tracking, field monitoring, and data-driven evaluation ensuring PRIME delivers measurable results.",
    href: "/media-entertainment",
    Icon: HiSpeakerphone,
    color: "#8B5CF6",
  },
  {
    num: "07",
    title: "Admin & Governance",
    description: "Operations, compliance, and governance infrastructure ensuring programme delivery at scale.",
    href: "/admin-governance",
    Icon: HiUsers,
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
              Sectors of PRIME
            </p>
          </div>
        </AnimateIn>

        <AnimateIn direction="left">
          <h2 className="font-black text-black leading-[0.9] tracking-tight mb-12" style={{ fontSize: "var(--text-display)" }}>
            The sectors<br />
            powering{" "}
            <span className="text-[#2D6A4F]">PRIME.</span>
          </h2>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div />
          <AnimateIn direction="right" delay={0.1}>
            <p className="text-black/45 leading-[1.75] mb-6" style={{ fontSize: "var(--text-lead)" }}>
              Seven sectors make up the PRIME ecosystem — each playing a distinct role in Meghalaya's entrepreneurship mission.
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {services.map((svc) => (
              <ServiceCard key={svc.num} svc={svc} />
            ))}
          </div>
        </AnimateIn>

      </div>
    </section>
  );
}
