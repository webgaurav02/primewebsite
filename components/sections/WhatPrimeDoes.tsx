"use client";

import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  HiOfficeBuilding,
  HiGlobe,
  HiBriefcase,
  HiUsers,
  HiTrendingUp,
  HiSpeakerphone,
  HiCog,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const sectors: { num: string; title: string; description: string; href: string; Icon: IconType }[] = [
  {
    num: "01",
    title: "Incubation",
    description: "The CM's E-Championship Challenge — 75 startups selected annually for a 9-month intensive programme with mentorship, co-working, and IIM Calcutta certification.",
    href: "/incubation",
    Icon: HiOfficeBuilding,
  },
  {
    num: "02",
    title: "PRIME Rural",
    description: "Supporting rural entrepreneurs through district-level PRIME Hubs, connecting agri-preneurs and self-help groups to markets, credit, and capacity building.",
    href: "/prime-rural",
    Icon: HiGlobe,
  },
  {
    num: "03",
    title: "Business Facilitation Service",
    description: "End-to-end handholding for entrepreneurs: government liaison, registration support, scheme navigation, and operational guidance from idea to running business.",
    href: "/business-facilitation",
    Icon: HiBriefcase,
  },
  {
    num: "04",
    title: "Partnership",
    description: "Institutional collaborations with MIE, IIM Calcutta Innovation Park, Startup India, MBMA, and sector-specific partners to deliver best-in-class support.",
    href: "/about-us#partners",
    Icon: HiUsers,
  },
  {
    num: "05",
    title: "CM Elevate",
    description: "The Chief Minister's flagship credit-linked programme offering 35–75% project cost subsidy across 15+ sectors for 20,000 entrepreneurs over 5 years.",
    href: "/cm-elevate",
    Icon: HiTrendingUp,
  },
  {
    num: "06",
    title: "Media & Comms",
    description: "Amplifying entrepreneur stories through press coverage, social media, exhibitions, and PRIME's communications channels to build visibility and market confidence.",
    href: "/updates",
    Icon: HiSpeakerphone,
  },
  {
    num: "07",
    title: "Admin",
    description: "The governance and coordination backbone — ensuring PRIME Hubs across all 12 districts operate seamlessly and deliver consistent support to every entrepreneur.",
    href: "/contact",
    Icon: HiCog,
  },
];

export default function WhatPrimeDoes() {
  return (
    <section id="sectors" className="bg-[#1B4332] py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid md:grid-cols-[5fr_7fr] gap-16 md:gap-24 mb-16">
          <AnimateIn direction="left">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#74C69D]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
                Sectors of PRIME
              </p>
            </div>
            <h2 className="font-black text-white leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-display)" }}>
              Seven pillars.<br />
              One <span className="text-[#74C69D]">ecosystem.</span>
            </h2>
          </AnimateIn>

          <AnimateIn direction="right" delay={0.1} className="flex flex-col justify-end">
            <p className="text-white/45 leading-[1.75] mb-6" style={{ fontSize: "var(--text-lead)" }}>
              PRIME operates across seven interconnected sectors — from startup incubation and rural enterprise to media, partnerships, and administration — to build a full-stack entrepreneurship ecosystem in Meghalaya.
            </p>
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-3 font-semibold text-[#74C69D] hover:text-white transition-colors duration-300 self-start"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Full programme overview
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </AnimateIn>
        </div>

        {/* Sector rows */}
        <div className="border-t border-white/[0.08]">
          {sectors.map((s, i) => (
            <AnimateIn key={s.num} delay={i * 0.05} direction="up" distance={10}>
              <Link
                href={s.href}
                className="group grid grid-cols-[48px_1fr_auto] gap-6 py-6 border-b border-white/[0.08] hover:bg-white/[0.04] -mx-4 px-4 transition-colors duration-200 items-start"
              >
                <span className="font-black text-white/15 group-hover:text-[#74C69D] transition-colors pt-0.5" style={{ fontSize: "var(--text-sm)" }}>
                  {s.num}
                </span>
                <div className="grid md:grid-cols-[1fr_2fr] gap-3 md:gap-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center bg-white/[0.06] group-hover:bg-[#74C69D]/20 transition-colors shrink-0">
                      <span className="text-[#74C69D]/60 group-hover:text-[#74C69D] transition-colors">
                        <s.Icon size={18} />
                      </span>
                    </div>
                    <h3 className="font-black text-white group-hover:text-[#74C69D] transition-colors leading-tight" style={{ fontSize: "var(--text-body)" }}>
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-white/35 leading-[1.75]" style={{ fontSize: "var(--text-sm)" }}>
                    {s.description}
                  </p>
                </div>
                <span className="text-white/20 group-hover:text-[#74C69D] transition-all duration-300 group-hover:translate-x-1 pt-1 shrink-0">
                  →
                </span>
              </Link>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  );
}
