"use client";

import { useActionState } from "react";
import Link from "next/link";
import { fieldError, formError, type FormState, IDLE } from "@/lib/forms";
import { inputCls, labelCls, errCls, btnCls } from "@/app/components/formStyles";
import { resetPasswordAction } from "../actions";

export default function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    resetPasswordAction,
    IDLE,
  );

  if (state.status === "success") {
    return (
      <div className="text-center">
        <p className="text-sm text-zinc-600">
          Your password has been updated.
        </p>
        <Link
          href="/login?reset=1"
          className="mt-5 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const err = formError(state);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {err && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
      )}
      <div>
        <label htmlFor="password" className={labelCls}>New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" className={`mt-1.5 ${inputCls}`} />
        {fieldError(state, "password") && <p className={errCls}>{fieldError(state, "password")}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className={labelCls}>Re-enter password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className={`mt-1.5 ${inputCls}`} />
        {fieldError(state, "confirmPassword") && <p className={errCls}>{fieldError(state, "confirmPassword")}</p>}
      </div>
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
