import "server-only";
import { withSystemContext } from "@/lib/db/client";
import { sendViaConsole } from "./console";
import { sendViaSmtp } from "./nodemailer";
import { sendViaResend } from "./resend";

/**
 * Durable, pluggable transactional email.
 *
 * Reliability model: callers ENQUEUE into email_outbox (Postgres); a processor
 * sends via the configured transport with retries. A provider outage or a rate
 * cap therefore just leaves mail queued — nothing is silently dropped. Swapping
 * providers is one env var, no code.
 *
 *   EMAIL_TRANSPORT = "smtp"           → nodemailer / Google Workspace (ACTIVE)
 *   EMAIL_TRANSPORT = "resend"         → POST to Resend (kept as a provision)
 *   EMAIL_TRANSPORT unset / "console"  → dev: log the message + links
 */

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain-text body. HTML is layered on with the real transport. */
  text: string;
}

export type EmailTransport = (msg: EmailMessage) => Promise<void>;

const MAX_ATTEMPTS = 5;

function resolveTransport(): EmailTransport {
  switch (process.env.EMAIL_TRANSPORT) {
    case "smtp":
      return sendViaSmtp;
    case "resend":
      return sendViaResend;
    default:
      return sendViaConsole;
  }
}

/** Queue an email for delivery. Safe to call from any DAL flow. */
export async function enqueueEmail(msg: EmailMessage): Promise<void> {
  await withSystemContext(
    (tx) => tx`
      INSERT INTO email_outbox (to_email, subject, body)
      VALUES (${msg.to}, ${msg.subject}, ${msg.text})
    `,
  );
}

/**
 * Enqueue (durably) + flush promptly. The awaited enqueue guarantees the
 * message is queued even if delivery fails; the flush attempts immediate
 * delivery (transports are bounded by timeouts so this can't hang). Anything
 * that fails stays queued for the scheduled processEmailOutbox() to retry.
 */
export async function sendEmail(msg: EmailMessage): Promise<void> {
  await enqueueEmail(msg);
  await processEmailOutbox().catch(() => {});
}

/** Send queued email with retry. Call from a cron/route on a schedule. */
export async function processEmailOutbox(
  limit = 25,
): Promise<{ sent: number; failed: number }> {
  const transport = resolveTransport();
  let sent = 0;
  let failed = 0;

  await withSystemContext(async (tx) => {
    const rows = await tx<
      { id: string; toEmail: string; subject: string; body: string; attempts: number }[]
    >`
      SELECT id, to_email AS "toEmail", subject, body, attempts
      FROM email_outbox
      WHERE status = 'pending' AND attempts < ${MAX_ATTEMPTS}
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    `;

    for (const r of rows) {
      try {
        await transport({ to: r.toEmail, subject: r.subject, text: r.body });
        await tx`UPDATE email_outbox SET status = 'sent', sent_at = now() WHERE id = ${r.id}`;
        sent++;
      } catch (e) {
        const attempts = r.attempts + 1;
        const status = attempts >= MAX_ATTEMPTS ? "failed" : "pending";
        await tx`
          UPDATE email_outbox
          SET attempts = ${attempts}, status = ${status},
              last_error = ${String(e).slice(0, 500)}
          WHERE id = ${r.id}`;
        failed++;
      }
    }
  });

  return { sent, failed };
}

/** Absolute base URL for links in emails (verify / reset / activation). */
export function appBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
