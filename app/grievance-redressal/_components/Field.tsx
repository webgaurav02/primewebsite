"use client";

import { AlertIcon } from "./icons";

/**
 * Labeled field wrapper that wires the a11y attributes. The control is supplied
 * via a render-prop so the consumer can spread the id / aria attributes onto any
 * input, textarea, etc.
 */
export default function Field({
  id,
  label,
  required,
  helper,
  error,
  counter,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  counter?: React.ReactNode;
  children: (a: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    required?: boolean;
  }) => React.ReactNode;
}) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className={`text-sm font-medium text-zinc-900 ${error ? "font-semibold" : ""}`}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-zinc-500">
              {" "}
              *
            </span>
          )}
        </label>
        {counter && <span className="text-xs">{counter}</span>}
      </div>

      <div className="mt-1.5">
        {children({
          id,
          "aria-describedby": describedBy,
          "aria-invalid": error ? true : undefined,
          required,
        })}
      </div>

      {helper && (
        <p id={helperId} className="mt-1.5 text-sm text-zinc-500">
          {helper}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-zinc-900"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
