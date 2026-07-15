"use client";

import { useId, useRef, useState } from "react";
import { MAX_ATTACHMENTS } from "@/lib/grievance/consent";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Optional supporting documents/photos. A native (uncontrolled) file input is
 * the source of truth so the files POST with the form; we mirror the selected
 * names into local state for display and bubble them up for the review step.
 * name="attachments" + multiple ⇒ the server receives every file.
 */
export default function AttachmentInput({
  error,
  onFilesChange,
}: {
  error?: string;
  onFilesChange: (names: string[]) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);

  function sync() {
    const list = Array.from(inputRef.current?.files ?? []).map((f) => ({
      name: f.name,
      size: f.size,
    }));
    setFiles(list);
    onFilesChange(list.map((f) => f.name));
  }

  function clearAll() {
    if (inputRef.current) inputRef.current.value = "";
    setFiles([]);
    onFilesChange([]);
  }

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id} className={`text-sm font-medium text-zinc-900 ${error ? "font-semibold" : ""}`}>
        Attachments{" "}
        <span className="font-normal text-zinc-500">— optional</span>
      </label>

      <div className="mt-1.5">
        <input
          ref={inputRef}
          id={id}
          name="attachments"
          type="file"
          multiple
          accept={ACCEPT}
          onChange={sync}
          aria-describedby={[`${id}-helper`, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        />
      </div>

      <p id={`${id}-helper`} className="mt-1.5 text-sm text-zinc-500">
        Photos or PDFs that support your grievance (e.g. a screenshot, letter, or
        receipt). Up to {MAX_ATTACHMENTS} files, 10&nbsp;MB each. Do not upload
        Aadhaar, bank or password details.
      </p>

      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
              <span className="min-w-0 truncate">{f.name}</span>
              <span className="shrink-0 text-xs text-zinc-400">{fmtSize(f.size)}</span>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-zinc-600 underline underline-offset-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Remove all
            </button>
          </li>
        </ul>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-semibold text-zinc-900">
          {error}
        </p>
      )}
    </div>
  );
}
