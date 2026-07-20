import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — PRIME Meghalaya",
  description:
    "Privacy notice for the PRIME Meghalaya website. Understand how we collect, use and protect your personal data under the Digital Personal Data Protection Act, 2023.",
};

const sections = [
  {
    id: "who-we-are",
    heading: "1. Who We Are (Data Fiduciary)",
    body: [
      `This website is operated by the Planning, Investment Promotion & Sustainable Development Department, Government of Meghalaya, through the PRIME (Promotion and Incubation of Market-driven Enterprises) programme. PRIME is a government initiative and acts as the Data Fiduciary for personal data collected via this website.`,
      `Registered address: Planning, Investment Promotion & Sustainable Development Department, Government of Meghalaya, Shillong – 793001, Meghalaya, India.`,
      `For data-related queries, contact our Data Protection Officer (see Section 10).`,
    ],
  },
  {
    id: "scope",
    heading: "2. Scope of this Notice",
    body: [
      `This Privacy Policy applies to all visitors of primemeghalaya.com (the "Website"). It does not apply to the PRIME Portal (portal.primemeghalaya.com), which has its own separate privacy notice governing the processing of registration, business, and financial data submitted there.`,
    ],
  },
  {
    id: "what-we-collect",
    heading: "3. Personal Data We Collect",
    body: [`This Website is primarily informational. We collect minimal personal data:`],
    list: [
      "Technical data: IP address, browser type, device type, and pages visited — collected automatically through server logs and analytics tools.",
      "Cookie data: Session and preference cookies (see Section 8 on Cookies).",
      "Correspondence data: Name and email if you contact us via the grievance or contact mechanism.",
    ],
  },
  {
    id: "purpose",
    heading: "4. Purpose and Legal Basis for Processing",
    body: [`We process personal data only for the purposes below and no other:`],
    table: [
      { purpose: "Website operation and security", basis: "Legitimate interest of the State" },
      { purpose: "Analytics to improve content and navigation", basis: "Consent (optional, cookie banner)" },
      { purpose: "Responding to enquiries and grievances", basis: "Performance of a task in public interest" },
      { purpose: "Compliance with legal obligations", basis: "Legal obligation under applicable law" },
    ],
  },
  {
    id: "data-sharing",
    heading: "5. Data Sharing and Disclosure",
    body: [`We do not sell, rent, or trade your personal data.`, `We may share data with:`],
    list: [
      "Government departments and agencies of Meghalaya / Government of India for official functions.",
      "Technical service providers (hosting, analytics) under data processing agreements that restrict their use of the data.",
      "Law enforcement or regulatory bodies where required by law, court order, or for national security purposes.",
    ],
  },
  {
    id: "retention",
    heading: "6. Data Retention",
    body: [`We retain data only as long as necessary for the purpose for which it was collected:`],
    list: [
      "Server logs and analytics data: 12 months from collection.",
      "Cookie preference data: Up to 12 months in your browser.",
      "Grievance correspondence: 3 years from resolution, in line with government record-keeping requirements.",
    ],
  },
  {
    id: "your-rights",
    heading: "7. Your Rights under the DPDP Act, 2023",
    body: [
      `Under the Digital Personal Data Protection Act, 2023 (India), you have the following rights regarding your personal data held by us:`,
    ],
    list: [
      "Right to access: Request a summary of personal data we hold about you and how it has been processed.",
      "Right to correction and erasure: Request correction of inaccurate data or erasure of data we no longer need.",
      "Right to grievance redressal: Raise a complaint with our Data Protection Officer and, if unresolved within 30 days, to the Data Protection Board of India.",
      "Right to nominate: Nominate another individual to exercise these rights on your behalf in the event of your death or incapacity.",
    ],
    note: "To exercise any of these rights, contact our Data Protection Officer (Section 10).",
  },
  {
    id: "cookies",
    heading: "8. Cookies",
    body: [`We use two categories of cookies:`],
    list: [
      "Essential cookies: Necessary for the site to function (session management, security). These cannot be declined.",
      "Analytics cookies: Optional. They help us understand how visitors use the site (e.g., most-visited pages and navigation patterns) and load only after you accept them via the cookie banner. For this we use Google Analytics 4 and Google Tag Manager (provided by Google LLC), Microsoft Clarity (Microsoft Corporation), and Mixpanel (Mixpanel, Inc.). These services process usage data on our behalf and may store or process it on servers located outside India.",
    ],
    note: "You can withdraw your consent at any time using the “Cookie Preferences” link in the site footer (or by clearing your browser cookies). Withdrawing removes the optional analytics cookies and stops further analytics collection.",
  },
  {
    id: "security",
    heading: "9. Security Measures",
    body: [
      `We implement appropriate technical and organisational measures to protect personal data against unauthorised access, accidental loss, destruction, or disclosure. These include TLS encryption in transit, restricted access controls, and regular security reviews.`,
      `However, no internet transmission is entirely secure. If you have reason to believe your data has been compromised, please notify us immediately.`,
    ],
  },
  {
    id: "dpo",
    heading: "10. Data Protection Officer & Grievance Officer",
    body: [
      `As required under the DPDP Act, 2023 and the Information Technology Act, 2000, we have designated a Grievance Officer for this Website:`,
    ],
    contact: {
      name: "Grievance Officer — PRIME Meghalaya",
      dept: "Planning, Investment Promotion & Sustainable Development Department, Government of Meghalaya",
      email: "grievance@primemeghalaya.com",
      address: "3rd Floor, Ri Kynmaw Complex, Nongrim Hills, Shillong – 793003, Meghalaya",
      hours: "Monday – Friday, 10:00 AM – 5:00 PM (excluding public holidays)",
      resolution: "We will acknowledge your complaint within 3 working days and aim to resolve it within 30 days.",
    },
  },
  {
    id: "children",
    heading: "11. Children's Data",
    body: [
      `This website is not directed at children under 18 years of age and does not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a minor, please contact our Grievance Officer and we will delete it promptly.`,
    ],
  },
  {
    id: "cross-border",
    heading: "12. Cross-Border Data Transfers",
    body: [
      `Personal data collected via this website is stored on servers located within India. If any processing requires data transfer outside India, it will be conducted in accordance with the provisions of the DPDP Act, 2023 and any subordinate rules published by the Government of India.`,
    ],
  },
  {
    id: "changes",
    heading: "13. Changes to this Policy",
    body: [
      `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will post the revised policy with an updated effective date. Continued use of the Website after any changes constitutes acceptance of the updated Policy.`,
    ],
  },
  {
    id: "governing-law",
    heading: "14. Governing Law",
    body: [
      `This Privacy Policy is governed by and construed in accordance with the laws of India, including the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and applicable rules thereunder. Disputes shall be subject to the jurisdiction of competent courts in Shillong, Meghalaya.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Legal"
        title="Privacy Policy"
        subtitle={`Effective date: 1 January 2025 · Last updated: ${new Date().getFullYear() > 2025 ? new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "1 January 2025"}`}
      />

      <main id="main-content">
        {/* Quick-nav */}
        <section className="bg-[#f5f5f5] texture-dots border-b border-black/[0.07] py-8">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <p className="font-semibold tracking-[0.25em] uppercase text-black/35 mb-4" style={{ fontSize: "var(--text-label)" }}>
              Jump to section
            </p>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-black/[0.07] text-black/50 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  {s.heading.split(". ")[1] || s.heading}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Policy body */}
        <section className="bg-white texture-grid py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-14">
            {/* Preamble */}
            <div className="p-6 bg-[#2D6A4F]/8 border-l-4 border-[#2D6A4F]">
              <p className="text-black/70 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                <strong className="text-black">Summary (not a substitute for reading the full policy):</strong> The PRIME
                Meghalaya website collects minimal data — primarily technical logs and optional
                analytics. We do not sell data, we hold it securely within India, and you have clear
                rights to access, correct, or erase your data under the{" "}
                <strong className="text-black">Digital Personal Data Protection Act, 2023</strong>. Registration and
                business data submitted on the PRIME Portal (portal.primemeghalaya.com) is governed
                by a separate policy on that portal.
              </p>
            </div>

            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2
                  className="font-black text-black mb-4 pb-3 border-b border-black/[0.08]"
                  style={{ fontSize: "1.25rem" }}
                >
                  {s.heading}
                </h2>
                {s.body.map((para, i) => (
                  <p key={i} className="text-black/50 leading-[1.85] mb-3" style={{ fontSize: "var(--text-body)" }}>
                    {para}
                  </p>
                ))}
                {"list" in s && s.list && (
                  <div className="mt-3 border-t border-black/[0.08]">
                    {s.list.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 py-3 border-b border-black/[0.08]">
                        <span className="font-black text-[#2D6A4F] shrink-0 mt-0.5" style={{ fontSize: "var(--text-label)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{item}</p>
                      </div>
                    ))}
                  </div>
                )}
                {"table" in s && s.table && (
                  <div className="mt-4 overflow-x-auto border border-black/[0.07]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f5f5f5] border-b border-black/[0.07]">
                          <th className="text-left px-5 py-3 text-black font-semibold border-r border-black/[0.07] w-1/2" style={{ fontSize: "var(--text-sm)" }}>
                            Purpose
                          </th>
                          <th className="text-left px-5 py-3 text-black font-semibold w-1/2" style={{ fontSize: "var(--text-sm)" }}>
                            Legal Basis
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.map((row, i) => (
                          <tr key={i} className={`border-b border-black/[0.07] ${i % 2 === 0 ? "bg-white" : "bg-[#f5f5f5]"}`}>
                            <td className="px-5 py-3 text-black/50 border-r border-black/[0.07]" style={{ fontSize: "var(--text-sm)" }}>
                              {row.purpose}
                            </td>
                            <td className="px-5 py-3 text-black/50" style={{ fontSize: "var(--text-sm)" }}>
                              {row.basis}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {"contact" in s && s.contact && (
                  <div className="mt-4 p-6 bg-[#f5f5f5] border border-black/[0.07] space-y-3">
                    <p className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>{s.contact.name}</p>
                    <p className="text-black/50" style={{ fontSize: "var(--text-sm)" }}>{s.contact.dept}</p>
                    <p className="text-black/50" style={{ fontSize: "var(--text-sm)" }}>{s.contact.address}</p>
                    <p style={{ fontSize: "var(--text-sm)" }}>
                      Email:{" "}
                      <a href={`mailto:${s.contact.email}`} className="text-[#2D6A4F] underline underline-offset-2">
                        {s.contact.email}
                      </a>
                    </p>
                    <p className="text-black/50" style={{ fontSize: "var(--text-sm)" }}>Office hours: {s.contact.hours}</p>
                    <p className="font-semibold text-black" style={{ fontSize: "var(--text-sm)" }}>{s.contact.resolution}</p>
                  </div>
                )}
                {"note" in s && s.note && (
                  <p className="mt-4 text-[#2D6A4F] font-medium" style={{ fontSize: "var(--text-sm)" }}>{s.note}</p>
                )}
              </div>
            ))}

            {/* Related links */}
            <div className="pt-6 border-t border-black/[0.08] flex flex-wrap gap-6">
              <Link
                href="/terms-and-conditions"
                className="text-black/50 hover:text-[#2D6A4F] transition-colors underline underline-offset-2"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Terms &amp; Conditions →
              </Link>
              <Link
                href="/grievance"
                className="text-black/50 hover:text-[#2D6A4F] transition-colors underline underline-offset-2"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Grievance Redressal →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
