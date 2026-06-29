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
      `This website is operated by the Department of Commerce & Industries, Government of Meghalaya, through the PRIME (Promotion and Incubation of Market-driven Enterprises) programme. PRIME is a government initiative and acts as the Data Fiduciary for personal data collected via this website.`,
      `Registered address: Department of Commerce & Industries, Government of Meghalaya, Shillong – 793001, Meghalaya, India.`,
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
    body: [
      `This Website is primarily informational. We collect minimal personal data:`,
    ],
    list: [
      "Technical data: IP address, browser type, device type, and pages visited — collected automatically through server logs and analytics tools.",
      "Cookie data: Session and preference cookies (see Section 8 on Cookies).",
      "Correspondence data: Name and email if you contact us via the grievance or contact mechanism.",
    ],
  },
  {
    id: "purpose",
    heading: "4. Purpose and Legal Basis for Processing",
    body: [
      `We process personal data only for the purposes below and no other:`,
    ],
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
    body: [
      `We do not sell, rent, or trade your personal data.`,
      `We may share data with:`,
    ],
    list: [
      "Government departments and agencies of Meghalaya / Government of India for official functions.",
      "Technical service providers (hosting, analytics) under data processing agreements that restrict their use of the data.",
      "Law enforcement or regulatory bodies where required by law, court order, or for national security purposes.",
    ],
  },
  {
    id: "retention",
    heading: "6. Data Retention",
    body: [
      `We retain data only as long as necessary for the purpose for which it was collected:`,
    ],
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
    body: [
      `We use two categories of cookies:`,
    ],
    list: [
      "Essential cookies: Necessary for the site to function (session management, security). These cannot be declined.",
      "Analytics cookies: Help us understand how visitors use the site (e.g., most-visited pages). These are optional and require your consent via the cookie banner.",
    ],
    note: "You can withdraw cookie consent at any time by clearing your browser cookies or by adjusting your browser settings.",
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
      dept: "Department of Commerce & Industries, Government of Meghalaya",
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
        <section className="bg-[#f9f9f9] border-b border-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <p className="text-[11px] text-gray-400 font-semibold tracking-[0.15em] uppercase mb-4">
              Jump to section
            </p>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#9EC84A] hover:text-[#9EC84A] transition-colors"
                >
                  {s.heading.split(". ")[1] || s.heading}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Policy body */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-14">
            {/* Preamble */}
            <div className="p-6 bg-[#9EC84A]/8 border-l-4 border-[#9EC84A] rounded-sm">
              <p className="text-[13px] text-[#111] leading-relaxed">
                <strong>Summary (not a substitute for reading the full policy):</strong> The PRIME
                Meghalaya website collects minimal data — primarily technical logs and optional
                analytics. We do not sell data, we hold it securely within India, and you have clear
                rights to access, correct, or erase your data under the{" "}
                <strong>Digital Personal Data Protection Act, 2023</strong>. Registration and
                business data submitted on the PRIME Portal (portal.primemeghalaya.com) is governed
                by a separate policy on that portal.
              </p>
            </div>

            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-[18px] md:text-[22px] font-black text-[#111] mb-4 pb-3 border-b border-gray-100">
                  {s.heading}
                </h2>
                {s.body.map((para, i) => (
                  <p key={i} className="text-[13px] text-gray-600 leading-[1.85] mb-3">
                    {para}
                  </p>
                ))}
                {"list" in s && s.list && (
                  <ul className="mt-3 space-y-2.5">
                    {s.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[13px] text-gray-600 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-[#9EC84A]/15 flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#9EC84A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {"table" in s && s.table && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-[12px] border-collapse">
                      <thead>
                        <tr className="bg-[#f9f9f9]">
                          <th className="text-left px-4 py-2.5 text-[#111] font-semibold border border-gray-100 w-1/2">Purpose</th>
                          <th className="text-left px-4 py-2.5 text-[#111] font-semibold border border-gray-100 w-1/2">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                            <td className="px-4 py-2.5 text-gray-600 border border-gray-100">{row.purpose}</td>
                            <td className="px-4 py-2.5 text-gray-600 border border-gray-100">{row.basis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {"contact" in s && s.contact && (
                  <div className="mt-4 p-5 bg-[#f9f9f9] border border-gray-100 rounded-sm space-y-2.5 text-[13px] text-gray-600">
                    <p><strong className="text-[#111]">{s.contact.name}</strong></p>
                    <p>{s.contact.dept}</p>
                    <p>{s.contact.address}</p>
                    <p>
                      Email:{" "}
                      <a href={`mailto:${s.contact.email}`} className="text-[#9EC84A] underline underline-offset-2">
                        {s.contact.email}
                      </a>
                    </p>
                    <p>Office hours: {s.contact.hours}</p>
                    <p className="text-[#111] font-medium">{s.contact.resolution}</p>
                  </div>
                )}
                {"note" in s && s.note && (
                  <p className="mt-4 text-[12px] text-[#9EC84A] font-medium">{s.note}</p>
                )}
              </div>
            ))}

            {/* Related links */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              <Link
                href="/terms-and-conditions"
                className="text-[12px] text-gray-500 hover:text-[#9EC84A] transition-colors underline underline-offset-2"
              >
                Terms &amp; Conditions →
              </Link>
              <Link
                href="/grievance"
                className="text-[12px] text-gray-500 hover:text-[#9EC84A] transition-colors underline underline-offset-2"
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
