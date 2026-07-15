import "server-only";
import * as React from "react";
import { render } from "@react-email/render";
import { ActivateAccount } from "./ActivateAccount";
import { VerifyEmail } from "./VerifyEmail";
import { ResetPassword } from "./ResetPassword";
import { AccountExists } from "./AccountExists";

/**
 * Renders the branded React Email templates into the shape sendEmail() enqueues:
 * a subject plus an HTML body and a plain-text fallback (auto-derived from the
 * same component, so the two never drift). Every builder takes the absolute
 * `baseUrl` so template assets and links resolve outside the app.
 */

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

async function build(
  element: React.ReactElement,
  subject: string,
): Promise<BuiltEmail> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);
  return { subject, html, text };
}

export function activationEmail(opts: {
  baseUrl: string;
  name: string;
  url: string;
}): Promise<BuiltEmail> {
  return build(
    <ActivateAccount {...opts} />,
    "Your PRIME application is approved — set your password",
  );
}

export function verifyEmail(opts: {
  baseUrl: string;
  name: string;
  url: string;
}): Promise<BuiltEmail> {
  return build(<VerifyEmail {...opts} />, "Verify your PRIME account");
}

export function resetPasswordEmail(opts: {
  baseUrl: string;
  name: string;
  url: string;
}): Promise<BuiltEmail> {
  return build(<ResetPassword {...opts} />, "Reset your PRIME password");
}

export function accountExistsEmail(opts: {
  baseUrl: string;
  name: string;
}): Promise<BuiltEmail> {
  return build(
    <AccountExists {...opts} />,
    "You already have a PRIME account",
  );
}
