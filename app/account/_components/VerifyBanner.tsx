"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "@/app/verify-email/actions";
import { IDLE } from "@/lib/forms";

/**
 * Soft-gate notice for members who haven't verified their email yet. The account
 * is fully usable; only high-trust actions (PRIME ID, program apply, document
 * upload) require verification. Renders nothing once verified. The resend action
 * is enumeration-safe + rate-limited and always reports success.
 */
export default function VerifyBanner({ email, verified }: { email: string; verified: boolean }) {
  const [state, action, pending] = useActionState(resendVerificationAction, IDLE);
  if (verified) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-900">Verify your email to unlock applications</p>
        <p className="text-xs text-amber-800">
          We sent a link to {email}. You can explore your dashboard now, but you&apos;ll need to verify before
          applying to programmes or requesting a PRIME ID.
        </p>
      </div>
      {state.status === "success" ? (
        <span className="text-xs font-medium text-amber-900">Sent — check your inbox.</span>
      ) : (
        <form action={action}>
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Resend link"}
          </button>
        </form>
      )}
    </div>
  );
}
