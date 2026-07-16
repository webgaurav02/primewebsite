"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PrimeIdCardDTO } from "@/lib/dal/prime-id";
import type { PrimeIdIssueContext } from "@/lib/dal/prime-id";
import PrimeIdCard from "@/app/account/id-card/_components/PrimeIdCard";
import { issuePrimeIdAction } from "./actions";

type HolderType = "entrepreneur" | "mentor" | "other";
type Category = "startup" | "nano" | "livelihood";

const HOLDER_OPTIONS: { value: HolderType; label: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other / custom role" },
];
const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "startup", label: "Startup Entrepreneur" },
  { value: "nano", label: "Nano Entrepreneur" },
  { value: "livelihood", label: "Livelihood Entrepreneur" },
];

function addYearsIso(iso: string, years: number): string {
  const d = new Date(iso);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

export default function PrimeIdGeneratorClient({ ctx }: { ctx: PrimeIdIssueContext }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [holderType, setHolderType] = useState<HolderType>(ctx.suggestedHolderType);
  const [category, setCategory] = useState<Category>("startup");
  const [customRoleLabel, setCustomRoleLabel] = useState("");
  const [ventureName, setVentureName] = useState(ctx.ventureName ?? "");
  const [details, setDetails] = useState<{ label: string; value: string }[]>([]);

  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<PrimeIdCardDTO | null>(null);

  const alreadyHeld = Boolean(ctx.activeCredentialId);

  // Live preview card (no id/token yet → QR hidden, download suppressed).
  const previewCard: PrimeIdCardDTO = {
    id: "PRM-ML-—",
    fullName: ctx.fullName,
    holderType,
    customRoleLabel: holderType === "other" ? customRoleLabel : null,
    category: holderType === "entrepreneur" ? category : null,
    ventureName: ventureName || null,
    district: ctx.district,
    issueDate: today,
    validThru: addYearsIso(today, 5),
    status: "active",
    customDetails: details.filter((d) => d.label && d.value),
    verifyUrl: "",
    tokenFingerprint: "— not yet issued —",
    photoDataUrl: ctx.photoDataUrl,
  };

  function setDetail(i: number, key: "label" | "value", v: string) {
    setDetails((ds) => ds.map((d, j) => (j === i ? { ...d, [key]: v } : d)));
  }

  async function handleIssue() {
    setError(null);
    setIssuing(true);
    try {
      const res = await issuePrimeIdAction({
        userId: ctx.userId,
        holderType,
        category: holderType === "entrepreneur" ? category : null,
        customRoleLabel: holderType === "other" ? customRoleLabel : "",
        ventureName,
        customDetails: details.filter((d) => d.label && d.value),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setIssued(res.card);
      router.refresh(); // eligibility (picker, user detail) changes after issue
    } catch {
      setError("Something went wrong issuing the credential. Please try again.");
    } finally {
      setIssuing(false);
    }
  }

  if (issued) {
    return (
      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          PRIME ID <span className="font-semibold">{issued.id}</span> issued for{" "}
          <span className="font-semibold">{issued.fullName}</span>. They&apos;ve been notified and can
          download the card from their account.
        </div>
        <div className="flex justify-center">
          <PrimeIdCard card={issued} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-5">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Credential framing</p>
          <p className="mt-1 text-sm text-zinc-500">
            Name, district, and photo are taken from{" "}
            <span className="font-medium text-zinc-700">{ctx.fullName}</span>&apos;s profile.
          </p>

          {alreadyHeld && (
            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              This user already holds an active PRIME ID ({ctx.activeCredentialId}). Revoke it before
              issuing a new one.
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs text-zinc-500">Holder type</label>
              <select
                value={holderType}
                onChange={(e) => setHolderType(e.target.value as HolderType)}
                className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              >
                {HOLDER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {holderType === "entrepreneur" && (
              <div>
                <label className="block text-xs text-zinc-500">Entrepreneur category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                >
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}

            {holderType === "other" && (
              <div>
                <label className="block text-xs text-zinc-500">Custom role label</label>
                <input
                  value={customRoleLabel}
                  onChange={(e) => setCustomRoleLabel(e.target.value)}
                  placeholder="e.g. Government Official"
                  maxLength={40}
                  className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-zinc-500">Venture / enterprise name (optional)</label>
              <input
                value={ventureName}
                onChange={(e) => setVentureName(e.target.value)}
                maxLength={120}
                className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs text-zinc-500">Extra card details (optional, max 2)</label>
                {details.length < 2 && (
                  <button
                    type="button"
                    onClick={() => setDetails((ds) => [...ds, { label: "", value: "" }])}
                    className="text-xs font-medium text-zinc-600 underline hover:text-zinc-900"
                  >
                    + Add row
                  </button>
                )}
              </div>
              {details.map((d, i) => (
                <div key={i} className="mt-2 flex gap-2">
                  <input
                    value={d.label}
                    onChange={(e) => setDetail(i, "label", e.target.value)}
                    placeholder="Label"
                    maxLength={30}
                    className="w-1/3 rounded border border-zinc-300 px-2 py-1.5 text-sm"
                  />
                  <input
                    value={d.value}
                    onChange={(e) => setDetail(i, "value", e.target.value)}
                    placeholder="Value"
                    maxLength={60}
                    className="flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setDetails((ds) => ds.filter((_, j) => j !== i))}
                    className="rounded border border-zinc-300 px-2 text-sm text-zinc-500 hover:bg-zinc-100"
                    aria-label="Remove row"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            onClick={handleIssue}
            disabled={issuing || alreadyHeld}
            className="mt-5 w-full rounded-md bg-[#1B4332] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2D6A4F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {issuing ? "Issuing…" : "Issue PRIME ID"}
          </button>
          <p className="mt-2 text-center text-xs text-zinc-400">
            Issuing signs a government-recognized credential and notifies the holder.
          </p>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Card preview</p>
        <PrimeIdCard card={previewCard} preview />
      </div>
    </div>
  );
}
