"use client";

import { useActionState } from "react";
import { inputCls, labelCls, errCls, btnCls } from "@/app/components/formStyles";
import { IDLE, fieldError } from "@/lib/forms";
import { LANGUAGES, MEGHALAYA_DISTRICTS, REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import { SECTOR_LABELS } from "@/lib/entrepreneurs-data";
import type { EditableProfile } from "@/lib/dal/profile";
import { updateProfileAction } from "../actions";

const ENTITY_TYPES = ["Sole Proprietor", "Partnership", "LLP", "Pvt. Ltd", "Self-Help Group", "Cooperative", "Other"];
const STAGES = ["Idea Stage", "MVP", "Early Revenue", "In Revenue", "Growth Stage"];
const SECTOR_ENTRIES = Object.entries(SECTOR_LABELS);

function Field({
  label, name, error, children, hint,
}: { label: string; name: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      {error && <p className={errCls}>{error}</p>}
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <p className="mt-1.5 flex h-11 items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">
        {value || "—"}
      </p>
    </div>
  );
}

export default function ProfileForm({ initial }: { initial: EditableProfile }) {
  const [state, action, pending] = useActionState(updateProfileAction, IDLE);
  const b = initial.business;
  const err = (name: string) => fieldError(state, name);

  return (
    <form action={action} className="space-y-8">
      {state.status === "success" && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          {state.message ?? "Saved."}
        </p>
      )}
      {state.status === "error" && state.formError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.formError}</p>
      )}

      {/* Your details */}
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-900">Your details</h2>

        <Field label="Full name" name="fullName" error={err("fullName")}>
          <input id="fullName" name="fullName" defaultValue={initial.fullName} className={inputCls} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <ReadonlyField label="Email" value={initial.email} />
          <Field label="Mobile number" name="mobile" error={err("mobile")}>
            <input id="mobile" name="mobile" inputMode="numeric" defaultValue={initial.mobile} className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gender" name="gender" error={err("gender")}>
            <select id="gender" name="gender" defaultValue={initial.gender} className={inputCls}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <ReadonlyField label="Date of birth" value={initial.dateOfBirth ?? "—"} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred language" name="preferredLanguage" error={err("preferredLanguage")}>
            <select id="preferredLanguage" name="preferredLanguage" defaultValue={initial.preferredLanguage} className={inputCls}>
              <option value="">Select</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="District" name="district" error={err("district")}>
            <select id="district" name="district" defaultValue={initial.district} className={inputCls}>
              <option value="">Select</option>
              {MEGHALAYA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        <ReadonlyField
          label="Registered as"
          value={initial.registrantType ? REGISTRANT_TYPE_LABELS[initial.registrantType] : "—"}
        />
      </section>

      {/* Business & impact */}
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Business &amp; impact</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {b ? "Update your venture and its impact figures." : "Add a business to track it on your dashboard. Leave blank if you don't run one."}
          </p>
        </div>

        <Field label="Business name" name="businessName" error={err("businessName")}>
          <input id="businessName" name="businessName" defaultValue={b?.businessName ?? ""} className={inputCls} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sector" name="sector" error={err("sector")}>
            <select id="sector" name="sector" defaultValue={b?.sector ?? ""} className={inputCls}>
              <option value="">Select sector</option>
              {SECTOR_ENTRIES.map(([key, lbl]) => <option key={key} value={key}>{lbl}</option>)}
            </select>
          </Field>
          <Field label="Entity type" name="entityType" error={err("entityType")}>
            <select id="entityType" name="entityType" defaultValue={b?.entityType ?? ""} className={inputCls}>
              <option value="">Select type</option>
              {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business stage" name="stage" error={err("stage")}>
            <select id="stage" name="stage" defaultValue={b?.stage ?? ""} className={inputCls}>
              <option value="">Select stage</option>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Year established" name="yearEstablished" error={err("yearEstablished")}>
            <input id="yearEstablished" name="yearEstablished" type="number" min="1900" max="2026" defaultValue={b?.yearEstablished ?? ""} className={inputCls} />
          </Field>
        </div>

        <Field label="Business address" name="address" error={err("address")}>
          <input id="address" name="address" defaultValue={b?.address ?? ""} className={inputCls} placeholder="Village / Town, District" />
        </Field>

        <Field label="About your business" name="description" error={err("description")}>
          <textarea id="description" name="description" rows={4} defaultValue={b?.description ?? ""} className={`${inputCls} h-auto py-2`} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="People directly employed" name="employment" error={err("employment")}>
            <input id="employment" name="employment" type="number" min="0" defaultValue={b?.employment ?? ""} className={inputCls} />
          </Field>
          <Field label="Lives indirectly impacted" name="livesImpacted" error={err("livesImpacted")}>
            <input id="livesImpacted" name="livesImpacted" type="number" min="0" defaultValue={b?.livesImpacted ?? ""} className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Annual turnover (₹)" name="turnover" error={err("turnover")} hint="Whole rupees">
            <input id="turnover" name="turnover" type="number" min="0" defaultValue={b?.turnover ?? ""} className={inputCls} placeholder="e.g. 500000" />
          </Field>
          <Field label="Govt. funding (₹)" name="govtFunding" error={err("govtFunding")} hint="Whole rupees">
            <input id="govtFunding" name="govtFunding" type="number" min="0" defaultValue={b?.govtFunding ?? ""} className={inputCls} placeholder="e.g. 200000" />
          </Field>
          <Field label="External funding (₹)" name="externalFunding" error={err("externalFunding")} hint="Whole rupees">
            <input id="externalFunding" name="externalFunding" type="number" min="0" defaultValue={b?.externalFunding ?? ""} className={inputCls} placeholder="0 if none" />
          </Field>
        </div>

        <Field label="Products / services offered" name="products" error={err("products")}>
          <textarea id="products" name="products" rows={3} defaultValue={b?.products ?? ""} className={`${inputCls} h-auto py-2`} />
        </Field>

        <Field label="Social impact — how does your business benefit the community?" name="socialImpact" error={err("socialImpact")}>
          <textarea id="socialImpact" name="socialImpact" rows={3} defaultValue={b?.socialImpact ?? ""} className={`${inputCls} h-auto py-2`} />
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={`${btnCls} w-auto px-6`}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.status === "success" && <span className="text-sm text-emerald-700">All changes saved.</span>}
      </div>
    </form>
  );
}
