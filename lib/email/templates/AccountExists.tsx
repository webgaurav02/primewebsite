import * as React from "react";
import { CtaButton, EmailShell, LinkFallback, Note, Paragraph } from "./shell";

/**
 * Sent when someone tries to register with an email that already has an account.
 * Links to sign-in and the enumeration-safe forgot-password page — it never
 * embeds a reset token, so this path can't be abused to reset someone's password.
 */
export function AccountExists({
  baseUrl,
  name,
}: {
  baseUrl: string;
  name: string;
}) {
  const firstName = name.split(" ")[0];
  const loginUrl = `${baseUrl}/login`;
  const resetUrl = `${baseUrl}/forgot-password`;
  return (
    <EmailShell
      baseUrl={baseUrl}
      preview="You already have a PRIME account"
      eyebrow="Account security"
      heading="You already have an account"
    >
      <Paragraph>Hi {firstName},</Paragraph>
      <Paragraph>
        Someone just tried to create a PRIME account with this email address, but
        you already have one. You can sign in as usual — no new account was
        created.
      </Paragraph>
      <CtaButton href={loginUrl} label="Sign in to PRIME" />
      <LinkFallback href={loginUrl} />
      <Note>
        Forgot your password? Reset it at{" "}
        <a href={resetUrl} style={{ color: "#2D6A4F", textDecoration: "none" }}>
          {resetUrl}
        </a>
        . If this wasn&apos;t you, you can safely ignore this email.
      </Note>
    </EmailShell>
  );
}

export default AccountExists;
