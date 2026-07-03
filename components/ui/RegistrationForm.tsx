"use client";

import { useState } from "react";

type Field = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  span?: "full";
};

interface RegistrationFormProps {
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel?: string;
  formspreeEndpoint?: string;
}

export default function RegistrationForm({
  title,
  subtitle,
  fields,
  submitLabel = "Submit Application",
}: RegistrationFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (id: string, val: string) =>
    setValues((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate submission — wire up to Formspree/API when ready
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  };

  const inputCls =
    "w-full px-4 py-3.5 border border-black/[0.1] bg-white text-black placeholder:text-black/30 focus:outline-none focus:border-[#2D6A4F] transition-colors duration-200";
  const labelCls = "block font-semibold text-black/50 mb-2";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center bg-[#74C69D]/20 mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-black text-black mb-3" style={{ fontSize: "var(--text-heading)" }}>
          Application received
        </h3>
        <p className="text-black/45 max-w-sm" style={{ fontSize: "var(--text-body)" }}>
          Thank you — the PRIME team will review your submission and be in touch within 5 working days.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24 items-start">
      {/* Left — context */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <span className="w-8 h-px bg-[#2D6A4F]" />
          <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
            Registration
          </p>
        </div>
        <h2 className="font-black text-black leading-[0.9] tracking-tight mb-6" style={{ fontSize: "var(--text-heading)" }}>
          {title}
        </h2>
        <p className="text-black/45 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
          {subtitle}
        </p>
      </div>

      {/* Right — form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.id} className={f.span === "full" ? "sm:col-span-2" : ""}>
              <label htmlFor={f.id} className={labelCls} style={{ fontSize: "var(--text-label)" }}>
                {f.label}{f.required && <span className="text-[#2D6A4F] ml-0.5">*</span>}
              </label>
              {f.type === "select" ? (
                <select
                  id={f.id}
                  required={f.required}
                  value={values[f.id] ?? ""}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  className={inputCls + " appearance-none cursor-pointer"}
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  <option value="" disabled>Select an option</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  id={f.id}
                  required={f.required}
                  rows={5}
                  placeholder={f.placeholder}
                  value={values[f.id] ?? ""}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  className={inputCls + " resize-none"}
                  style={{ fontSize: "var(--text-sm)" }}
                />
              ) : (
                <input
                  id={f.id}
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.id] ?? ""}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  className={inputCls}
                  style={{ fontSize: "var(--text-sm)" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-9 py-4 bg-[#1B4332] text-white font-bold hover:bg-[#2D6A4F] transition-colors disabled:opacity-50"
            style={{ fontSize: "var(--text-sm)" }}
          >
            {status === "sending" ? "Sending…" : submitLabel}
          </button>
          <p className="mt-4 text-black/30" style={{ fontSize: "var(--text-label)" }}>
            Fields marked <span className="text-[#2D6A4F]">*</span> are required
          </p>
        </div>
      </form>
    </div>
  );
}
