import "server-only";
import type { EmailMessage } from "./index";

/**
 * Resend transport (https://resend.com). Throws on any non-2xx so the outbox
 * processor records the error and retries later — including when the free
 * tier's daily cap (100/day) is hit.
 *
 * Env: RESEND_API_KEY, RESEND_FROM (e.g. "PRIME Meghalaya <noreply@primemeghalaya.com>";
 * the sending domain must be verified in Resend for real deliverability).
 */
export async function sendViaResend(msg: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY / RESEND_FROM are not configured.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}
