"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimateIn from "@/components/ui/AnimateIn";

const services = [
  {
    title: "Incubation",
    description: "9-month intensive programme with co-working, mentoring, media visibility, and a certificate from IIM Calcutta Innovation Park.",
    href: "/incubation",
    featured: true,
  },
  {
    title: "Mentorship",
    description: "One-on-one access to founders, industry leaders, and domain experts from across India.",
    href: "/about-us",
    featured: false,
  },
  {
    title: "Funding & Schemes",
    description: "Grants, zero-interest loans, FLDG credit enhancement, and direct startup investment — up to ₹75 Lakhs.",
    href: "/funding-schemes",
    featured: false,
  },
  {
    title: "Training",
    description: "Sector-specific training and advanced skill programmes at PRIME-supported Training Centres across the state.",
    href: "/trainingcentres",
    featured: false,
  },
  {
    title: "Market Access",
    description: "Exhibitions, ONDC onboarding, B2B buyer connections, and exposure at national and international trade shows.",
    href: "/market-linkage",
    featured: false,
  },
  {
    title: "Business Facilitation",
    description: "Government liaison, awareness programmes, and complete handholding from idea to registered, operational business.",
    href: "/business-facilitation",
    featured: false,
  },
];

export default function WhatPrimeDoes() {
  return (
    <section id="services" className="bg-[#0a0a0a] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <AnimateIn direction="left">
            <p className="text-[11px] text-[#9EC84A] font-semibold tracking-[0.25em] uppercase mb-3">What We Offer</p>
            <h2
              className="font-black text-white leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
            >
              Everything a founder<br />needs to succeed.
            </h2>
          </AnimateIn>
          <AnimateIn direction="right" delay={0.1}>
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-white/50 hover:text-[#9EC84A] transition-colors duration-300"
            >
              Full programme overview
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </AnimateIn>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((svc, i) => (
            <AnimateIn key={svc.title} delay={i * 0.06} direction="up">
              <motion.div
                className={`h-full rounded border p-7 flex flex-col group relative overflow-hidden ${
                  svc.featured
                    ? "bg-[#9EC84A] border-[#9EC84A] lg:col-span-1"
                    : "bg-[#111] border-white/8 hover:border-[#9EC84A]/30"
                }`}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Top accent */}
                <div className={`w-8 h-0.5 mb-6 ${svc.featured ? "bg-black/30" : "bg-[#9EC84A]"}`} />

                <h3 className={`text-[17px] font-black mb-3 ${svc.featured ? "text-black" : "text-white"}`}>
                  {svc.title}
                </h3>
                <p className={`text-[12px] leading-relaxed flex-1 ${svc.featured ? "text-black/60" : "text-white/45"}`}>
                  {svc.description}
                </p>

                <Link
                  href={svc.href}
                  className={`mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase transition-all duration-300 group-hover:gap-3 ${
                    svc.featured ? "text-black/70 hover:text-black" : "text-[#9EC84A]/70 hover:text-[#9EC84A]"
                  }`}
                >
                  Learn more <span>→</span>
                </Link>

                {/* Hover glow for dark cards */}
                {!svc.featured && (
                  <div className="absolute inset-0 bg-[#9EC84A] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none" />
                )}
              </motion.div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
