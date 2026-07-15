import * as React from "react";
import { CtaButton, EmailShell, LinkFallback, Note, Paragraph } from "./shell";

/** Sent to confirm a newly registered email address. */
export function VerifyEmail({
  baseUrl,
  name,
  url,
}: {
  baseUrl: string;
  name: string;
  url: string;
}) {
  const firstName = name.split(" ")[0];
  return (
    <EmailShell
      baseUrl={baseUrl}
      preview="Confirm your email to activate your PRIME account"
      eyebrow="Entrepreneur Portal"
      heading="Confirm your email"
    >
      <Paragraph>Hi {firstName},</Paragraph>
      <Paragraph>
        Welcome to PRIME. Confirm this email address to activate your account and
        get started.
      </Paragraph>
      <CtaButton href={url} label="Verify email address" />
      <LinkFallback href={url} />
      <Note>
        This link expires in 24 hours. If you didn&apos;t create a PRIME account,
        you can ignore this email.
      </Note>
    </EmailShell>
  );
}

export default VerifyEmail;
