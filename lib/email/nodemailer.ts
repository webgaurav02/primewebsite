import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { EmailMessage } from "./index";

/**
 * SMTP transport via nodemailer — used with Google Workspace / Gmail using an
 * APP PASSWORD (not the account password; requires 2FA on the account).
 * Throws on failure so the outbox processor retries.
 *
 * Env:
 *   SMTP_HOST  (default smtp.gmail.com)
 *   SMTP_PORT  (default 465, SSL; use 587 for STARTTLS)
 *   SMTP_USER  full Workspace address, e.g. noreply@primemeghalaya.com
 *   SMTP_PASS  16-char Google app password
 *   SMTP_FROM  From header (default: SMTP_USER)
 */

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Bounded so an unreachable server can never hang a request; failures
      // just leave the message queued for the outbox processor to retry.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

export async function sendViaSmtp(msg: EmailMessage): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER / SMTP_PASS (Google app password) are not configured.");
  }
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
  });
}
