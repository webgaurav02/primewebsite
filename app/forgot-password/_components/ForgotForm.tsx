"use client";

import { useActionState } from "react";
import Link from "next/link";
import { type FormState, IDLE } from "@/lib/forms";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { forgotPasswordAction } from "../actions";

export default function ForgotForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    forgotPasswordAction,
    IDLE,
  );

  if (state.status === "success") {
    return (
      <div className="text-center">
        <p className="text-sm text-zinc-600">
          If that email is registered, we&apos;ve sent a link to reset your
          password. The link expires in 1 hour.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-block rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelCls}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" className={`mt-1.5 ${inputCls}`} />
      </div>
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-sm text-zinc-600">
        <Link href="/login" className="font-medium text-zinc-900 underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
