"use client";

import { useActionState } from "react";
import { formError, type FormState, IDLE } from "@/lib/forms";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { requestPrimeIdAction } from "../actions";

export default function RequestForm({ defaultVenture }: { defaultVenture?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    requestPrimeIdAction,
    IDLE,
  );
  const err = formError(state);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
      {err && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
      )}

      <div>
        <label htmlFor="holderType" className={labelCls}>Holder type</label>
        <select id="holderType" name="holderType" defaultValue="entrepreneur" className={`mt-1.5 ${inputCls}`}>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="mentor">Mentor</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className={labelCls}>Category (entrepreneurs)</label>
        <select id="category" name="category" defaultValue="" className={`mt-1.5 ${inputCls}`}>
          <option value="">Not applicable</option>
          <option value="startup">Startup Entrepreneur</option>
          <option value="nano">Nano Entrepreneur</option>
          <option value="livelihood">Livelihood Entrepreneur</option>
        </select>
      </div>

      <div>
        <label htmlFor="ventureName" className={labelCls}>Venture name</label>
        <input id="ventureName" name="ventureName" defaultValue={defaultVenture ?? ""} className={`mt-1.5 ${inputCls}`} />
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
