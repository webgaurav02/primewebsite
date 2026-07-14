import type { Metadata } from "next";
import Link from "next/link";
import { POLICY_VERSION, PURPOSE_LABELS, CONSENT_PURPOSES } from "@/lib/legal/policy";

export const metadata: Metadata = {
  title: "Portal Privacy Notice — PRIME Meghalaya",
};

/**
 * DPDP-compliant privacy notice for the PRIME member portal (the website
 * privacy policy defers registration/business data to this separate notice).
 * Static content; the purpose list is the same source of truth stamped into
 * each user_consent record.
 */
export default function PortalPrivacyNoticePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-14">
      <p className="font-semibold uppercase tracking-[0.2em] text-black/30" style={{ fontSize: "var(--text-label)" }}>
        Version {POLICY_VERSION}
      </p>
      <h1 className="mt-2 font-black tracking-tight text-black" style={{ fontSize: "var(--text-heading)" }}>
        PRIME Portal Privacy Notice
      </h1>

      <div className="mt-8 space-y-6 text-black/70" style={{ fontSize: "var(--text-body)", lineHeight: 1.75 }}>
        <p>
          This notice explains how the PRIME programme (Department of Commerce &amp; Industries,
          Government of Meghalaya — the Data Fiduciary) collects and processes your personal data
          when you create and use a PRIME account, under the Digital Personal Data Protection Act, 2023.
        </p>

        <section>
          <h2 className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>What we collect</h2>
          <p className="mt-2">
            Your name, email, mobile number, date of birth, gender, district, preferred language, how you
            heard about PRIME, and the identity type you select. Optionally, a profile photograph. If you
            register as an entrepreneur with an existing business, we also collect your business and
            social-impact details. Your password is stored only as a salted, hashed value; your mobile
            number is encrypted at rest.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>Why we collect it (purposes)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {CONSENT_PURPOSES.map((p) => (
              <li key={p}>{PURPOSE_LABELS[p]}</li>
            ))}
          </ul>
          <p className="mt-2">
            We collect only what is needed for these purposes. Your profile photograph is kept private to
            you and PRIME staff; it is <strong>not</strong> published, and it is separate from any PRIME ID
            card you may later choose to generate.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>Children</h2>
          <p className="mt-2">
            If you are under 18, a parent or guardian must provide their name and consent during
            registration. We do not use children&apos;s data for tracking or targeted advertising.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>Your rights</h2>
          <p className="mt-2">
            You may access, correct, or erase your data, withdraw consent, or raise a grievance at any
            time. Withdrawing consent is as easy as giving it. Erasing your account removes your data and
            any stored photograph. Retention follows Government of Meghalaya record-keeping requirements.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>Contact</h2>
          <p className="mt-2">
            Reach the Data Protection / Grievance Officer via the{" "}
            <Link href="/grievance-redressal" className="font-semibold text-[#2D6A4F] underline">
              grievance redressal
            </Link>{" "}
            page. See also our{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#2D6A4F] underline">
              website privacy policy
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="mt-10">
        <Link href="/register" className="font-semibold text-[#2D6A4F] underline" style={{ fontSize: "var(--text-sm)" }}>
          ← Back to registration
        </Link>
      </p>
    </main>
  );
}
