"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { DOCUMENT_KINDS } from "@/lib/documents/types";

/**
 * Uploads a document to the ownership-scoped route (browser → server → R2). The
 * server validates by magic bytes; the client accept="" is only a hint.
 */
export default function UploadForm() {
  const router = useRouter();
  const [kind, setKind] = useState(DOCUMENT_KINDS[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    setPending(true);
    try {
      const fd = new FormData();
      fd.append("kind", kind);
      fd.append("file", file);
      const res = await fetch("/account/documents/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setError(j.error ?? "Upload failed.");
        setPending(false);
        return;
      }
      setFile(null);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div>
        <label htmlFor="kind" className={labelCls}>Document type</label>
        <select id="kind" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className={`mt-1.5 ${inputCls}`}>
          {DOCUMENT_KINDS.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="file" className={labelCls}>File (PDF / JPEG / PNG / WebP, under 10 MB)</label>
        <input
          id="file"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 text-sm text-zinc-600"
        />
      </div>
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Uploading…" : "Upload document"}
      </button>
      <p className="text-xs text-zinc-500">Uploading a document replaces any earlier one of the same type.</p>
    </form>
  );
}
