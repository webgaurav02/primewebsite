"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  HiInformationCircle,
  HiUser,
  HiCurrencyRupee,
  HiStar,
  HiLocationMarker,
  HiArrowCircleRight,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const faqs: { question: string; answer: string; Icon: IconType }[] = [
  {
    question: "What is PRIME Meghalaya?",
    answer: "PRIME — Promotion and Incubation of Market-driven Enterprises — is the Government of Meghalaya's comprehensive entrepreneurship programme. Launched in 2019, it provides end-to-end support: incubation, mentorship, training, funding access, and market linkages for founders at every stage.",
    Icon: HiInformationCircle,
  },
  {
    question: "Who can apply to PRIME?",
    answer: "Any resident of Meghalaya with a business idea or an existing startup can apply. We support entrepreneurs across all stages — from ideation to growth — and across all sectors: agriculture, technology, handicrafts, tourism, food processing, and more.",
    Icon: HiUser,
  },
  {
    question: "What kind of funding does PRIME offer?",
    answer: "PRIME offers several funding instruments: a Kick Start Grant (up to ₹10L, non-returnable), a Scale-up Innovation Loan (up to ₹75L at zero interest), a Small Support Grant (up to ₹3L), and the InnoVenture Grant (up to ₹35L). CM-ELEVATE additionally provides 35–75% project cost subsidy across 15+ sectors.",
    Icon: HiCurrencyRupee,
  },
  {
    question: "How does the CM's E-Championship Challenge work?",
    answer: "Now in its 6th edition, the CM's E-Championship Challenge selects 75 entrepreneurs annually for a 9-month intensive incubation programme. Top 35 receive ₹2 lakh grants; the next 40 receive ₹1 lakh. 75 more from the Top 150 join pre-incubation. All participants get mentoring, co-working, media visibility, and an IIM Calcutta certificate.",
    Icon: HiStar,
  },
  {
    question: "Where are PRIME Hubs located?",
    answer: "PRIME currently operates Startup Hubs in Shillong (Jawaharlal Nehru Stadium), Tura (Food Crafts Institute, Najing Bazaar), and Nongpoh (Downgate area). We also have presence across districts through our network of Block Officers and District Coordinators.",
    Icon: HiLocationMarker,
  },
  {
    question: "How do I register and start?",
    answer: "Register at portal.primemeghalaya.com. Create your account, fill in your startup details, and submit your application. Our team reviews on a rolling basis. You can also walk in to any PRIME Hub — our Business Facilitation team will guide you through the process.",
    Icon: HiArrowCircleRight,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 md:py-36 border-t border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid md:grid-cols-[5fr_7fr] gap-16 md:gap-24">

          {/* Left: heading */}
          <div className="md:sticky md:top-24 md:self-start">
            <AnimateIn direction="left">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  FAQ
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight mb-8"
                style={{ fontSize: "var(--text-heading)" }}
              >
                Questions<br />
                we get<br />
                asked a lot.
              </h2>
              <p className="text-black/40 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
                Can&apos;t find what you&apos;re looking for?{" "}
                <a href="mailto:info@primemeghalaya.com" className="text-[#2D6A4F] hover:underline">
                  info@primemeghalaya.com
                </a>
              </p>
            </AnimateIn>
          </div>

          {/* Right: accordion — each item staggers in individually */}
          <div className="border-t border-black/[0.08]">
            {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <AnimateIn key={i} delay={i * 0.07} direction="up" distance={12}>
                  <div className="border-b border-black/[0.08]">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon box */}
                        <div className={`shrink-0 w-9 h-9 flex items-center justify-center transition-colors duration-200 ${
                          isOpen
                            ? "bg-[#2D6A4F] text-white"
                            : "bg-black/[0.05] text-black/30 group-hover:bg-[#74C69D]/20 group-hover:text-[#2D6A4F]"
                        }`}>
                          <faq.Icon size={17} />
                        </div>
                        <span
                          className={`font-semibold leading-snug transition-colors duration-200 pt-1.5 ${
                            isOpen ? "text-black" : "text-black/55 group-hover:text-black"
                          }`}
                          style={{ fontSize: "var(--text-body)" }}
                        >
                          {faq.question}
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className={`shrink-0 text-xl font-light leading-none mt-1.5 transition-colors duration-200 ${
                          isOpen ? "text-[#2D6A4F]" : "text-black/25 group-hover:text-black/50"
                        }`}
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p
                            className="text-black/45 leading-[1.8] pb-6 pl-4 md:pl-[52px] pr-4 md:pr-10"
                            style={{ fontSize: "var(--text-body)" }}
                          >
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  </AnimateIn>
                );
              })}
            </div>

        </div>
      </div>
    </section>
  );
}
