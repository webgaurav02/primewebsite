"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { MODES, MODE_LABELS } from "@/lib/mentorship/types";
import { logSessionAction } from "../actions";

export default function LogSessionForm({ assignmentId, menteeName }: { assignmentId: string; menteeName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [durationMinutes, setDuration] = useState("60");
  const [mode, setMode] = useState<string>(MODES[0]);
  const [occurredAt, setOccurredAt] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await logSessionAction({
        assignmentId,
        durationMinutes: Number(durationMinutes),
        mode,
        occurredAt,
        notes,
      });
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
        Log a session
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <p className="text-xs font-medium text-zinc-500">Session with {menteeName}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`dur-${assignmentId}`} className={labelCls}>Minutes</label>
          <input
            id={`dur-${assignmentId}`}
            type="number"
            min={1}
            max={1440}
            value={durationMinutes}
            onChange={(e) => setDuration(e.target.value)}
            className={`mt-1.5 ${inputCls}`}
            required
          />
        </div>
        <div>
          <label htmlFor={`mode-${assignmentId}`} className={labelCls}>Mode</label>
          <select id={`mode-${assignmentId}`} value={mode} onChange={(e) => setMode(e.target.value)} className={`mt-1.5 ${inputCls}`}>
            {MODES.map((m) => (
              <option key={m} value={m}>{MODE_LABELS[m]}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`when-${assignmentId}`} className={labelCls}>When (optional)</label>
        <input id={`when-${assignmentId}`} type="date" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} className={`mt-1.5 ${inputCls}`} />
      </div>
      <div>
        <label htmlFor={`notes-${assignmentId}`} className={labelCls}>Notes (optional)</label>
        <textarea id={`notes-${assignmentId}`} value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`mt-1.5 ${inputCls}`} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnCls}>{pending ? "Saving…" : "Save session"}</button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100">Cancel</button>
      </div>
    </form>
  );
}
