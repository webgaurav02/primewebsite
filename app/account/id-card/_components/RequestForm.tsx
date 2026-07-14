"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { submitPrimeIdRequest } from "../actions";

export default function RequestForm({ defaultVenture }: { defaultVenture?: string }) {
  const router = useRouter();
  const [holderType, setHolderType] = useState("entrepreneur");
  const [category, setCategory] = useState("");
  const [ventureName, setVentureName] = useState(defaultVenture ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      let photoPath = "";
      if (file) {
        const fd = new FormData();
        fd.append("photo", file);
        const res = await fetch("/account/id-card/photo", { method: "POST", body: fd });
        const j = await res.json();
        if (!res.ok || !j.ok) {
          setError(j.error ?? "Photo upload failed.");
          setPending(false);
          return;
        }
        photoPath = j.key;
      }
      const result = await submitPrimeIdRequest({
        holderType,
        category: category || null,
        ventureName,
        photoPath,
      });
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label htmlFor="holderType" className={labelCls}>Holder type</label>
        <select id="holderType" value={holderType} onChange={(e) => setHolderType(e.target.value)} className={`mt-1.5 ${inputCls}`}>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="mentor">Mentor</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className={labelCls}>Category (entrepreneurs)</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-1.5 ${inputCls}`}>
          <option value="">Not applicable</option>
          <option value="startup">Startup Entrepreneur</option>
          <option value="nano">Nano Entrepreneur</option>
          <option value="livelihood">Livelihood Entrepreneur</option>
        </select>
      </div>

      <div>
        <label htmlFor="ventureName" className={labelCls}>Venture name</label>
        <input id="ventureName" value={ventureName} onChange={(e) => setVentureName(e.target.value)} className={`mt-1.5 ${inputCls}`} />
      </div>

      <div>
        <label htmlFor="photo" className={labelCls}>Photo (JPEG / PNG / WebP, under 5 MB)</label>
        <div className="mt-1.5 flex items-center gap-3">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-14 w-14 rounded-full object-cover ring-1 ring-black/10" />
          )}
          <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="text-sm text-zinc-600" />
        </div>
      </div>

      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Submitting…" : "Request PRIME ID"}
      </button>
      <p className="text-center text-xs text-zinc-500">
        Your request is reviewed by PRIME before a credential is issued.
      </p>
    </form>
  );
}
