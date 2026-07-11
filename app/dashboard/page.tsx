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
  HiLogout, HiBookOpen, HiChevronDown,
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

/* ── Knowledge base data ────────────────────────────────────────────────── */
type KBArticle = { q: string; a: string };
type KBCategory = { id: string; label: string; articles: KBArticle[] };

const KB_CATEGORIES: KBCategory[] = [
  {
    id: "funding",
    label: "PRIME Entrepreneurship Funds",
    articles: [
      {
        q: "What are the PRIME Entrepreneurship Funds?",
        a: "The Government of Meghalaya recognises that access to funding and credit is a major constraint in the operations and scaling up of a business. PRIME provides easy access to various funding channels for entrepreneurs of Meghalaya — depending on their type of business, traction, status and industry. With the support of these funds and other support measures, PRIME is creating an enabling and nurturing ecosystem for entrepreneurship in Meghalaya.",
      },
      {
        q: "Who is eligible for PRIME Entrepreneurship Funding?",
        a: "Any registered (e.g. Pvt. Ltd., LLP, OPC, Sole Proprietorship) and unregistered entrepreneur and community-driven enterprise (e.g. IVCS, PG, SHG) may apply for funding on the PRIME portal. Entrepreneurs who have applied for and received a PRIME ID and have been classified as Startup Entrepreneurs or Nano Entrepreneurs can apply for funding. Entrepreneurs are advised to read the profiles of the individual funding vehicles diligently to understand whether they are eligible for their specific type of business.",
      },
      {
        q: "How do I select the right funding option?",
        a: "For existing businesses, three options are available:\n\n1) PRIME Kickstart Grant — For innovative/unique businesses. Used only for R&D and product development. Up to ₹5 Lakhs, non-returnable grant.\n\n2) PRIME Innovation Scaleup Loan — For existing businesses wanting to scale up or extend operations (e.g. new warehouse, machinery). Up to ₹25 Lakhs, interest-free, collateral-free loan, 5-year term, 6-month moratorium. Requires full-time commitment.\n\n3) NESFB Zero-Interest Loan I — For existing food processing entrepreneurs scaling up. Up to ₹25 Lakhs, interest-free, collateral-free, up to 4-year term, 6-month moratorium.\n\nFor aspiring entrepreneurs starting a new food processing business, NESFB Zero-Interest Loan II is available for up to ₹5 Lakhs on the same terms.\n\nAll funds are only available for entrepreneurs and businesses residing within Meghalaya. Preference is given to registered companies (Pvt. Ltd., OPC, LLP) and registered organisations (Societies, Trusts, Section-8).",
      },
      {
        q: "How can I apply? How do I fill the application form?",
        a: "The application process is through a single window on the PRIME website for all funding options. Application windows are open for a fixed period (e.g. 2 months) before closing for processing. After evaluations and disbursals are complete, the window reopens. Follow PRIME on Social Media and subscribe to the newsletter to get updates.\n\nThe application form is split in two parts. Part 1 is a general description of the project, filled directly on the website. Part 2 is a detailed project plan with financials, filled in a downloadable Excel template which is then uploaded. Key fields include: funding option selected, project title, PRIME ID (auto-filled), total investment amount, own contribution, amount requested, project location, and a project description.",
      },
      {
        q: "How is the evaluation done? How long until disbursal?",
        a: "After closing of the application window, the PRIME team reviews all applications. After an initial completeness check, applications are sorted by fund type. For funds processed directly through PRIME, a multi-stage review and evaluation takes place — including a jury of senior government officers and banking/industry professionals who score applications against a predefined evaluation matrix. For funds processed through partners, those partners run their own evaluation.\n\nPRIME strives to give feedback to rejected applicants on what can be improved. The full review, evaluation and disbursal process may take up to eight weeks or more depending on information collection and total applications received. Women entrepreneurs, specially-abled and grass-root level entrepreneurs receive preferential treatment.",
      },
      {
        q: "What are the criteria for PRIME Funding Applicants?",
        a: "Key criteria include:\n• Entrepreneur cannot apply for both the PRIME Kickstart Grant and the Innovation Scaleup Loan at the same time.\n• Only one member from a family is eligible for the scheme.\n• Individual applicants must be above 18 and below 60 years of age.\n• Only permanent residents of Meghalaya can avail funding. In partnerships, majority share (51%+) must be held by Meghalaya residents.\n• Government employees are not eligible.\n• Applicants for the Innovation Scaleup Loan must have an existing business in Meghalaya with demonstrable traction or revenues.\n• Departmental stores, Kirana stores, general stores or similar reselling businesses are not eligible.\n• Entrepreneurs who have previously received the Kickstart Grant cannot re-apply for the same.\n• Utilization period for both grants and loans is a maximum of 18 months. Utilization certificates with original bills must be provided.\n• Diversion of funds without explanation will result in an immediate 15% interest charge.",
      },
      {
        q: "What documentation do entrepreneurs provide after funds are disbursed?",
        a: "Entrepreneurs selected for funding must provide comprehensive documentation on how they utilise the funds — for example, invoices and bills. Many selected entrepreneurs also participate in a coaching programme where experienced industry professionals guide them towards efficient and sustainable utilisation of funds. All funded entrepreneurs are obliged to regularly deliver status reports and update the PRIME team with the latest revenue, employment and other company figures.",
      },
      {
        q: "How does the PRIME Student Tinkering Fund work?",
        a: "Eligibility: Only students from academic institutes financially supported through PRIME and the EPDP (Entrepreneurship Promotion and Development Programme) are eligible. Institutes become eligible after receiving a sanction letter from PRIME/MBMA, completing the official EPDP inauguration, and signing the MoU.\n\nStudents must be regularly enrolled in Meghalaya. Individual students may only apply once per project, and a group cannot submit multiple applications for the same project. Maximum project duration is 6 months or one academic semester, whichever is longer.\n\nProcess: The institute prepares and pre-screens applications → forwards promising ones to PRIME → PRIME Selection Committee screens and scores → funds sanctioned or feedback provided → institute provides ongoing support → reporting and follow-up.\n\nSix funding cycles are conducted every year, with cutoff dates on the 30th of alternating months (Sep, Nov, Jan, Mar, May, Jul). Applications scoring 51+ points (out of 100) are approved.",
      },
    ],
  },
  {
    id: "skills",
    label: "Entrepreneurship Skills",
    articles: [
      {
        q: "What are the state-supported incubators and accelerators in Meghalaya?",
        a: "The Government of Meghalaya currently supports several incubators and accelerators in the state. PRIME is actively working on expanding the incubator ecosystem by enabling colleges, universities and other organisations to establish new incubators across the state. For the most up-to-date list of supported incubators, visit the Incubation section on the PRIME website or contact your nearest PRIME Startup Hub in Shillong, Tura, or Nongpoh.",
      },
      {
        q: "How can an entrepreneur avail incubation support?",
        a: "Every year PRIME identifies the most promising entrepreneurs of the state through the Chief Minister's E-Champion Challenge. Applications are open once a year via the PRIME portal for a 6-week window. Applications are evaluated anonymously across five parameters: innovation, market potential, social impact, revenue model, and business model.\n\nThe top 100 applicants advance to a pitching phase (pitch deck, pitch video, and a 5-minute live pitch with 10-minute Q&A before a jury of entrepreneurs, government officials and industry professionals). The top 75 are then selected for incubation over a period of 9 months.\n\nFollow PRIME on Social Media and subscribe to the newsletter for announcements of the next application window.",
      },
      {
        q: "How can an entrepreneur avail mentoring support?",
        a: "PRIME has two layers of mentoring:\n\n1) Closed mentoring — exclusively for entrepreneurs in the incubation, pre-incubation and acceleration programmes under PRIME. This mentoring is customised, coordinated and scheduled by the PRIME team as per each entrepreneur's individual incubation plan.\n\n2) Public mentoring — accessible to every entrepreneur in Meghalaya who is registered on the Entrepreneur Portal and has received a PRIME ID and classification as a Startup, Nano or Livelihood Entrepreneur. These mentors are available free-of-cost. A call can be requested via the Entrepreneur Portal.",
      },
      {
        q: "What government departments offer support for entrepreneurs?",
        a: "PRIME collaborates closely with many Government Departments in the state to build a comprehensive entrepreneurship ecosystem. The Meghalaya State Skills Development Society (MSSDS) under the Ministry of Skill Development and Entrepreneurship offers empanelment of entrepreneurs as Training Providers (website: mssds.nic.in). More details about individual department support offerings are available on the respective department websites. Visit the PRIME portal or contact support@primemeghalaya.com for the latest list of partner departments.",
      },
    ],
  },
  {
    id: "general",
    label: "General & Others",
    articles: [
      {
        q: "What are the different classifications of entrepreneurs when registering for a PRIME ID?",
        a: "Eligible Entrepreneurs in Meghalaya are classified into three types during PRIME ID registration, based on the details provided:\n\nStartup Entrepreneur — Innovation-based businesses with unique, value-added products or services. Have the potential to grow beyond 20 employees and scale beyond Meghalaya. Examples: EduTech platforms, innovative food products using local produce, new manufacturing technologies, e-commerce platforms for local artisans.\n\nNano Entrepreneur — Non-innovation based businesses that utilise local resources to solve local needs, typically employing up to 20 people within the local village, block or district. Examples: homestays, food processing units, bakeries, bamboo crafts, adventure sports operators.\n\nLivelihood Entrepreneur — Solo entrepreneurs operating at a very local level to cover family livelihood needs. Examples: farming, weaving, livestock rearing.\n\nIt is critical to provide an elaborate description and pictures of your products/services during registration, as the classification is based on the information you provide.",
      },
      {
        q: "What is the definition and criteria for a Startup recognition in Meghalaya?",
        a: "Under the PRIME programme, a Startup is defined as an entity where:\n\n• The date of incorporation, registration, or commencement of commercial operations is not prior to seven years.\n• Annual turnover does not exceed ₹25 crore for any preceding financial year.\n• The startup is working towards innovation/improvement of existing products, services and processes, and has the potential to generate employment or create wealth.\n• It is registered in Meghalaya, or employs at least 60% of its total qualified workforce from Meghalaya (excluding contract employees).\n• It is not an extension of an existing family business or formed by splitting/reconstruction of an existing business.\n\nStartups can be in any form of registered or unregistered entity, with the intention to formalise and incorporate within a reasonable timeframe.",
      },
      {
        q: "What state-level approvals and clearances are required to operate a Startup in Meghalaya?",
        a: "Every entrepreneur/startup adhering to the official PRIME definition may register on the Entrepreneur Portal for recognition as a Startup. You will need to upload details about your products and a short description of your business and its innovative features. The startup will be evaluated and assigned to one of three categories (Startup, Nano Entrepreneur, Livelihood Entrepreneur).\n\nOnce you receive your PRIME ID and are categorised as 'Startup', you are officially recognised by the state and will receive a Meghalaya Startup Certificate and access to various support measures. There are no further separate state-level approvals or clearances required to operate a startup in Meghalaya.",
      },
      {
        q: "What special incentives are provided to women entrepreneurs and grass-root level innovators?",
        a: "PRIME has instituted special inclusive provisions:\n\nWomen-Led Startups: A women-led startup is one recognised by the Government of Meghalaya under PRIME with at least one woman as founder, co-founder, and/or CXO. 20% of incubation seats (10 out of 50) and 20% of the PRIME Kickstart Grant and Innovation Scaleup Loan funds are reserved for women-led startups.\n\nGrass-Root Level Innovators: A grass-root level innovator is a startup working towards low-cost, commercially viable innovation aimed at improving productivity, infrastructure, living conditions, employment, livelihood or community facilities in a rural context. 20% of incubation seats (10 out of 50) and 10% of the PRIME Kickstart Grant and Innovation Scaleup Loan funds are reserved for such innovators. Additional support includes capacity building, mentoring, office/co-working space and marketing support.",
      },
      {
        q: "What are the modalities to apply for office or co-working space at the PRIME Startup Hubs?",
        a: "Every entrepreneur with a PRIME ID may apply for office and/or co-working space at the PRIME Startup Hubs in Shillong, Tura, or Nongpoh. Applications must be submitted via the Entrepreneur Portal only.\n\nDedicated Office Chambers: Minimum 75% occupancy on a monthly average; reviewed every 3 months. Standard occupancy period is 6 months, renewable once for up to 1 year in total.\n\nFlexible Coworking Space: No dedicated seats; first-come-first-serve. Maximum 5 team members from one startup. Minimum 3–4 visits per month expected. Standard period is 6 months, renewable once.\n\nMeeting Rooms/Auditoriums: Bookable on an ad-hoc basis via the Hub frontdesk for meetings, training or events.\n\nAll facilities are currently free-of-cost, subject to revision with 4 weeks' advance notice. Some services (printing, refreshments) may be chargeable. Note: the PRIME Startup Hub address cannot currently be used for company registration.",
      },
      {
        q: "What are the terms and requirements to register as a mentor under PRIME?",
        a: "PRIME is keen on onboarding seasoned entrepreneurs and experienced industry professionals as mentors. Mentors from across India may register. The onboarding process includes a short 30-minute call with a PRIME team member.\n\nMentoring under PRIME is at zero cost to entrepreneurs. Mentors provide their support on a voluntary, unremunerated basis. While there is no minimum hour requirement, PRIME mentors typically spend around 1–2 hours per week. PRIME provides a Mentor Certificate after completing a total of 5 mentoring hours (self-certified basis).",
      },
      {
        q: "What public procurement support is available through PRIME?",
        a: "Meghalaya's Startup Policy of 2018 mandates that 20% of all public procurement shall be through Startups. PRIME includes the following relaxations in all its tenders and RFPs:\n\n• Prior turnover and prior experience requirements may be relaxed for Startups registered in Meghalaya (subject to quality and technical specifications).\n• Startups duly registered in Meghalaya are exempted from submission of EMD (Earnest Money Deposit).\n\nAdditionally, PRIME facilitates between entrepreneurs and government departments/organisations that have not included Startup relaxations in their tenders. To request PRIME's support, apply for a PRIME ID and submit a grievance under the 'Public Procurement' category with the full details of the tender/RFP.",
      },
      {
        q: "How can I submit a grievance? How will it be addressed?",
        a: "Grievances can be submitted via the Entrepreneur Portal after registering. The escalation process is:\n\nLevel 0 — PRIME Administrative Team (within 40 days): The team registers the complaint, evaluates it and sends a notification of receipt within 10 days. The grievance is then forwarded to the relevant officer, department or location for resolution within a further 30 days.\n\nLevel 1 — Programme Heads, PRIME Meghalaya (within 30 days): If unresolved at Level 0, it escalates to the respective Programme Head.\n\nLevel 2 — Director, MBMA/MIE (within 30 days): If unresolved at Level 1, it escalates to the Director of MBMA/MIE.\n\nLevel 3 — CEO, MBMA (within 60 days): The final escalation for unresolved grievances. PRIME is committed to resolving all justified grievances transparently and at the earliest opportunity.",
      },
      {
        q: "How does the PRIME Entrepreneurship Ambassador Contest work?",
        a: "The PRIME Entrepreneurship Ambassador Contest invites the youth of Meghalaya to promote entrepreneurship across their communities. The objective is to motivate more youth to consider entrepreneurship as a career.\n\nHow to enter: Create a video (minimum 2 minutes) showing how you promote entrepreneurship awareness in your community, school, or college. Upload it on Facebook and Instagram, tag @primemeghalaya, and use hashtags #primemeghalaya and #meghapreneurs.\n\nExample activities: An awareness session with a local entrepreneur; a hackathon or 'Shark Tank'-style ideathon at your school/college; a music video about the benefits of entrepreneurship; showcasing successful Meghalaya entrepreneurs to your community.\n\nSelection criteria: Creativity, quality of video editing, number of Social Media shares, and the level of awareness created. Winners are announced via the PRIME Social Media channels.",
      },
    ],
  },
];

/* ── Types & nav config ─────────────────────────────────────────────────── */
type Section = "overview" | "business" | "programs" | "funding" | "events" | "documents" | "knowledge" | "support";

const NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",        Icon: HiHome },
  { id: "business",  label: "My Business",     Icon: HiBriefcase },
  { id: "programs",  label: "Programs",        Icon: HiAcademicCap },
  { id: "funding",   label: "Funding",         Icon: HiCurrencyRupee },
  { id: "events",    label: "Events",          Icon: HiCalendar },
  { id: "documents", label: "Documents",       Icon: HiDocumentText },
  { id: "knowledge", label: "Knowledge Base",  Icon: HiBookOpen },
  { id: "support",   label: "Support",         Icon: HiQuestionMarkCircle },
];

const PAGE_TITLE: Record<Section, string> = {
  overview: "Overview", business: "My Business", programs: "Programs",
  funding: "Funding",   events: "Events",        documents: "Documents",
  knowledge: "Knowledge Base", support: "Support",
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

/* ── Section: Knowledge Base ────────────────────────────────────────────── */
function KnowledgeBase() {
  const [activeCat, setActiveCat] = useState(KB_CATEGORIES[0].id);
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const category = KB_CATEGORIES.find(c => c.id === activeCat) ?? KB_CATEGORIES[0];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="font-black text-black" style={{ fontSize: "var(--text-body)" }}>
          Knowledge Base
        </h2>
        <p className="text-black/40 mt-1" style={{ fontSize: "var(--text-sm)" }}>
          Answers to common questions about PRIME programmes, funding, and entrepreneurship in Meghalaya.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {KB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCat(cat.id); setOpenArticle(null); }}
            className={`px-4 py-2 font-bold transition-all ${
              activeCat === cat.id
                ? "bg-[#1B4332] text-white"
                : "bg-white border border-black/[0.1] text-black/50 hover:text-black hover:border-black/25"
            }`}
            style={{ fontSize: "var(--text-label)" }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="divide-y divide-black/[0.06] border border-black/[0.07] bg-white">
        {category.articles.map((article, idx) => {
          const key = `${activeCat}-${idx}`;
          const isOpen = openArticle === key;
          return (
            <div key={key}>
              <button
                onClick={() => setOpenArticle(isOpen ? null : key)}
                className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-black/[0.02] transition-colors group"
              >
                <p
                  className={`font-semibold leading-snug flex-1 transition-colors ${isOpen ? "text-[#1B4332]" : "text-black/80 group-hover:text-black"}`}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {article.q}
                </p>
                <span className={`flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2D6A4F]" : "text-black/25"}`}>
                  <HiChevronDown size={18} />
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 border-t border-black/[0.05]">
                  <div className="pt-4 text-black/55 leading-[1.85] whitespace-pre-line" style={{ fontSize: "var(--text-sm)" }}>
                    {article.a}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer prompt */}
      <div className="bg-[#1B4332]/[0.04] border border-[#1B4332]/10 p-5 flex items-start gap-4">
        <HiQuestionMarkCircle className="text-[#2D6A4F] flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-[#1B4332] mb-1" style={{ fontSize: "var(--text-sm)" }}>
            Can&apos;t find what you&apos;re looking for?
          </p>
          <p className="text-black/45 mb-3" style={{ fontSize: "var(--text-sm)" }}>
            Reach our team on the Support tab or visit your nearest PRIME Startup Hub in Shillong, Tura, or Nongpoh.
          </p>
          <Link href="/contact" className="text-[#2D6A4F] font-bold hover:text-[#1B4332] transition-colors" style={{ fontSize: "var(--text-sm)" }}>
            Contact PRIME →
          </Link>
        </div>
      </div>

    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────── */
function Sidebar({ active, setActive, onClose }: { active: Section; setActive: (s: Section) => void; onClose?: () => void }) {
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

/* ── Dashboard shell ────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [active, setActive]       = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar active={active} setActive={setActive} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full flex flex-col shadow-2xl">
            <Sidebar active={active} setActive={setActive} onClose={() => setSidebarOpen(false)} />
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
          {active === "knowledge" && <KnowledgeBase />}
          {active === "support"   && <Support />}
        </main>
      </div>
    </div>
  );
}
