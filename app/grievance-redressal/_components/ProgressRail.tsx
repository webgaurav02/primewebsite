"use client";

import { CheckIcon } from "./icons";

/**
 * Step progress. Full numbered rail on md+; a compact "Step n of N — label" line
 * plus a thin bar on mobile. State is never shape/weight-only — sr-only text
 * conveys completed/current/upcoming.
 */
export default function ProgressRail({
  step,
  labels,
}: {
  step: number; // 1-based
  labels: string[];
}) {
  const total = labels.length;

  return (
    <div>
      {/* Mobile */}
      <div className="md:hidden">
        <p className="text-sm font-medium text-zinc-900">
          Step {step} of {total}
          <span className="text-zinc-500"> — {labels[step - 1]}</span>
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full bg-black transition-[width] motion-reduce:transition-none"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <ol className="hidden items-center gap-2 md:flex">
        {labels.map((label, i) => {
          const n = i + 1;
          const isComplete = n < step;
          const isCurrent = n === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isComplete
                    ? "border-black bg-black text-white"
                    : isCurrent
                      ? "border-black text-black ring-2 ring-black"
                      : "border-zinc-300 text-zinc-400",
                ].join(" ")}
              >
                {isComplete ? <CheckIcon className="h-4 w-4" /> : n}
                <span className="sr-only">
                  {isComplete ? "completed" : isCurrent ? "current" : "upcoming"}
                </span>
              </span>
              <span
                className={`hidden text-sm lg:block ${isCurrent ? "font-medium text-zinc-900" : "text-zinc-500"}`}
              >
                {label}
              </span>
              {n < total && (
                <span
                  aria-hidden="true"
                  className={`h-px flex-1 ${isComplete ? "bg-black" : "bg-zinc-200"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
