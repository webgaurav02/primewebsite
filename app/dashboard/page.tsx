"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiHome, HiBriefcase, HiAcademicCap, HiCurrencyRupee,
  HiCalendar, HiDocumentText, HiQuestionMarkCircle,
  HiMenu, HiX, HiBell, HiChevronRight, HiTrendingUp,
  HiUserGroup, HiCheckCircle, HiLocationMarker,
  HiArrowRight, HiExclamationCircle, HiDownload, HiGlobe,
  HiLogout,
} from "react-icons/hi";

/* ── Mock data ──────────────────────────────────────────────────────────── */
const USER = {
  name: "Bitchri Sekso Mebitchi R Marak",
  shortName: "Bitchri",
  business: "Zero9 Farms",
  primeId: "PRIME-SG-2024-0312",
  district: "South Garo Hills",
  sector: "Food Processing",
  status: "Active",
  since: "January 2024",
  avatar: "/assets/entrepreneurs-directory/Zero9Farms.jpg",
};

const STATS = [
  { label: "People Employed",  value: "5",       sub: "Direct employment",    Icon: HiUserGroup },
  { label: "Annual Turnover",  value: "₹5 Lakh", sub: "FY 2024–25",           Icon: HiTrendingUp },
  { label: "Govt. Funding",    value: "₹2 Lakh", sub: "Total received",       Icon: HiCurrencyRupee },
  { label: "Programs Active",  value: "2",        sub: "Currently enrolled",   Icon: HiAcademicCap },
];

const PROGRAMS = [
  { name: "CM Elevate",           batch: "Batch 14",    status: "Completed", date: "Oct 2024",  dotCls: "bg-[#2D6A4F]",  badgeCls: "text-[#2D6A4F] bg-[#2D6A4F]/10" },
  { name: "Incubation Program",   batch: "Cohort 2025", status: "Active",    date: "Ongoing",   dotCls: "bg-[#74C69D]",  badgeCls: "text-[#1B4332] bg-[#74C69D]/20" },
  { name: "Market Linkage",       batch: "FY 2025",     status: "Active",    date: "Ongoing",   dotCls: "bg-[#74C69D]",  badgeCls: "text-[#1B4332] bg-[#74C69D]/20" },
  { name: "PRIME Rural Linkage",  batch: "Open",        status: "Available", date: "Apply now", dotCls: "bg-black/20",   badgeCls: "text-black/40 bg-black/[0.05]" },
  { name: "Fellowship Programme", batch: "2026 cohort", status: "Available", date: "Apply now", dotCls: "bg-black/20",   badgeCls: "text-black/40 bg-black/[0.05]" },
];

const EVENTS = [
  { title: "PRIME Hub Meetup — Tura",        date: "Jul 15, 2026",    loc: "Tura Community Hall",           type: "Networking" },
  { title: "Product Exhibition — Shillong",  date: "Jul 28, 2026",    loc: "Polo Ground Exhibition Centre", type: "Exhibition" },
  { title: "Act East Business Show",         date: "Aug 10–12, 2026", loc: "Guwahati",                      type: "Trade Show" },
  { title: "Digital Marketing Workshop",     date: "Aug 20, 2026",    loc: "Online",                        type: "Workshop" },
];

const ACTIVITY = [
  { text: "Business profile updated successfully",         time: "2 days ago",   Icon: HiCheckCircle,  color: "text-[#2D6A4F]" },
  { text: "Document approved — Aadhaar verification",     time: "5 days ago",   Icon: HiCheckCircle,  color: "text-[#2D6A4F]" },
  { text: "Market Linkage enrollment confirmed",          time: "2 weeks ago",  Icon: HiCheckCircle,  color: "text-[#2D6A4F]" },
  { text: "Government funding disbursed — ₹2 Lakh",       time: "1 month ago",  Icon: HiCurrencyRupee, color: "text-[#74C69D]" },
  { text: "Incubation Cohort 2025 seat reserved",         time: "2 months ago", Icon: HiAcademicCap,  color: "text-amber-500" },
];

const DOCS = [
  { name: "Aadhaar Card",          status: "Verified",     date: "Jan 2024" },
  { name: "PAN Card",              status: "Verified",     date: "Jan 2024" },
  { name: "Business Registration", status: "Verified",     date: "Feb 2024" },
  { name: "Bank Statement",        status: "Pending",      date: "—" },
  { name: "GST Certificate",       status: "Not uploaded", date: "—" },
];

const FUNDING = [
  { label: "CM Elevate Grant",       amount: "₹1 Lakh", date: "Mar 2024", status: "Disbursed",  badgeCls: "text-[#2D6A4F] bg-[#2D6A4F]/10" },
  { label: "Incubation Support",     amount: "₹1 Lakh", date: "Sep 2024", status: "Disbursed",  badgeCls: "text-[#2D6A4F] bg-[#2D6A4F]/10" },
  { label: "Market Linkage Subsidy", amount: "₹50,000", date: "Pending",  status: "Processing", badgeCls: "text-amber-600 bg-amber-50" },
];

/* ── Types & nav config ─────────────────────────────────────────────────── */
type Section = "overview" | "business" | "programs" | "funding" | "events" | "documents" | "support";

const NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",   Icon: HiHome },
  { id: "business",  label: "My Business",Icon: HiBriefcase },
  { id: "programs",  label: "Programs",   Icon: HiAcademicCap },
  { id: "funding",   label: "Funding",    Icon: HiCurrencyRupee },
  { id: "events",    label: "Events",     Icon: HiCalendar },
  { id: "documents", label: "Documents",  Icon: HiDocumentText },
  { id: "support",   label: "Support",    Icon: HiQuestionMarkCircle },
];

const PAGE_TITLE: Record<Section, string> = {
  overview: "Overview", business: "My Business", programs: "Programs",
  funding: "Funding",   events: "Events",         documents: "Documents", support: "Support",
};

/* ── Shared card wrapper ────────────────────────────────────────────────── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-black/[0.07] ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.07]">
      <p className="font-bold text-black" style={{ fontSize: "var(--text-sm)" }}>{title}</p>
      {meta && <span className="text-black/30 font-medium" style={{ fontSize: "var(--text-label)" }}>{meta}</span>}
    </div>
  );
}

/* ── Section: Overview ──────────────────────────────────────────────────── */
function Overview() {
  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-[#1B4332]">
        {/* Faint portrait bg */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src={USER.avatar}
            alt=""
            fill
            className="object-cover object-top opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] via-[#1B4332]/95 to-[#1B4332]/70" />
        </div>

        <div className="relative z-10 px-6 md:px-8 py-6 md:py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          {/* Avatar */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden flex-shrink-0 ring-2 ring-white/10">
            <Image src={USER.avatar} alt={USER.name} fill className="object-cover object-top" />
          </div>

          {/* Name + business */}
          <div className="flex-1 min-w-0">
            <p className="text-white/40 font-medium mb-0.5" style={{ fontSize: "var(--text-label)" }}>
              Good morning
            </p>
            <p className="font-black text-white leading-tight truncate" style={{ fontSize: "var(--text-heading)" }}>
              {USER.shortName}
            </p>
            <p className="text-white/40 font-medium mt-1 truncate" style={{ fontSize: "var(--text-sm)" }}>
              {USER.business} · {USER.sector}
            </p>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-3 sm:gap-5 sm:text-right">
            <div>
              <p className="text-white/30 font-medium mb-1" style={{ fontSize: "var(--text-label)" }}>PRIME ID</p>
              <p className="text-[#74C69D] font-bold" style={{ fontSize: "var(--text-sm)" }}>{USER.primeId}</p>
            </div>
            <div>
              <p className="text-white/30 font-medium mb-1" style={{ fontSize: "var(--text-label)" }}>Status</p>
              <span className="inline-flex items-center gap-1.5 bg-[#74C69D]/15 text-[#74C69D] font-bold px-2.5 py-0.5" style={{ fontSize: "var(--text-label)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#74C69D]" />
                {USER.status}
              </span>
            </div>
            <div>
              <p className="text-white/30 font-medium mb-1" style={{ fontSize: "var(--text-label)" }}>Member since</p>
              <p className="text-white/60 font-semibold" style={{ fontSize: "var(--text-sm)" }}>{USER.since}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[#f5f5f5] p-5 md:p-6 flex flex-col gap-1">
            <div className="w-8 h-8 bg-[#1B4332]/[0.07] flex items-center justify-center mb-3">
              <s.Icon className="text-[#2D6A4F]" size={17} />
            </div>
            <p className="font-black text-black leading-none" style={{ fontSize: "clamp(1.35rem, 2.2vw, 2rem)" }}>
              {s.value}
            </p>
            <p className="text-black/55 font-semibold mt-1" style={{ fontSize: "var(--text-sm)" }}>{s.label}</p>
            <p className="text-black/30" style={{ fontSize: "var(--text-label)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Programs + Events */}
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <Card>
          <CardHeader title="Programs" meta="3 enrolled" />
          <div className="divide-y divide-black/[0.05]">
            {PROGRAMS.slice(0, 3).map((p) => (
              <div key={p.name} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dotCls}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black truncate" style={{ fontSize: "var(--text-sm)" }}>{p.name}</p>
                  <p className="text-black/35 mt-0.5" style={{ fontSize: "var(--text-label)" }}>{p.batch} · {p.date}</p>
                </div>
                <span className={`px-2.5 py-1 font-bold flex-shrink-0 text-[9px] ${p.badgeCls}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Upcoming Events" meta="4 this month" />
          <div className="divide-y divide-black/[0.05]">
            {EVENTS.slice(0, 3).map((e) => (
              <div key={e.title} className="flex items-start gap-3 px-6 py-4">
                <div className="w-8 h-8 bg-[#1B4332]/[0.06] flex-shrink-0 flex items-center justify-center mt-0.5">
                  <HiCalendar className="text-[#2D6A4F]" size={14} />
                </div>
                <div>
                  <p className="font-semibold text-black leading-snug" style={{ fontSize: "var(--text-sm)" }}>{e.title}</p>
                  <p className="text-black/35 mt-0.5" style={{ fontSize: "var(--text-label)" }}>{e.date} · {e.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <CardHeader title="Recent Activity" />
        <div className="divide-y divide-black/[0.05]">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <a.Icon className={`flex-shrink-0 ${a.color}`} size={17} />
              <p className="flex-1 text-black/65 font-medium" style={{ fontSize: "var(--text-sm)" }}>{a.text}</p>
              <p className="text-black/25 flex-shrink-0 whitespace-nowrap" style={{ fontSize: "var(--text-label)" }}>{a.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Section: My Business ───────────────────────────────────────────────── */
function MyBusiness() {
  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <p className="text-black/35 font-semibold uppercase tracking-[0.18em] mb-1" style={{ fontSize: "9px" }}>
              Business Profile
            </p>
            <h3 className="font-black text-black" style={{ fontSize: "var(--text-heading)" }}>{USER.business}</h3>
          </div>
          <button className="flex-shrink-0 inline-flex items-center gap-2 border border-[#1B4332] text-[#1B4332] font-bold px-5 py-2.5 hover:bg-[#1B4332] hover:text-white transition-all" style={{ fontSize: "var(--text-sm)" }}>
            Edit <HiArrowRight size={13} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12 mb-8">
          {[
            ["PRIME ID",     USER.primeId],
            ["Sector",       USER.sector],
            ["District",     USER.district],
            ["Entity type",  "Sole Proprietor"],
            ["Stage",        "Early revenue"],
            ["Member since", USER.since],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-black/30 font-medium mb-1" style={{ fontSize: "var(--text-label)" }}>{label}</p>
              <p className="font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-black/[0.06] pt-6">
          <p className="text-black/30 font-medium mb-2" style={{ fontSize: "var(--text-label)" }}>About</p>
          <p className="text-black/55 leading-[1.8]" style={{ fontSize: "var(--text-sm)" }}>
            Zero9 Farms is a food processing unit aimed at harnessing the richness of Meghalaya&apos;s natural
            resources. The enterprise produces jams, pickles, candies, and wines using locally sourced
            ingredients from South Garo Hills.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.06]">
        {[
          ["5",       "People Employed"],
          ["20",      "Lives Impacted"],
          ["₹5 Lakh", "Annual Turnover"],
          ["₹2 Lakh", "Funding Received"],
        ].map(([val, label]) => (
          <div key={label} className="bg-white px-6 py-6">
            <p className="font-black text-black leading-none mb-2" style={{ fontSize: "clamp(1.35rem, 2.2vw, 2rem)" }}>{val}</p>
            <p className="text-black/35 font-medium" style={{ fontSize: "var(--text-label)" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section: Programs ──────────────────────────────────────────────────── */
function Programs() {
  return (
    <Card>
      <div className="px-6 py-5 border-b border-black/[0.07]">
        <h3 className="font-black text-black" style={{ fontSize: "var(--text-body)" }}>All Programs</h3>
        <p className="text-black/40 mt-0.5" style={{ fontSize: "var(--text-sm)" }}>Your enrolment history and available programmes</p>
      </div>
      <div className="divide-y divide-black/[0.05]">
        {PROGRAMS.map((p) => (
          <div key={p.name} className="flex items-center gap-4 px-6 py-5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.dotCls}`} />
            <div className="flex-1">
              <p className="font-bold text-black" style={{ fontSize: "var(--text-sm)" }}>{p.name}</p>
              <p className="text-black/35 mt-0.5" style={{ fontSize: "var(--text-label)" }}>{p.batch} · {p.date}</p>
            </div>
            <span className={`px-3 py-1 font-bold text-[9px] ${p.badgeCls}`}>{p.status}</span>
            {p.status === "Available" && (
              <button className="text-[#2D6A4F] font-bold hover:text-[#1B4332] transition-colors flex-shrink-0" style={{ fontSize: "var(--text-sm)" }}>
                Apply →
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Section: Funding ───────────────────────────────────────────────────── */
function Funding() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-px bg-black/[0.06]">
        {[
          { label: "Total Received",  value: "₹2 Lakh", sub: "Government grants" },
          { label: "Processing",      value: "₹50,000", sub: "Pending disbursement" },
          { label: "External Funding",value: "N/A",     sub: "No external investors" },
        ].map((s) => (
          <div key={s.label} className="bg-white px-6 py-6">
            <p className="text-black/30 font-medium mb-2" style={{ fontSize: "var(--text-label)" }}>{s.label}</p>
            <p className="font-black text-black leading-none mb-1" style={{ fontSize: "clamp(1.35rem, 2.2vw, 2rem)" }}>{s.value}</p>
            <p className="text-black/30" style={{ fontSize: "var(--text-label)" }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader title="Funding History" />
        <div className="divide-y divide-black/[0.05]">
          {FUNDING.map((f) => (
            <div key={f.label} className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1">
                <p className="font-bold text-black" style={{ fontSize: "var(--text-sm)" }}>{f.label}</p>
                <p className="text-black/35 mt-0.5" style={{ fontSize: "var(--text-label)" }}>{f.date}</p>
              </div>
              <p className="font-black text-black" style={{ fontSize: "var(--text-body)" }}>{f.amount}</p>
              <span className={`px-3 py-1 font-bold text-[9px] ${f.badgeCls}`}>{f.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Section: Events ────────────────────────────────────────────────────── */
function Events() {
  return (
    <Card>
      <CardHeader title="Upcoming Events" />
      <div className="divide-y divide-black/[0.05]">
        {EVENTS.map((e) => (
          <div key={e.title} className="flex items-start gap-5 px-6 py-5">
            <div className="w-10 h-10 bg-[#1B4332]/[0.06] flex-shrink-0 flex items-center justify-center">
              <HiCalendar className="text-[#2D6A4F]" size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="font-bold text-black" style={{ fontSize: "var(--text-sm)" }}>{e.title}</p>
                <span className="bg-[#1B4332]/[0.06] text-[#2D6A4F] font-bold px-2.5 py-1 flex-shrink-0 text-[9px]">
                  {e.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1.5">
                <p className="text-black/40 flex items-center gap-1" style={{ fontSize: "var(--text-label)" }}>
                  <HiCalendar size={11} /> {e.date}
                </p>
                <p className="text-black/40 flex items-center gap-1" style={{ fontSize: "var(--text-label)" }}>
                  <HiLocationMarker size={11} /> {e.loc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Section: Documents ─────────────────────────────────────────────────── */
function Documents() {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-black/[0.07] flex items-center justify-between">
        <p className="font-bold text-black" style={{ fontSize: "var(--text-sm)" }}>Documents</p>
        <button className="inline-flex items-center gap-1.5 bg-[#1B4332] text-white font-bold px-4 py-2 hover:bg-[#2D6A4F] transition-colors" style={{ fontSize: "var(--text-label)" }}>
          + Upload
        </button>
      </div>
      <div className="divide-y divide-black/[0.05]">
        {DOCS.map((d) => (
          <div key={d.name} className="flex items-center gap-4 px-6 py-4">
            <HiDocumentText className="text-black/25 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{d.name}</p>
              {d.date !== "—" && (
                <p className="text-black/30 mt-0.5" style={{ fontSize: "var(--text-label)" }}>Uploaded {d.date}</p>
              )}
            </div>
            <span
              className={`px-3 py-1 font-bold text-[9px] ${
                d.status === "Verified"     ? "text-[#2D6A4F] bg-[#2D6A4F]/10" :
                d.status === "Pending"      ? "text-amber-600 bg-amber-50" :
                                              "text-black/35 bg-black/[0.05]"
              }`}
            >
              {d.status}
            </span>
            {d.status === "Verified" && (
              <button className="text-black/25 hover:text-black/55 transition-colors">
                <HiDownload size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Section: Support ───────────────────────────────────────────────────── */
function Support() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-black text-black mb-1" style={{ fontSize: "var(--text-body)" }}>Need help?</h3>
        <p className="text-black/40 mb-6" style={{ fontSize: "var(--text-sm)" }}>
          Our team is here to support you. Reach out through any channel below.
        </p>
        <div className="space-y-0 divide-y divide-black/[0.06]">
          {[
            { label: "PRIME Helpdesk",   value: "1800-XXX-XXXX",            sub: "Mon–Sat, 9 AM – 5 PM",          Icon: HiQuestionMarkCircle },
            { label: "Email support",    value: "support@primemeghalaya.com",sub: "Reply within 2 working days",   Icon: HiGlobe },
            { label: "Visit a PRIME Hub",value: "Find nearest hub →",        sub: "In-person assistance available", Icon: HiLocationMarker },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 py-5 first:pt-0">
              <div className="w-9 h-9 bg-[#1B4332]/[0.06] flex-shrink-0 flex items-center justify-center">
                <c.Icon className="text-[#2D6A4F]" size={17} />
              </div>
              <div>
                <p className="text-black/35 font-medium mb-0.5" style={{ fontSize: "var(--text-label)" }}>{c.label}</p>
                <p className="font-bold text-black" style={{ fontSize: "var(--text-sm)" }}>{c.value}</p>
                <p className="text-black/30 mt-0.5" style={{ fontSize: "var(--text-label)" }}>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="bg-[#1B4332]/[0.04] border border-[#1B4332]/10 p-5 flex items-start gap-4">
        <HiExclamationCircle className="text-[#2D6A4F] flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-[#1B4332] mb-1" style={{ fontSize: "var(--text-sm)" }}>Submit a grievance</p>
          <p className="text-black/45 mb-3" style={{ fontSize: "var(--text-sm)" }}>
            Formal complaints or disputes related to the PRIME programme.
          </p>
          <Link href="/grievance" className="text-[#2D6A4F] font-bold hover:text-[#1B4332] transition-colors" style={{ fontSize: "var(--text-sm)" }}>
            Go to Grievance Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard shell ────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [active, setActive]       = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function Sidebar({ onClose }: { onClose?: () => void }) {
    return (
      <aside className="w-64 bg-[#1B4332] flex flex-col h-full">
        {/* Logo row */}
        <div className="px-5 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/" onClick={onClose}>
            <Image
              src="/logo-white.png"
              alt="PRIME Meghalaya"
              width={120}
              height={38}
              className="h-7 w-auto object-contain object-left"
            />
          </Link>
          {onClose && (
            <button className="text-white/40 hover:text-white transition-colors" onClick={onClose}>
              <HiX size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => { setActive(id); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-5 py-3 font-semibold transition-all text-left group ${
                  isActive
                    ? "bg-white/[0.1] text-white border-l-2 border-[#74C69D]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.05] border-l-2 border-transparent"
                }`}
                style={{ fontSize: "var(--text-sm)" }}
              >
                <Icon size={17} className={isActive ? "text-[#74C69D]" : "group-hover:text-white/60"} />
                {label}
                {isActive && <HiChevronRight size={13} className="ml-auto text-white/20" />}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/[0.08] p-4 flex items-center gap-3">
          <div className="relative w-9 h-9 overflow-hidden bg-[#2D6A4F] flex-shrink-0 ring-1 ring-white/10">
            <Image src={USER.avatar} alt={USER.name} fill className="object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate leading-tight" style={{ fontSize: "var(--text-label)" }}>
              {USER.shortName}
            </p>
            <p className="text-white/30 truncate" style={{ fontSize: "var(--text-label)" }}>{USER.business}</p>
          </div>
          <Link href="/" className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0" title="Back to site">
            <HiLogout size={16} />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full flex flex-col shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-black/[0.07] px-5 md:px-8 h-14 flex items-center gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden text-black/40 hover:text-black transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <HiMenu size={22} />
          </button>
          <p className="flex-1 font-black text-black" style={{ fontSize: "var(--text-body)" }}>
            {PAGE_TITLE[active]}
          </p>
          <button className="relative text-black/30 hover:text-black/60 transition-colors p-1">
            <HiBell size={19} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#74C69D] rounded-full border border-white" />
          </button>
          <div className="relative w-8 h-8 overflow-hidden bg-[#2D6A4F] flex-shrink-0 ring-1 ring-black/10">
            <Image src={USER.avatar} alt={USER.name} fill className="object-cover object-top" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-5 md:px-8 py-6 md:py-8 overflow-y-auto">
          {active === "overview"  && <Overview />}
          {active === "business"  && <MyBusiness />}
          {active === "programs"  && <Programs />}
          {active === "funding"   && <Funding />}
          {active === "events"    && <Events />}
          {active === "documents" && <Documents />}
          {active === "support"   && <Support />}
        </main>
      </div>
    </div>
  );
}
