"use client";

import { useActionState } from "react";
import { trackAction, type TrackState } from "../actions";
import { CATEGORY_LABELS, type GrievanceCategory } from "@/lib/grievance/types";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const inputCls =
  "h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

export default function TrackForm() {
  const [state, action, pending] = useActionState<TrackState, FormData>(trackAction, { status: "idle" });

  const result = state.status === "done" ? state.result : null;

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <label htmlFor="ref" className="text-sm font-medium text-zinc-900">Ticket reference</label>
          <input id="ref" name="ref" placeholder="PRM-KJ-0001" className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-zinc-900">Email used when submitting</label>
          <input id="email" name="email" type="email" className={`mt-1.5 ${inputCls}`} />
        </div>
        <button type="submit" disabled={pending} className="inline-flex h-11 w-full items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60">
          {pending ? "Checking…" : "Track grievance"}
        </button>
      </form>

      {state.status === "rate_limited" && (
        <p className="rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
          Too many checks. Please wait a minute and try again.
        </p>
      )}

      {result && !result.found && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          No grievance matches that reference and email. Check both and try again.
        </p>
      )}

      {result && result.found && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm font-semibold">{result.ticketRef}</p>
            <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white">
              {STATUS_LABEL[result.status!] ?? result.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {CATEGORY_LABELS[result.category as GrievanceCategory] ?? result.category} · Submitted {fmt(result.createdAt!)}
            {result.escalationLevel ? ` · Escalated to L${result.escalationLevel}` : ""}
          </p>

          <ol className="mt-5 space-y-0">
            {(result.history ?? []).map((h, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2D6A4F]" />
                  {i < (result.history?.length ?? 0) - 1 && <span className="w-px flex-1 bg-zinc-200" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-zinc-900">{STATUS_LABEL[h.to] ?? h.to}</p>
                  <p className="text-xs text-zinc-400">{fmt(h.at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
