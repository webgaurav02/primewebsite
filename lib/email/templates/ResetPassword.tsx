import * as React from "react";
import { CtaButton, EmailShell, LinkFallback, Note, Paragraph } from "./shell";

/** Sent when a user requests a password reset. */
export function ResetPassword({
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
      preview="Reset your PRIME password"
      eyebrow="Account security"
      heading="Reset your password"
    >
      <Paragraph>Hi {firstName},</Paragraph>
      <Paragraph>
        We received a request to reset the password for your PRIME account.
        Choose a new one using the button below.
      </Paragraph>
      <CtaButton href={url} label="Choose a new password" />
      <LinkFallback href={url} />
      <Note>
        This link expires in 1 hour. If you didn&apos;t request a reset, you can
        safely ignore this email — your password won&apos;t change.
      </Note>
    </EmailShell>
  );
}

export default ResetPassword;
