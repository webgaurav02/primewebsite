"use client";

/* eslint-disable @next/next/no-img-element -- data-URL photo preview, no optimization possible */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiCheck, HiArrowRight, HiArrowLeft, HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from "react-icons/hi";
import { SECTOR_LABELS } from "@/lib/entrepreneurs-data";
import {
  REGISTRANT_TYPES,
  MEGHALAYA_DISTRICTS,
  LANGUAGES,
  HOW_HEARD,
} from "@/lib/users/types";
import { isMinorDob } from "@/lib/legal/policy";
import { registerAction } from "./actions";

type Data = {
  registrantType: string;
  firstName: string; lastName: string; email: string; mobile: string;
  district: string; gender: string; dateOfBirth: string;
  preferredLanguage: string; howHeard: string; photoDataUrl: string;
  password: string; confirmPassword: string;
  businessName: string; sector: string; entityType: string; stage: string;
  yearEstablished: string; address: string; description: string;
  employment: string; livesImpacted: string; turnover: string;
  govtFunding: string; externalFunding: string; products: string; socialImpact: string;
  guardianName: string; guardianRelationship: string;
  guardianConsent: boolean; consent: boolean;
};

const empty: Data = {
  registrantType: "",
  firstName: "", lastName: "", email: "", mobile: "", district: "", gender: "", dateOfBirth: "",
  preferredLanguage: "", howHeard: "", photoDataUrl: "",
  password: "", confirmPassword: "",
  businessName: "", sector: "", entityType: "", stage: "", yearEstablished: "", address: "", description: "",
  employment: "", livesImpacted: "", turnover: "", govtFunding: "", externalFunding: "", products: "", socialImpact: "",
  guardianName: "", guardianRelationship: "", guardianConsent: false, consent: false,
};

const inputCls =
  "w-full bg-white border border-black/12 px-4 py-3 text-black placeholder:text-black/20 focus:outline-none focus:border-[#2D6A4F] transition-colors";

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

type StepKey = "identity" | "about" | "business" | "impact" | "account" | "review";
const STEP_META: Record<StepKey, { label: string; title: string; blurb: string }> = {
  identity: { label: "You", title: "Who are you?", blurb: "This tailors the rest of your registration." },
  about: { label: "About", title: "About you", blurb: "Your details so PRIME can reach you." },
  business: { label: "Business", title: "Your business details", blurb: "Sector, stage, and what you do." },
  impact: { label: "Impact", title: "Impact & financials", blurb: "Employment, financials, and the impact you create." },
  account: { label: "Account", title: "Create your password", blurb: "Secure your PRIME account." },
  review: { label: "Review", title: "Review & consent", blurb: "Check everything, then agree to continue." },
};

function stepsFor(registrantType: string): StepKey[] {
  const business = registrantType === "entrepreneur_existing";
  return [
    "identity",
    "about",
    ...(business ? (["business", "impact"] as StepKey[]) : []),
    "account",
    "review",
  ];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState<Data>(empty);
  const [idx, setIdx] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => stepsFor(data.registrantType), [data.registrantType]);
  const current = steps[Math.min(idx, steps.length - 1)];
  const minor = isMinorDob(data.dateOfBirth);
  const today = new Date().toISOString().slice(0, 10);

  function set(key: keyof Data, value: string | boolean) {
    setData((d) => ({ ...d, [key]: value }));
  }

  // Clear any stale error when moving between steps so it can't bleed forward.
  const goBack = () => { setError(null); setIdx((i) => i - 1); };
  const goNext = () => { if (valid(current)) { setError(null); setIdx((i) => i + 1); } };

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return set("photoDataUrl", "");
    if (f.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => set("photoDataUrl", String(reader.result));
    reader.readAsDataURL(f);
  }

  function valid(step: StepKey): boolean {
    switch (step) {
      case "identity":
        return !!data.registrantType;
      case "about":
        return !!(
          data.firstName && data.lastName && EMAIL_RE.test(data.email) && /^\d{10}$/.test(data.mobile) &&
          data.district && data.gender && data.dateOfBirth && Date.parse(data.dateOfBirth) < Date.now() &&
          data.preferredLanguage && data.howHeard
        );
      case "business":
        return !!(data.businessName && data.sector && data.entityType && data.stage && data.description);
      case "impact":
        return !!data.products;
      case "account":
        return data.password.length >= 8 && data.password === data.confirmPassword;
      case "review":
        return data.consent && (!minor || (!!data.guardianName && !!data.guardianRelationship && data.guardianConsent));
    }
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    const res = await registerAction({
      registrantType: data.registrantType,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      mobile: data.mobile,
      preferredLanguage: data.preferredLanguage,
      district: data.district,
      howHeard: data.howHeard,
      photoDataUrl: data.photoDataUrl,
      consent: data.consent,
      guardianName: data.guardianName,
      guardianRelationship: data.guardianRelationship,
      guardianConsent: data.guardianConsent,
      businessName: data.businessName,
      sector: data.sector,
      entityType: data.entityType,
      stage: data.stage,
      yearEstablished: data.yearEstablished,
      address: data.address,
      description: data.description,
      employment: data.employment,
      livesImpacted: data.livesImpacted,
      turnover: data.turnover,
      govtFunding: data.govtFunding,
      externalFunding: data.externalFunding,
      products: data.products,
      socialImpact: data.socialImpact,
    });
    if (!res.ok) {
      setLoading(false);
      const first = Object.values(res.fieldErrors)[0]?.[0];
      setError(first ?? "Please review your details and try again.");
      return;
    }
    // Uniform for a new account AND a duplicate email: show a neutral confirmation.
    // A new account's session cookie is already set (the dashboard opens); a
    // duplicate has no session and got a "you already have an account" email.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-8">
            <HiCheckCircle size={40} className="text-[#74C69D]" />
          </div>
          <h1 className="font-black text-black tracking-tight mb-3" style={{ fontSize: "var(--text-heading)" }}>
            You&apos;re almost there
          </h1>
          <p className="text-black/50 leading-[1.75] mb-8" style={{ fontSize: "var(--text-body)" }}>
            We&apos;ve emailed <strong className="text-black">{data.email}</strong> a link from PRIME. Verify it to
            unlock applications — you can head to your dashboard now.
          </p>
          <button
            onClick={() => { router.push("/dashboard"); router.refresh(); }}
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold px-8 py-3.5 hover:bg-[#2D6A4F] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Go to your dashboard <HiArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-[#1B4332]">
        <div className="absolute inset-0 grid grid-cols-5 gap-0.5 pointer-events-none select-none">
          {["Zero9Farms.jpg","CasseyTurima1.jpg","Shangkai4.jpg","Sakhionaprofile.jpg","Mawriegarments5.jpg","RoseTegiteprofile.jpg","Theteastorycp.jpg","Medirahandloomprofile.jpg","jets2.jpg","larimikacp.jpg"].map((img) => (
            <div key={img} className="relative h-52 md:h-64">
              <Image src={`/assets/entrepreneurs-directory/${img}`} alt="" fill className="object-cover object-top" sizes="20vw" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[#1B4332]/[0.82]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/40 via-transparent to-[#1B4332]/80" />
        <div className="relative z-10 px-6 lg:px-10">
          <div className="flex items-center justify-between py-4 border-b border-white/[0.08]">
            <Link href="/">
              <Image src="/logo-white.png" alt="PRIME Meghalaya" width={110} height={36} className="h-7 w-auto object-contain" />
            </Link>
            <p className="text-white/40" style={{ fontSize: "var(--text-sm)" }}>
              Already registered?{" "}
              <Link href="/login" className="text-[#74C69D] font-semibold hover:text-white transition-colors">Sign in</Link>
            </p>
          </div>
          <div className="py-10 md:py-12">
            <p className="font-semibold tracking-[0.22em] uppercase text-white/30 mb-3" style={{ fontSize: "var(--text-label)" }}>
              PRIME Meghalaya
            </p>
            <h1 className="font-black text-white tracking-tight" style={{ fontSize: "var(--text-heading)" }}>
              Create your account
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">
        {/* Step progress */}
        <div className="flex items-center mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all ${
                    i < idx ? "bg-[#2D6A4F] text-white" : i === idx ? "bg-[#1B4332] text-white" : "bg-black/[0.06] text-black/30"
                  }`}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {i < idx ? <HiCheck size={16} /> : i + 1}
                </div>
                <p className={`font-semibold whitespace-nowrap transition-colors ${i === idx ? "text-black" : "text-black/30"}`} style={{ fontSize: "var(--text-label)" }}>
                  {STEP_META[s].label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-5 transition-colors ${i < idx ? "bg-[#2D6A4F]" : "bg-black/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white border border-black/[0.08] p-6 md:p-8 mb-6">
          <h2 className="font-black text-black mb-1.5" style={{ fontSize: "var(--text-body)" }}>{STEP_META[current].title}</h2>
          <p className="text-black/40 mb-7" style={{ fontSize: "var(--text-sm)" }}>{STEP_META[current].blurb}</p>

          {current === "identity" && (
            <Field label="I am registering as" required>
              <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.registrantType} onChange={(e) => set("registrantType", e.target.value)}>
                <option value="">Select any</option>
                {REGISTRANT_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </Field>
          )}

          {current === "about" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First name" required>
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} value={data.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </Field>
              <Field label="Last name" required>
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} value={data.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </Field>
              <Field label="Email address" required>
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="email" placeholder="you@example.com" value={data.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Mobile number" required>
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="tel" placeholder="10-digit mobile number" value={data.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </Field>
              <Field label="Date of birth" required>
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="date" max={today} value={data.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
              </Field>
              <Field label="Gender" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="District" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.district} onChange={(e) => set("district", e.target.value)}>
                  <option value="">Select district</option>
                  {MEGHALAYA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Preferred language" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.preferredLanguage} onChange={(e) => set("preferredLanguage", e.target.value)}>
                  <option value="">Select language</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="How did you hear about PRIME?" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.howHeard} onChange={(e) => set("howHeard", e.target.value)}>
                  <option value="">Select</option>
                  {HOW_HEARD.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Profile photo (optional)">
                  <div className="flex items-center gap-4">
                    {data.photoDataUrl && (
                      <img src={data.photoDataUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover ring-1 ring-black/10" />
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} className="text-black/60" style={{ fontSize: "var(--text-sm)" }} />
                  </div>
                  <p className="text-black/30 mt-1" style={{ fontSize: "var(--text-label)" }}>
                    Clear, front-facing headshot; face centred and well-lit. JPEG/PNG/WebP, under 5 MB.
                  </p>
                </Field>
              </div>
            </div>
          )}

          {current === "business" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Business / Enterprise name" required>
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} value={data.businessName} onChange={(e) => set("businessName", e.target.value)} />
              </Field>
              <Field label="Business sector" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.sector} onChange={(e) => set("sector", e.target.value)}>
                  <option value="">Select sector</option>
                  {Object.entries(SECTOR_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Entity type" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.entityType} onChange={(e) => set("entityType", e.target.value)}>
                  <option value="">Select type</option>
                  {["Sole Proprietor","Partnership","LLP","Pvt. Ltd","Self-Help Group","Cooperative","Other"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Business stage" required>
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.stage} onChange={(e) => set("stage", e.target.value)}>
                  <option value="">Select stage</option>
                  {["Idea Stage","MVP","Early Revenue","In Revenue","Growth Stage"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Year established">
                <select className={`${inputCls} bg-white`} style={{ fontSize: "var(--text-sm)" }} value={data.yearEstablished} onChange={(e) => set("yearEstablished", e.target.value)}>
                  <option value="">Select year</option>
                  {Array.from({ length: 17 }, (_, i) => String(2026 - i)).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="Business address">
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} placeholder="Village / Town, District" value={data.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="About your business" required>
                  <textarea className={`${inputCls} resize-none`} style={{ fontSize: "var(--text-sm)" }} rows={4} value={data.description} onChange={(e) => set("description", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {current === "impact" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="People directly employed">
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" value={data.employment} onChange={(e) => set("employment", e.target.value)} />
              </Field>
              <Field label="Lives indirectly impacted">
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" value={data.livesImpacted} onChange={(e) => set("livesImpacted", e.target.value)} />
              </Field>
              <Field label="Annual turnover (FY24–25, ₹)">
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" step="1" inputMode="numeric" placeholder="Whole rupees, e.g. 500000" value={data.turnover} onChange={(e) => set("turnover", e.target.value)} />
              </Field>
              <Field label="Government funding received (₹)">
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" step="1" inputMode="numeric" placeholder="Whole rupees, e.g. 200000" value={data.govtFunding} onChange={(e) => set("govtFunding", e.target.value)} />
              </Field>
              <Field label="External / private funding received (₹)">
                <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} type="number" min="0" step="1" inputMode="numeric" placeholder="Whole rupees, 0 if none" value={data.externalFunding} onChange={(e) => set("externalFunding", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Products / services offered" required>
                  <textarea className={`${inputCls} resize-none`} style={{ fontSize: "var(--text-sm)" }} rows={3} value={data.products} onChange={(e) => set("products", e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Social impact — how does your business benefit the community?">
                  <textarea className={`${inputCls} resize-none`} style={{ fontSize: "var(--text-sm)" }} rows={3} value={data.socialImpact} onChange={(e) => set("socialImpact", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {current === "account" && (
            <div className="grid grid-cols-1 gap-5">
              <Field label="Password" required>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25" size={18} />
                  <input
                    className={`${inputCls} pl-10 pr-11`} style={{ fontSize: "var(--text-sm)" }}
                    type={showPass ? "text" : "password"} autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={data.password} onChange={(e) => set("password", e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60" aria-label={showPass ? "Hide password" : "Show password"}>
                    {showPass ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm password" required>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25" size={18} />
                  <input
                    className={`${inputCls} pl-10`} style={{ fontSize: "var(--text-sm)" }}
                    type={showPass ? "text" : "password"} autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={data.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
                  />
                </div>
                {data.confirmPassword && data.confirmPassword !== data.password && (
                  <p className="text-[#b91c1c] mt-1" style={{ fontSize: "var(--text-label)" }}>Passwords do not match.</p>
                )}
              </Field>
            </div>
          )}

          {current === "review" && (
            <div className="space-y-6">
              <div className="border border-black/[0.08]">
                <div className="bg-[#f5f5f5] px-5 py-3 border-b border-black/[0.08]">
                  <p className="font-bold text-black/70 uppercase tracking-[0.15em]" style={{ fontSize: "var(--text-label)" }}>Your details</p>
                </div>
                <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2" style={{ fontSize: "var(--text-sm)" }}>
                  <p className="text-black/70"><span className="text-black/40">Name:</span> {data.firstName} {data.lastName}</p>
                  <p className="text-black/70"><span className="text-black/40">Email:</span> {data.email}</p>
                  <p className="text-black/70"><span className="text-black/40">Registering as:</span> {REGISTRANT_TYPES.find((r) => r.value === data.registrantType)?.label}</p>
                  <p className="text-black/70"><span className="text-black/40">District:</span> {data.district}</p>
                  {data.businessName && <p className="text-black/70 sm:col-span-2"><span className="text-black/40">Business:</span> {data.businessName}</p>}
                </div>
              </div>

              {minor && (
                <div className="border border-amber-200 bg-amber-50 p-5">
                  <p className="font-bold text-amber-900" style={{ fontSize: "var(--text-sm)" }}>Parental / guardian consent</p>
                  <p className="text-amber-800 mt-0.5" style={{ fontSize: "var(--text-label)" }}>
                    You appear to be under 18. A parent or guardian must consent for you to register.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <Field label="Guardian's full name" required>
                      <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} value={data.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
                    </Field>
                    <Field label="Relationship to you" required>
                      <input className={inputCls} style={{ fontSize: "var(--text-sm)" }} placeholder="e.g. Parent, Guardian" value={data.guardianRelationship} onChange={(e) => set("guardianRelationship", e.target.value)} />
                    </Field>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer mt-3">
                    <div onClick={() => set("guardianConsent", !data.guardianConsent)} className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center mt-0.5 ${data.guardianConsent ? "bg-[#1B4332] border-[#1B4332]" : "border-black/25 bg-white"}`}>
                      {data.guardianConsent && <HiCheck size={12} className="text-white" />}
                    </div>
                    <p className="text-amber-900/80 leading-[1.6]" style={{ fontSize: "var(--text-label)" }}>
                      As parent/guardian, I consent to this registration and to PRIME processing the child&apos;s data as described in the Privacy Notice.
                    </p>
                  </label>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <div onClick={() => set("consent", !data.consent)} className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center mt-0.5 ${data.consent ? "bg-[#1B4332] border-[#1B4332]" : "border-black/25 bg-white"}`}>
                  {data.consent && <HiCheck size={12} className="text-white" />}
                </div>
                <p className="text-black/50 leading-[1.65]" style={{ fontSize: "var(--text-sm)" }}>
                  I have read the{" "}
                  <Link href="/portal-privacy" target="_blank" className="font-semibold text-[#2D6A4F] underline">PRIME Portal Privacy Notice</Link>{" "}
                  and consent to PRIME (Dept. of Commerce &amp; Industries, Govt. of Meghalaya) collecting and processing my
                  personal data — including my optional photograph — to create and manage my account, verify my identity,
                  issue a PRIME ID if I request one, administer programmes I apply to, and send me related communications.
                </p>
              </label>
            </div>
          )}
        </div>

        {error && (
          <p className="mb-4 text-[#b91c1c]" style={{ fontSize: "var(--text-sm)" }} role="alert">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {idx > 0 ? (
            <button onClick={goBack} className="inline-flex items-center gap-2 text-black/50 font-semibold hover:text-black transition-colors" style={{ fontSize: "var(--text-sm)" }}>
              <HiArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}

          {current !== "review" ? (
            <button
              onClick={goNext}
              disabled={!valid(current)}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold px-8 py-3.5 hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Continue <HiArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!valid("review") || loading}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold px-8 py-3.5 hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : (
                <>Create account <HiArrowRight size={16} /></>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-black/20 mt-8" style={{ fontSize: "var(--text-label)" }}>
          Government of Meghalaya · PRIME Programme · Your data is processed per the Privacy Notice
        </p>
      </div>
    </div>
  );
}
