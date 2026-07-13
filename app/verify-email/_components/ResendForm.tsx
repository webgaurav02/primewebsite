"use client";

import { useActionState } from "react";
import { type FormState, IDLE } from "@/lib/forms";
import { inputCls, btnCls } from "@/app/components/formStyles";
import { resendVerificationAction } from "../actions";

export default function ResendForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    resendVerificationAction,
    IDLE,
  );

  if (state.status === "success") {
    return (
      <p className="text-sm text-zinc-600">
        If that email needs verifying, a new link is on its way.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input
        name="email"
        type="email"
        placeholder="you@example.com"
        aria-label="Email"
        className={inputCls}
      />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Sending…" : "Resend verification link"}
      </button>
    </form>
  );
}
