"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { publicSubmissionSchema } from "@/lib/validation/grievance";
import { checkRateLimit } from "@/lib/grievance/rate-limit";
import { createPublicGrievance } from "@/lib/dal/grievance-intake";
import type { Region } from "@/lib/auth/rbac";

/**
 * Result of a submit attempt, consumed by the client wizard via useActionState.
 * Discriminated so the UI can render success / field errors / rate-limit calmly.
 */
export type SubmitState =
  | { status: "idle" }
  | { status: "success"; ticketRef: string; region: Region }
  | { status: "error"; fieldErrors: Record<string, string[]>; formError?: string }
  | { status: "rate_limited"; retryAfterSeconds: number };

const MIN_FILL_MS = 2000;

/**
 * Public, unauthenticated submit endpoint. Trusts NOTHING: anti-spam gate first,
 * then server-side re-validation with the same schema the admin side trusts.
 */
export async function submitGrievanceAction(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // (1) Honeypot — real users never fill this. Silently behave like nothing
  //     happened so bots can't distinguish acceptance from rejection.
  const honeypot = String(formData.get("company_url") ?? "");
  if (honeypot.trim() !== "") return { status: "idle" };

  // (2) Timing token (set by JS on mount). If present and implausibly fast,
  //     treat as automated and silently drop. If ABSENT (no-JS / older clients)
  //     we allow it — we won't punish the progressive-enhancement path; the
  //     honeypot + rate limit + server validation still apply.
  const renderedAt = Number(formData.get("_renderedAt"));
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < MIN_FILL_MS) {
    return { status: "idle" };
  }

  // (3) Per-IP rate limit.
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return {
      status: "rate_limited",
      retryAfterSeconds: rl.retryAfterSeconds ?? 60,
    };
  }

  // (4) Server-side validation (the client never decides validity).
  const parsed = publicSubmissionSchema.safeParse({
    region: formData.get("region"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    complainantName: formData.get("complainantName"),
    complainantEmail: formData.get("complainantEmail"),
    complainantPhone: formData.get("complainantPhone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  // (5) Write via the isolated, unauthenticated intake boundary. Only the ticket
  //     reference + region come back — never the PII that was just submitted.
  const { ticketRef, region } = await createPublicGrievance(parsed.data, { ip });
  return { status: "success", ticketRef, region };
}
