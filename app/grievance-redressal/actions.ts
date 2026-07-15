"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { publicSubmissionSchema } from "@/lib/validation/grievance";
import { checkRateLimit } from "@/lib/grievance/rate-limit";
import {
  createPublicGrievance,
  type PendingAttachment,
} from "@/lib/dal/grievance-intake";
import { getCurrentUser } from "@/lib/auth/user-session";
import { CONSENT_VERSION, MAX_ATTACHMENTS } from "@/lib/grievance/consent";
import { detectDocument, MAX_DOCUMENT_BYTES } from "@/lib/storage";
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
  const str = (v: FormDataEntryValue | null) => {
    const s = typeof v === "string" ? v.trim() : "";
    return s.length ? s : undefined;
  };
  const parsed = publicSubmissionSchema.safeParse({
    region: formData.get("region"),
    category: formData.get("category") ?? undefined,
    subject: formData.get("subject"),
    description: formData.get("description"),
    complainantName: formData.get("complainantName"),
    complainantEmail: formData.get("complainantEmail"),
    complainantPhone: formData.get("complainantPhone"),
    primeId: str(formData.get("primeId")),
    businessName: str(formData.get("businessName")),
  });

  const fieldErrors: Record<string, string[]> = parsed.success
    ? {}
    : (z.flattenError(parsed.error).fieldErrors as Record<string, string[]>);

  // (5) DPDP consent is mandatory — the server refuses without it (the client
  //     also disables submit, but consent must be enforced here for the no-JS
  //     path and against any crafted request).
  if (formData.get("consent") !== "true") {
    fieldErrors.consent = ["Please give consent to submit your grievance."];
  }

  // (6) Attachments (optional): magic-byte + size + count validated here, before
  //     anything is written or uploaded.
  const files = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const attachments: PendingAttachment[] = [];
  if (files.length > MAX_ATTACHMENTS) {
    fieldErrors.attachments = [`Attach at most ${MAX_ATTACHMENTS} files.`];
  } else {
    for (const file of files) {
      if (file.size > MAX_DOCUMENT_BYTES) {
        fieldErrors.attachments = ["Each file must be under 10 MB."];
        break;
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!detectDocument(buffer)) {
        fieldErrors.attachments = ["Attach only PDF, JPEG, PNG or WebP files."];
        break;
      }
      attachments.push({ buffer, name: file.name.slice(0, 200) });
    }
  }

  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // (7) Link to the submitter if signed in (adds it to their timeline + lets
  //     them track it from their account), else write anonymously.
  const user = await getCurrentUser();

  const { ticketRef, region } = await createPublicGrievance(parsed.data, {
    ip,
    userId: user?.id ?? null,
    consentVersion: CONSENT_VERSION,
    attachments,
  });
  return { status: "success", ticketRef, region };
}
