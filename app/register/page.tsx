"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiCheck, HiArrowRight, HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import { SECTOR_LABELS, DISTRICT_LABELS } from "@/lib/entrepreneurs-data";

/* ── Steps config ──────────────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: "About You" },
  { num: 2, label: "Business" },
  { num: 3, label: "Impact" },
  { num: 4, label: "Review" },
];

type FormData = {
  firstName: string;    lastName: string;    email: string;
  phone: string;        district: string;    gender: string;
  businessName: string; sector: string;      entityType: string;
  stage: string;        yearEstablished: string; address: string; description: string;
  employment: string;   livesImpacted: string;   turnover: string;
  govtFunding: string;  externalFunding: string; products: string; socialImpact: string;
  declared: boolean;    refNum: string;
};

const empty: FormData = {
  firstName: "", lastName: "", email: "", phone: "", district: "", gender: "",
  businessName: "", sector: "", entityType: "", stage: "", yearEstablished: "", address: "", description: "",
  employment: "", livesImpacted: "", turnover: "", govtFunding: "", externalFunding: "", products: "", socialImpact: "",
  declared: false, refNum: "",
};

/* ── Shared field components ───────────────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold text-black/60" style={{ fontSize: "var(--text-sm)" }}>
        {label}{required && <span className="text-[#2D6A4F] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white border border-black/12 px-4 py-3 text-black placeholder:text-black/20 focus:outline-none focus:border-[#2D6A4F] transition-colors";

/* ── Step sections ─────────────────────────────────────────────────────── */
function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="First name" required>
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} placeholder="e.g. Bitchri" value={data.firstName} onChange={e => set("firstName", e.target.value)} />
      </Field>
      <Field label="Last name" required>
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} placeholder="e.g. Marak" value={data.lastName} onChange={e => set("lastName", e.target.value)} />
      </Field>
      <Field label="Email address" required>
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="email" placeholder="you@example.com" value={data.email} onChange={e => set("email", e.target.value)} />
      </Field>
      <Field label="Phone number" required>
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="tel" placeholder="10-digit mobile number" value={data.phone} onChange={e => set("phone", e.target.value)} />
      </Field>
      <Field label="District" required>
        <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.district} onChange={e => set("district", e.target.value)}>
          <option value="">Select district</option>
          {Object.entries(DISTRICT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </Field>
      <Field label="Gender">
        <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.gender} onChange={e => set("gender", e.target.value)}>
          <option value="">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="non-binary">Non-binary</option>
        </select>
      </Field>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const years = Array.from({ length: 17 }, (_, i) => String(2026 - i));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Business / Enterprise name" required>
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} placeholder="e.g. Zero9 Farms" value={data.businessName} onChange={e => set("businessName", e.target.value)} />
      </Field>
      <Field label="Business sector" required>
        <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.sector} onChange={e => set("sector", e.target.value)}>
          <option value="">Select sector</option>
          {Object.entries(SECTOR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </Field>
      <Field label="Entity type" required>
        <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.entityType} onChange={e => set("entityType", e.target.value)}>
          <option value="">Select type</option>
          {["Sole Proprietor", "Partnership", "LLP", "Pvt. Ltd", "Self-Help Group", "Cooperative", "Other"].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </Field>
      <Field label="Business stage" required>
        <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.stage} onChange={e => set("stage", e.target.value)}>
          <option value="">Select stage</option>
          {["Idea Stage", "MVP", "Early Revenue", "In Revenue", "Growth Stage"].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </Field>
      <Field label="Year established">
        <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.yearEstablished} onChange={e => set("yearEstablished", e.target.value)}>
          <option value="">Select year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </Field>
      <Field label="Business address">
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} placeholder="Village / Town, District" value={data.address} onChange={e => set("address", e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="About your business" required>
          <textarea
            className={`${inputCls} resize-none`}
            style={{ fontSize: "var(--text-sm)" }}
            rows={4}
            placeholder="Describe what your business does, who you serve, and what makes it unique…"
            value={data.description}
            onChange={e => set("description", e.target.value)}
          />
          <p className="text-black/30 mt-1" style={{ fontSize: "var(--text-label)" }}>50–300 words recommended</p>
        </Field>
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="People directly employed">
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" placeholder="e.g. 5" value={data.employment} onChange={e => set("employment", e.target.value)} />
      </Field>
      <Field label="Lives indirectly impacted">
        <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" placeholder="e.g. 20" value={data.livesImpacted} onChange={e => set("livesImpacted", e.target.value)} />
      </Field>
      <Field label="Annual turnover (FY24–25)">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 font-medium" style={{ fontSize: "var(--text-sm)" }}>₹</span>
          <input className={`${inputCls} pl-7`} style={{ fontSize: "var(--text-sm)" }} placeholder="e.g. 5 Lakh" value={data.turnover} onChange={e => set("turnover", e.target.value)} />
        </div>
      </Field>
      <Field label="Government funding received">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 font-medium" style={{ fontSize: "var(--text-sm)" }}>₹</span>
          <input className={`${inputCls} pl-7`} style={{ fontSize: "var(--text-sm)" }} placeholder="e.g. 2 Lakh" value={data.govtFunding} onChange={e => set("govtFunding", e.target.value)} />
        </div>
      </Field>
      <Field label="External / private funding received">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 font-medium" style={{ fontSize: "var(--text-sm)" }}>₹</span>
          <input className={`${inputCls} pl-7`} style={{ fontSize: "var(--text-sm)" }} placeholder="N/A if none" value={data.externalFunding} onChange={e => set("externalFunding", e.target.value)} />
        </div>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Products / services offered" required>
          <textarea className={`${inputCls} resize-none`} style={{ fontSize: "var(--text-sm)" }} rows={3} placeholder="List your main products or services, separated by commas…" value={data.products} onChange={e => set("products", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Social impact — how does your business benefit the community?">
          <textarea className={`${inputCls} resize-none`} style={{ fontSize: "var(--text-sm)" }} rows={3} placeholder="Describe the positive change your business creates…" value={data.socialImpact} onChange={e => set("socialImpact", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-black/[0.06] last:border-0">
      <p className="text-black/40 font-medium" style={{ fontSize: "var(--text-sm)" }}>{label}</p>
      <p className="text-black font-medium" style={{ fontSize: "var(--text-sm)" }}>{value}</p>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-black/[0.08] mb-4">
      <div className="bg-[#f5f5f5] px-5 py-3 border-b border-black/[0.08]">
        <p className="font-bold text-black/70 uppercase tracking-[0.15em]" style={{ fontSize: "var(--text-label)" }}>{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

function Step4({ data, setDeclared }: { data: FormData; setDeclared: (v: boolean) => void }) {
  return (
    <div>
      <ReviewSection title="Personal Details">
        <ReviewRow label="Name" value={`${data.firstName} ${data.lastName}`} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Phone" value={data.phone} />
        <ReviewRow label="District" value={DISTRICT_LABELS[data.district] ?? data.district} />
        <ReviewRow label="Gender" value={data.gender} />
      </ReviewSection>
      <ReviewSection title="Business Details">
        <ReviewRow label="Business" value={data.businessName} />
        <ReviewRow label="Sector" value={SECTOR_LABELS[data.sector] ?? data.sector} />
        <ReviewRow label="Entity type" value={data.entityType} />
        <ReviewRow label="Stage" value={data.stage} />
        <ReviewRow label="Est. year" value={data.yearEstablished} />
        <ReviewRow label="Address" value={data.address} />
        <ReviewRow label="Description" value={data.description} />
      </ReviewSection>
      <ReviewSection title="Impact & Financials">
        <ReviewRow label="Employment" value={data.employment} />
        <ReviewRow label="Lives impacted" value={data.livesImpacted} />
        <ReviewRow label="Turnover" value={data.turnover ? `₹${data.turnover}` : ""} />
        <ReviewRow label="Govt. funding" value={data.govtFunding ? `₹${data.govtFunding}` : ""} />
        <ReviewRow label="External funding" value={data.externalFunding} />
        <ReviewRow label="Products" value={data.products} />
        <ReviewRow label="Social impact" value={data.socialImpact} />
      </ReviewSection>

      <label className="flex items-start gap-3 cursor-pointer mt-6">
        <div
          onClick={() => setDeclared(!data.declared)}
          className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-colors mt-0.5 cursor-pointer ${data.declared ? "bg-[#1B4332] border-[#1B4332]" : "border-black/25 bg-white"}`}
        >
          {data.declared && <HiCheck size={12} className="text-white" />}
        </div>
        <p className="text-black/50 leading-[1.65]" style={{ fontSize: "var(--text-sm)" }}>
          I declare that all information provided is accurate and complete to the best of my knowledge. I understand that providing false information may result in disqualification from PRIME programmes.
        </p>
      </label>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(key: keyof FormData, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function stepValid(s: number) {
    if (s === 1) return !!(data.firstName && data.lastName && data.email && data.phone && data.district);
    if (s === 2) return !!(data.businessName && data.sector && data.entityType && data.stage && data.description);
    if (s === 3) return !!(data.products);
    if (s === 4) return data.declared;
    return true;
  }

  function handleSubmit() {
    const ref = String(Math.floor(Math.random() * 9000) + 1000);
    setData((d) => ({ ...d, refNum: ref }));
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-8">
            <HiCheckCircle size={40} className="text-[#74C69D]" />
          </div>
          <h1 className="font-black text-black tracking-tight mb-3" style={{ fontSize: "var(--text-heading)" }}>
            Application submitted!
          </h1>
          <p className="text-black/50 leading-[1.75] mb-8" style={{ fontSize: "var(--text-body)" }}>
            Thank you, <strong className="text-black">{data.firstName}</strong>. Your application to PRIME has been received.
            Our team will review your details and reach out within 5–7 working days.
          </p>
          <div className="bg-white border border-black/[0.08] p-5 mb-8 text-left">
            <p className="text-black/40 font-medium mb-1" style={{ fontSize: "var(--text-label)" }}>Your application reference</p>
            <p className="font-black text-[#2D6A4F]" style={{ fontSize: "var(--text-body)" }}>
              PRIME-{data.district.toUpperCase().slice(0, 2)}-2026-{data.refNum}
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold px-8 py-3.5 hover:bg-[#2D6A4F] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Sign in to your dashboard <HiArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">

      {/* ── Hero banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#1B4332]">

        {/* Photo collage */}
        <div className="absolute inset-0 grid grid-cols-5 gap-0.5 pointer-events-none select-none">
          {[
            "Zero9Farms.jpg",
            "CasseyTurima1.jpg",
            "Shangkai4.jpg",
            "Sakhionaprofile.jpg",
            "Mawriegarments5.jpg",
            "RoseTegiteprofile.jpg",
            "Theteastorycp.jpg",
            "Medirahandloomprofile.jpg",
            "jets2.jpg",
            "larimikacp.jpg",
          ].map((img) => (
            <div key={img} className="relative h-52 md:h-64">
              <Image
                src={`/assets/entrepreneurs-directory/${img}`}
                alt=""
                fill
                className="object-cover object-top"
                sizes="20vw"
              />
            </div>
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[#1B4332]/[0.82]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/40 via-transparent to-[#1B4332]/80" />

        {/* Content */}
        <div className="relative z-10 px-6 lg:px-10">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4 border-b border-white/[0.08]">
            <Link href="/">
              <Image src="/logo-white.png" alt="PRIME Meghalaya" width={110} height={36} className="h-7 w-auto object-contain" />
            </Link>
            <p className="text-white/40" style={{ fontSize: "var(--text-sm)" }}>
              Already registered?{" "}
              <Link href="/login" className="text-[#74C69D] font-semibold hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Title */}
          <div className="py-10 md:py-12">
            <p className="font-semibold tracking-[0.22em] uppercase text-white/30 mb-3" style={{ fontSize: "var(--text-label)" }}>
              PRIME Meghalaya
            </p>
            <h1 className="font-black text-white tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
              Apply to PRIME
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">

        {/* ── Step progress ────────────────────────────────── */}
        <div className="flex items-center mb-12">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all ${
                    step > s.num
                      ? "bg-[#2D6A4F] text-white"
                      : step === s.num
                      ? "bg-[#1B4332] text-white"
                      : "bg-black/[0.06] text-black/30"
                  }`}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {step > s.num ? <HiCheck size={16} /> : s.num}
                </div>
                <p
                  className={`font-semibold whitespace-nowrap transition-colors ${step === s.num ? "text-black" : "text-black/30"}`}
                  style={{ fontSize: "var(--text-label)" }}
                >
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-5 transition-colors ${step > s.num ? "bg-[#2D6A4F]" : "bg-black/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Form card ────────────────────────────────────── */}
        <div className="bg-white border border-black/[0.08] p-6 md:p-8 mb-6">
          <h2 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Your business details"}
            {step === 3 && "Impact & financials"}
            {step === 4 && "Review your application"}
          </h2>
          <p className="text-black/40 mb-7" style={{ fontSize: "var(--text-sm)" }}>
            {step === 1 && "Basic personal information so we can get in touch with you."}
            {step === 2 && "Details about your enterprise — sector, stage, and what you do."}
            {step === 3 && "Employment, financials, and the impact your business creates."}
            {step === 4 && "Check everything looks right before you submit."}
          </p>

          {step === 1 && <Step1 data={data} set={set} />}
          {step === 2 && <Step2 data={data} set={set} />}
          {step === 3 && <Step3 data={data} set={set} />}
          {step === 4 && <Step4 data={data} setDeclared={(v) => setData((d) => ({ ...d, declared: v }))} />}
        </div>

        {/* ── Navigation buttons ───────────────────────────── */}
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 text-black/50 font-semibold hover:text-black transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              <HiArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button
              onClick={() => stepValid(step) && setStep((s) => s + 1)}
              disabled={!stepValid(step)}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold px-8 py-3.5 hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Continue <HiArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!stepValid(4) || loading}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold px-8 py-3.5 hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              ) : (
                <>Submit application <HiArrowRight size={16} /></>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-black/20 mt-8" style={{ fontSize: "var(--text-label)" }}>
          Government of Meghalaya · PRIME Programme · All data is kept confidential
        </p>
      </div>
    </div>
  );
}
