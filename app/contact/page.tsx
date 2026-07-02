"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi";

const contacts = [
  {
    Icon: HiMail,
    label: "General Enquiries",
    value: "info@primemeghalaya.com",
    href: "mailto:info@primemeghalaya.com",
    sub: "We reply within 2 working days",
  },
  {
    Icon: HiMail,
    label: "Grievance & Complaints",
    value: "grievance@primemeghalaya.com",
    href: "mailto:grievance@primemeghalaya.com",
    sub: "Response within 30 working days",
  },
  {
    Icon: HiLocationMarker,
    label: "Head Office",
    value: "PRIME Meghalaya, Shillong, Meghalaya — 793001",
    href: "https://maps.google.com/?q=Shillong+Meghalaya",
    sub: "Mon – Fri, 9:30 am – 5:30 pm",
  },
  {
    Icon: HiPhone,
    label: "Phone",
    value: "+91 364 222 1234",
    href: "tel:+913642221234",
    sub: "Office hours only",
  },
];

const HUBS = [
  "East Khasi Hills — Shillong",
  "West Khasi Hills — Nongstoin",
  "South West Khasi Hills — Mawkyrwat",
  "Ri Bhoi — Nongpoh",
  "East Jaintia Hills — Khliehriat",
  "West Jaintia Hills — Jowai",
  "East Garo Hills — Williamnagar",
  "West Garo Hills — Tura",
  "South Garo Hills — Baghmara",
  "North Garo Hills — Resubelpara",
  "East West Khasi Hills — Mairang",
  "South West Garo Hills — Ampati",
];

const subjects = [
  "Apply to PRIME",
  "Programme Information",
  "Funding & Schemes",
  "Media & Press",
  "Partnership Enquiry",
  "Other",
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-[#1B4332] pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden">
        {/* Faint background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/assets/images/team-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] via-[#1B4332]/80 to-[#1B4332]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-6 h-px bg-[#74C69D]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
              Get in touch
            </p>
          </div>
          <h1
            className="font-black text-white leading-[0.9] tracking-tight max-w-3xl mb-6"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            We&apos;d love to<br />
            hear from you.
          </h1>
          <p className="text-white/40 leading-[1.75] max-w-xl" style={{ fontSize: "var(--text-lead)" }}>
            Whether you&apos;re an entrepreneur ready to apply, a journalist, a partner, or just curious — reach out and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      {/* ── Contact cards + Form ──────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">

            {/* Left — contact info */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-6 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Contact details
                </p>
              </div>

              <div className="flex flex-col gap-px bg-black/[0.06]">
                {contacts.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group bg-white px-6 py-6 flex items-start gap-5 hover:bg-[#f7fbf9] transition-colors duration-200"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-[#74C69D]/15 shrink-0 mt-0.5 group-hover:bg-[#74C69D]/25 transition-colors">
                      <c.Icon size={18} className="text-[#2D6A4F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-black/35 mb-1" style={{ fontSize: "var(--text-label)" }}>
                        {c.label}
                      </p>
                      <p className="font-black text-black leading-snug break-words" style={{ fontSize: "var(--text-sm)" }}>
                        {c.value}
                      </p>
                      <p className="text-black/30 mt-1" style={{ fontSize: "var(--text-label)" }}>
                        {c.sub}
                      </p>
                    </div>
                    <HiArrowRight size={14} className="text-black/15 group-hover:text-[#2D6A4F] group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1" />
                  </a>
                ))}
              </div>

              {/* Apply CTA */}
              <div className="mt-10 bg-[#1B4332] px-7 py-8">
                <p className="font-black text-white leading-snug mb-2" style={{ fontSize: "var(--text-body)" }}>
                  Ready to join PRIME?
                </p>
                <p className="text-white/40 mb-5" style={{ fontSize: "var(--text-sm)" }}>
                  Submit your application directly through our entrepreneur portal.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 font-semibold text-[#74C69D] hover:gap-4 transition-all duration-200"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Apply to PRIME <HiArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-6 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Send a message
                </p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-start gap-5 py-16">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#74C69D]/20">
                    <HiCheckCircle size={28} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="font-black text-black mb-2" style={{ fontSize: "var(--text-heading)" }}>
                      Message sent.
                    </p>
                    <p className="text-black/45 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
                      Thank you for reaching out. We&apos;ll get back to you within 2 working days.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="font-semibold text-[#2D6A4F] hover:underline"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-black/50" style={{ fontSize: "var(--text-label)" }}>
                        Full name <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="border border-black/[0.12] bg-white px-4 py-3.5 text-black placeholder-black/25 focus:outline-none focus:border-[#2D6A4F] transition-colors"
                        style={{ fontSize: "var(--text-sm)" }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-black/50" style={{ fontSize: "var(--text-label)" }}>
                        Email address <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="border border-black/[0.12] bg-white px-4 py-3.5 text-black placeholder-black/25 focus:outline-none focus:border-[#2D6A4F] transition-colors"
                        style={{ fontSize: "var(--text-sm)" }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-black/50" style={{ fontSize: "var(--text-label)" }}>
                      Subject <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="border border-black/[0.12] bg-white px-4 py-3.5 text-black focus:outline-none focus:border-[#2D6A4F] transition-colors appearance-none"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      <option value="" disabled>Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-black/50" style={{ fontSize: "var(--text-label)" }}>
                      Message <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind…"
                      className="border border-black/[0.12] bg-white px-4 py-3.5 text-black placeholder-black/25 focus:outline-none focus:border-[#2D6A4F] transition-colors resize-none"
                      style={{ fontSize: "var(--text-sm)" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="self-start inline-flex items-center gap-3 bg-[#1B4332] text-white font-semibold px-8 py-4 hover:bg-[#2D6A4F] transition-colors duration-200 disabled:opacity-50"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {loading ? "Sending…" : <>Send message <HiArrowRight size={14} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIME Hubs ───────────────────────────────────────── */}
      <section className="bg-[#f7f7f5] border-t border-black/[0.06] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">

            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="w-6 h-px bg-[#2D6A4F]" />
                <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                  Across Meghalaya
                </p>
              </div>
              <h2
                className="font-black text-black leading-[0.9] tracking-tight mb-5"
                style={{ fontSize: "var(--text-heading)" }}
              >
                PRIME Hubs in every district.
              </h2>
              <p className="text-black/45 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
                Each district has a dedicated PRIME Hub — your local point of contact for applications, mentorship, and support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/[0.06]">
              {HUBS.map((hub) => {
                const [district, location] = hub.split(" — ");
                return (
                  <div key={hub} className="bg-white px-6 py-5 flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#74C69D] shrink-0" />
                    <div>
                      <p className="font-black text-black" style={{ fontSize: "var(--text-sm)" }}>{district}</p>
                      <p className="text-black/35" style={{ fontSize: "var(--text-label)" }}>{location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
