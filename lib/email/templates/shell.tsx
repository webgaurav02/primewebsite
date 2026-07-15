import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { brand, fontStack, CARD_WIDTH } from "./theme";

/**
 * Shared shell for every PRIME transactional email: dark-green header band with
 * the white wordmark, a light-green accent rule, a white card body, and a muted
 * government footer. Templates supply an eyebrow, heading, and body content.
 *
 * `baseUrl` is the absolute site origin (APP_BASE_URL) — used for the header
 * logo and every action link, because email clients can't resolve relative
 * paths. It must be a public origin (e.g. https://primemeghalaya.com); if it is
 * ever pointed at localhost, the logo won't load in a real inbox.
 */
export function EmailShell({
  baseUrl,
  preview,
  eyebrow,
  heading,
  children,
}: {
  baseUrl: string;
  preview: string;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Img
              src={`${baseUrl}/logo-color.png`}
              alt="PRIME Meghalaya"
              height={34}
              style={{ height: "34px", width: "auto", display: "block" }}
            />
          </Section>

          {/* Card */}
          <Section style={cardStyle}>
            <Text style={eyebrowStyle}>{eyebrow}</Text>
            <Heading as="h1" style={headingStyle}>
              {heading}
            </Heading>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerStrongStyle}>
              Government of Meghalaya · PRIME Programme
            </Text>
            <Text style={footerTextStyle}>
              Promotion and Incubation of Market-driven Enterprises
            </Text>
            <Text style={footerTextStyle}>
              Need help? Write to{" "}
              <Link href="mailto:support@primemeghalaya.com" style={footerLink}>
                support@primemeghalaya.com
              </Link>
            </Text>
            <Text style={footerFineStyle}>
              You received this email because an action was taken with your email
              address on the PRIME portal. If it wasn&apos;t you, you can safely
              ignore this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Body paragraph in the card. */
export function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={paragraphStyle}>{children}</Text>;
}

/** Primary call-to-action button (sharp corners, PRIME green). */
export function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <Section style={{ padding: "8px 0 4px" }}>
      <Button href={href} style={buttonStyle}>
        {label}
      </Button>
    </Section>
  );
}

/** "Or paste this link" fallback for clients that strip the button. */
export function LinkFallback({ href }: { href: string }) {
  return (
    <>
      <Text style={fallbackLabelStyle}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={fallbackLinkWrapStyle}>
        <Link href={href} style={fallbackLinkStyle}>
          {href}
        </Link>
      </Text>
    </>
  );
}

/** Muted note, e.g. link expiry. */
export function Note({ children }: { children: React.ReactNode }) {
  return <Text style={noteStyle}>{children}</Text>;
}

/* ── Styles (inline; React Email inlines these onto the elements) ──────────── */
const bodyStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: brand.bg,
  fontFamily: fontStack,
  WebkitFontSmoothing: "antialiased",
};
const containerStyle: React.CSSProperties = {
  maxWidth: `${CARD_WIDTH}px`,
  width: "100%",
  margin: "0 auto",
  padding: "32px 12px",
};
const headerStyle: React.CSSProperties = {
  backgroundColor: brand.green,
  padding: "22px 32px",
  borderBottom: `3px solid ${brand.greenLight}`,
};
const cardStyle: React.CSSProperties = {
  backgroundColor: brand.card,
  padding: "40px 32px",
  border: `1px solid ${brand.line}`,
  borderTop: "none",
};
const eyebrowStyle: React.CSSProperties = {
  margin: "0 0 10px",
  color: brand.greenMid,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};
const headingStyle: React.CSSProperties = {
  margin: "0 0 18px",
  color: brand.ink,
  fontSize: "23px",
  lineHeight: "1.25",
  fontWeight: 800,
  letterSpacing: "-0.01em",
};
const paragraphStyle: React.CSSProperties = {
  margin: "0 0 16px",
  color: brand.body,
  fontSize: "15px",
  lineHeight: "1.7",
};
const buttonStyle: React.CSSProperties = {
  backgroundColor: brand.green,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  textDecoration: "none",
  padding: "14px 30px",
  display: "inline-block",
};
const fallbackLabelStyle: React.CSSProperties = {
  margin: "20px 0 6px",
  color: brand.muted,
  fontSize: "12px",
  lineHeight: "1.5",
};
const fallbackLinkWrapStyle: React.CSSProperties = {
  margin: "0 0 4px",
  padding: "10px 12px",
  backgroundColor: brand.faint,
  border: `1px solid ${brand.line}`,
  wordBreak: "break-all",
};
const fallbackLinkStyle: React.CSSProperties = {
  color: brand.greenMid,
  fontSize: "12px",
  textDecoration: "none",
};
const noteStyle: React.CSSProperties = {
  margin: "16px 0 0",
  color: brand.muted,
  fontSize: "13px",
  lineHeight: "1.6",
};
const footerStyle: React.CSSProperties = { padding: "24px 32px 8px" };
const footerStrongStyle: React.CSSProperties = {
  margin: "0 0 2px",
  color: "#6b6b6b",
  fontSize: "12px",
  fontWeight: 700,
};
const footerTextStyle: React.CSSProperties = {
  margin: "0 0 2px",
  color: brand.muted,
  fontSize: "12px",
  lineHeight: "1.6",
};
const footerLink: React.CSSProperties = {
  color: brand.greenMid,
  textDecoration: "none",
  fontWeight: 600,
};
const footerFineStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: "#a6a6a6",
  fontSize: "11px",
  lineHeight: "1.6",
};
