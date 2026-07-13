"use client";

import { AlertIcon } from "./icons";

/**
 * Focusable summary shown after a failed submit. role="alert" + tabIndex -1 so
 * the wizard can move focus to it; each item jumps to the offending field.
 */
export default function ErrorSummary({
  id,
  errors,
  onJump,
}: {
  id: string;
  errors: { fieldId: string; message: string }[];
  onJump: (fieldId: string) => void;
}) {
  if (errors.length === 0) return null;

  return (
    <div
      id={id}
      role="alert"
      tabIndex={-1}
      className="rounded-lg border-2 border-black bg-zinc-50 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <AlertIcon className="h-5 w-5" />
        Please fix the following before submitting
      </p>
      <ul className="mt-2 space-y-1">
        {errors.map((e) => (
          <li key={e.fieldId}>
            <button
              type="button"
              onClick={() => onJump(e.fieldId)}
              className="text-left text-sm text-zinc-700 underline underline-offset-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {e.message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
