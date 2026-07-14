"use client";

import { useActionState } from "react";
import { formError, type FormState, IDLE } from "@/lib/forms";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { publishEventAction } from "../actions";

export default function PublishForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(publishEventAction, IDLE);
  const err = formError(state);

  return (
    <form action={action} className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5">
      {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      {state.status === "success" && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Published.</p>
      )}
      <div>
        <label htmlFor="title" className={labelCls}>Title</label>
        <input id="title" name="title" className={`mt-1.5 ${inputCls}`} placeholder="E-Champion Challenge applications open" />
      </div>
      <div>
        <label htmlFor="body" className={labelCls}>Details</label>
        <textarea id="body" name="body" rows={3} className={`mt-1.5 ${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label htmlFor="occursAt" className={labelCls}>Date (optional)</label>
        <input id="occursAt" name="occursAt" type="date" className={`mt-1.5 ${inputCls}`} />
      </div>
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Publishing…" : "Publish announcement"}
      </button>
    </form>
  );
}
