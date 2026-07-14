"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { applyAction } from "../actions";

/**
 * Progressive-disclosure apply form: a cycle row reveals this on "Apply". Calls
 * the server action directly; the DAL enforces cycle-open + one-per-cycle.
 */
export default function ApplyForm({ cycleId, cycleLabel }: { cycleId: string; cycleLabel: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [objective, setObjective] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await applyAction({ cycleId, summary, objective });
      if (!res.ok) {
        setError(res.error ?? "Something went wrong.");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-[#2D6A4F] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#245a42]"
      >
        Apply
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <p className="text-xs font-medium text-zinc-500">Applying to {cycleLabel}</p>
      <div>
        <label htmlFor={`summary-${cycleId}`} className={labelCls}>Briefly, what is your venture?</label>
        <textarea
          id={`summary-${cycleId}`}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className={`mt-1.5 ${inputCls}`}
          required
        />
      </div>
      <div>
        <label htmlFor={`objective-${cycleId}`} className={labelCls}>What do you hope to gain?</label>
        <textarea
          id={`objective-${cycleId}`}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          rows={2}
          className={`mt-1.5 ${inputCls}`}
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? "Submitting…" : "Submit application"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
