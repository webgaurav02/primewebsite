"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimateIn from "@/components/ui/AnimateIn";

const faqs = [
  {
    question: "What is PRIME Meghalaya?",
    answer: "PRIME — Promotion and Incubation of Market-driven Enterprises — is the Government of Meghalaya's comprehensive entrepreneurship programme. Launched in 2019, it provides end-to-end support: incubation, mentorship, training, funding access, and market linkages for founders at every stage.",
  },
  {
    question: "Who can apply to PRIME?",
    answer: "Any resident of Meghalaya with a business idea or an existing startup can apply. We support entrepreneurs across all stages — from ideation to growth — and across all sectors: agriculture, technology, handicrafts, tourism, food processing, and more.",
  },
  {
    question: "What kind of funding does PRIME offer?",
    answer: "PRIME offers several funding instruments: a Kick Start Grant (up to ₹10L, non-returnable), a Scale-up Innovation Loan (up to ₹75L at zero interest), a Small Support Grant (up to ₹3L), and the InnoVenture Grant (up to ₹35L). CM-ELEVATE additionally provides 35–75% project cost subsidy across 15+ sectors.",
  },
  {
    question: "How does the CM's E-Championship Challenge work?",
    answer: "Now in its 6th edition, the CM's E-Championship Challenge selects 75 entrepreneurs annually for a 9-month intensive incubation programme. Top 35 receive ₹2 lakh grants; the next 40 receive ₹1 lakh. 75 more from the Top 150 join pre-incubation. All participants get mentoring, co-working, media visibility, and an IIM Calcutta certificate.",
  },
  {
    question: "Where are PRIME Hubs located?",
    answer: "PRIME currently operates Startup Hubs in Shillong (Jawaharlal Nehru Stadium), Tura (Food Crafts Institute, Najing Bazaar), and Nongpoh (Downgate area). We also have presence across districts through our network of Block Officers and District Coordinators.",
  },
  {
    question: "How do I register and start?",
    answer: "Register at portal.primemeghalaya.com. Create your account, fill in your startup details, and submit your application. Our team reviews on a rolling basis. You can also walk in to any PRIME Hub — our Business Facilitation team will guide you through the process.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#0a0a0a] py-24 md:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-5 gap-12 md:gap-20">

          {/* Left: heading */}
          <div className="md:col-span-2">
            <AnimateIn direction="left">
              <p className="text-[11px] text-[#9EC84A] font-semibold tracking-[0.25em] uppercase mb-4">FAQ</p>
              <h2
                className="font-black text-white leading-[0.95] tracking-tight mb-6"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                Questions we<br />
                <span className="text-[#9EC84A]">get asked</span><br />
                a lot.
              </h2>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Reach out to our team at{" "}
                <a href="mailto:info@primemeghalaya.com" className="text-[#9EC84A] hover:underline">
                  info@primemeghalaya.com
                </a>
              </p>
            </AnimateIn>
          </div>

          {/* Right: accordion */}
          <div className="md:col-span-3">
            <AnimateIn direction="right" delay={0.1}>
              <div className="flex flex-col divide-y divide-white/8">
                {faqs.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i} className="py-1">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="w-full flex items-center justify-between py-5 text-left group"
                      >
                        <span className={`text-[14px] font-semibold leading-snug pr-6 transition-colors duration-200 ${isOpen ? "text-[#9EC84A]" : "text-white/80 group-hover:text-white"}`}>
                          {faq.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className={`shrink-0 text-xl font-light leading-none transition-colors duration-200 ${isOpen ? "text-[#9EC84A]" : "text-white/30 group-hover:text-white/60"}`}
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
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[13px] text-white/45 leading-relaxed pb-5 pr-10">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
