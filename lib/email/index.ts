import "server-only";
import { sendViaConsole } from "./console";

/**
 * Pluggable transactional email. One interface, swappable transport:
 *   - dev / unset EMAIL_TRANSPORT  → console adapter (logs the message + links)
 *   - prod                         → SMTP / Resend adapter (added later; the
 *                                     Phase 4 email_outbox will queue + retry)
 *
 * Auth (verify + reset) is the first consumer. Callers never build links by
 * hand — they pass an absolute URL derived from APP_BASE_URL.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain-text body. HTML is layered on with the real transport. */
  text: string;
}

export type EmailTransport = (msg: EmailMessage) => Promise<void>;

function resolveTransport(): EmailTransport {
  // Only the console transport exists today; the switch is where SMTP/Resend land.
  switch (process.env.EMAIL_TRANSPORT) {
    default:
      return sendViaConsole;
  }
}

export async function sendEmail(msg: EmailMessage): Promise<void> {
  await resolveTransport()(msg);
}

/** Absolute base URL for links in emails (verify / reset). */
export function appBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
