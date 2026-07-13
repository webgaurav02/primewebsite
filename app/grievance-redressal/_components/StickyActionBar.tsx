"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

/**
 * Navigation/submit controls. Sticky bottom bar on mobile; inline (static) on
 * md+. The final-step button is a real type=submit inside the form.
 */
export default function StickyActionBar({
  step,
  isLast,
  isPending,
  submitDisabled,
  onBack,
  onContinue,
}: {
  step: number;
  isLast: boolean;
  isPending: boolean;
  submitDisabled: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="sticky inset-x-0 bottom-0 z-20 mt-6 flex items-center gap-3 border-t border-zinc-200 bg-white/95 px-1 py-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:mt-8 md:border-0 md:bg-transparent md:px-0 md:py-0 md:pb-0 md:backdrop-blur-none">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      )}

      <div className="ml-auto">
        {isLast ? (
          <button
            type="submit"
            disabled={submitDisabled || isPending}
            aria-busy={isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:bg-zinc-100 disabled:text-zinc-400"
          >
            {isPending ? "Submitting…" : "Submit grievance"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-1.5 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Continue
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
