import * as React from "react";
import { CtaButton, EmailShell, LinkFallback, Note, Paragraph } from "./shell";

/** Sent when an admin approves an entrepreneur application. */
export function ActivateAccount({
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
      preview="Your PRIME application is approved — set your password"
      eyebrow="Entrepreneur Portal"
      heading="Your application is approved"
    >
      <Paragraph>Hi {firstName},</Paragraph>
      <Paragraph>
        Good news — your application to PRIME has been approved. Set a password to
        activate your account and access your dashboard, where you can track
        programmes, funding, and your PRIME ID.
      </Paragraph>
      <CtaButton href={url} label="Set your password" />
      <LinkFallback href={url} />
      <Note>This link expires in 7 days.</Note>
    </EmailShell>
  );
}

export default ActivateAccount;
