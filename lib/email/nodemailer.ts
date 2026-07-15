import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { EmailMessage } from "./index";

/**
 * SMTP transport via nodemailer — used with Google Workspace / Gmail using an
 * APP PASSWORD (not the account password; requires 2FA on the account).
 * Throws on failure so the outbox processor retries.
 *
 * Credentials (primary names, with legacy SMTP_* fallbacks):
 *   EMAIL_USER / SMTP_USER   full mailbox address (the authenticated sender)
 *   EMAIL_PASS / SMTP_PASS   16-char Google app password
 *   SMTP_HOST                default smtp.gmail.com
 *   SMTP_PORT                default 465 (SSL); use 587 for STARTTLS
 *   EMAIL_FROM / SMTP_FROM   From header; defaults to a display-named EMAIL_USER
 *
 * Note: Gmail/Workspace rewrites the From address to the authenticated mailbox
 * (or a configured "Send mail as" alias), so the address part of EMAIL_FROM
 * must be EMAIL_USER or a verified alias — only the display name is free.
 */

function user(): string | undefined {
  return process.env.EMAIL_USER ?? process.env.SMTP_USER;
}
function pass(): string | undefined {
  return process.env.EMAIL_PASS ?? process.env.SMTP_PASS;
}
function from(): string {
  return (
    process.env.EMAIL_FROM ??
    process.env.SMTP_FROM ??
    `PRIME Meghalaya <${user() ?? "noreply@primemeghalaya.com"}>`
  );
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: user(), pass: pass() },
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
  if (!user() || !pass()) {
    throw new Error(
      "EMAIL_USER / EMAIL_PASS (Google app password) are not configured.",
    );
  }
  await getTransporter().sendMail({
    from: from(),
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    html: msg.html, // undefined → nodemailer sends text-only
  });
}
