import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — PRIME Meghalaya",
  description:
    "Terms and conditions governing use of the PRIME Meghalaya website, a Government of Meghalaya initiative.",
};

const clauses = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    body: [
      `By accessing or using primemeghalaya.com (the "Website"), you agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. If you do not agree, please do not use the Website.`,
      `These Terms apply to all visitors, users, and others who access the Website. The Website is operated by the Planning, Investment Promotion & Sustainable Development Department, Government of Meghalaya ("PRIME", "we", "us", or "our").`,
    ],
  },
  {
    id: "nature",
    heading: "2. Nature of the Website",
    body: [
      `This Website is an official digital presence of the PRIME programme, a Government of Meghalaya initiative. It is intended to provide general information about PRIME's programmes, schemes, and entrepreneurship ecosystem in Meghalaya.`,
      `The Website does not constitute a legal or financial advisory service. Decisions based on information on this Website are at the user's own risk.`,
    ],
  },
  {
    id: "use",
    heading: "3. Permitted Use",
    body: [`You may use this Website for lawful purposes only. Specifically, you agree not to:`],
    list: [
      "Use the Website in any manner that could disable, overburden, or impair its functioning.",
      "Attempt to gain unauthorised access to any part of the Website, its servers, or any related system.",
      "Transmit any unsolicited or unauthorised advertising or promotional material.",
      "Introduce viruses, trojans, worms, or other malicious code.",
      "Scrape, crawl, or systematically extract content from the Website without our prior written consent.",
      "Impersonate or misrepresent your affiliation with PRIME, the Government of Meghalaya, or any person.",
    ],
  },
  {
    id: "ip",
    heading: "4. Intellectual Property",
    body: [
      `All content on this Website — including text, graphics, logos, images, audio clips, and software — is either owned by the Government of Meghalaya or used under licence. It is protected by applicable Indian intellectual property laws.`,
      `Content produced by the Government of Meghalaya is generally available under the Government Open Data Licence (GODL-India), unless otherwise stated. You may reproduce content for non-commercial purposes provided you credit "PRIME Meghalaya, Government of Meghalaya".`,
      `The PRIME name, logo, and associated marks are registered marks of the Government of Meghalaya and may not be used without prior written permission.`,
    ],
  },
  {
    id: "links",
    heading: "5. Third-Party Links",
    body: [
      `The Website may contain links to third-party websites, including the PRIME Portal (portal.primemeghalaya.com), partner organisations, and government portals. These links are provided for your convenience.`,
      `We have no control over the content of linked sites and accept no responsibility for them. Inclusion of a link does not constitute an endorsement.`,
    ],
  },
  {
    id: "disclaimer",
    heading: "6. Disclaimer of Warranties",
    body: [
      `The Website and its content are provided "as is" and "as available", without any express or implied warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.`,
      `We do not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components. We reserve the right to modify, suspend, or discontinue any aspect of the Website at any time without notice.`,
      `Information on the Website is provided in good faith but may not be current, complete, or accurate. Always verify critical information directly with the relevant PRIME office.`,
    ],
  },
  {
    id: "liability",
    heading: "7. Limitation of Liability",
    body: [
      `To the maximum extent permitted by applicable law, the Government of Meghalaya and PRIME shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from:`,
    ],
    list: [
      "Your use of, or inability to use, the Website.",
      "Any errors, omissions, or inaccuracies in the content.",
      "Unauthorised access to or alteration of your transmissions or data.",
      "Any other matter relating to the Website.",
    ],
  },
  {
    id: "privacy",
    heading: "8. Privacy",
    body: [
      `Your use of the Website is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.`,
    ],
  },
  {
    id: "accessibility",
    heading: "9. Accessibility",
    body: [
      `We are committed to making this Website accessible to all users, including persons with disabilities, in compliance with applicable Indian standards and guidelines. If you experience accessibility barriers, please contact us so we may assist and improve.`,
    ],
  },
  {
    id: "changes",
    heading: "10. Changes to These Terms",
    body: [
      `We reserve the right to revise these Terms at any time. Changes take effect from the date they are posted. Your continued use of the Website after any changes constitutes your acceptance of the revised Terms.`,
    ],
  },
  {
    id: "governing-law",
    heading: "11. Governing Law and Jurisdiction",
    body: [
      `These Terms are governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the competent courts of Shillong, Meghalaya.`,
    ],
  },
  {
    id: "contact",
    heading: "12. Contact",
    body: [`For questions regarding these Terms, please contact:`],
    contact: {
      name: "PRIME Meghalaya",
      dept: "Planning, Investment Promotion & Sustainable Development Department, Government of Meghalaya",
      email: "info@primemeghalaya.com",
      address: "3rd Floor, Ri Kynmaw Complex, Nongrim Hills, Shillong – 793003, Meghalaya",
    },
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Legal"
        title="Terms & Conditions"
        subtitle="Effective date: 1 January 2025. These terms govern your use of the PRIME Meghalaya website."
      />

      <main id="main-content">
        <section className="bg-white texture-grid py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-12">
            {/* Quick-nav */}
            <div className="p-6 bg-[#f5f5f5] border border-black/[0.07]">
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35 mb-4" style={{ fontSize: "var(--text-label)" }}>
                Contents
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {clauses.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className="text-black/50 hover:text-[#2D6A4F] transition-colors"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {c.heading}
                  </a>
                ))}
              </div>
            </div>

            {clauses.map((c) => (
              <div key={c.id} id={c.id} className="scroll-mt-24">
                <h2
                  className="font-black text-black mb-4 pb-3 border-b border-black/[0.08]"
                  style={{ fontSize: "1.25rem" }}
                >
                  {c.heading}
                </h2>
                {c.body.map((para, i) => (
                  <p key={i} className="text-black/50 leading-[1.85] mb-3" style={{ fontSize: "var(--text-body)" }}>
                    {para}
                  </p>
                ))}
                {"list" in c && c.list && (
                  <div className="mt-3 border-t border-black/[0.08]">
                    {c.list.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 py-3 border-b border-black/[0.08]">
                        <span className="font-black text-[#2D6A4F] shrink-0 mt-0.5" style={{ fontSize: "var(--text-label)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>{item}</p>
                      </div>
                    ))}
                  </div>
                )}
                {"contact" in c && c.contact && (
                  <div className="mt-4 p-6 bg-[#f5f5f5] border border-black/[0.07] space-y-2">
                    <p className="font-bold text-black" style={{ fontSize: "var(--text-body)" }}>{c.contact.name}</p>
                    <p className="text-black/50" style={{ fontSize: "var(--text-sm)" }}>{c.contact.dept}</p>
                    <p className="text-black/50" style={{ fontSize: "var(--text-sm)" }}>{c.contact.address}</p>
                    <p style={{ fontSize: "var(--text-sm)" }}>
                      Email:{" "}
                      <a href={`mailto:${c.contact.email}`} className="text-[#2D6A4F] underline underline-offset-2">
                        {c.contact.email}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Related */}
            <div className="pt-6 border-t border-black/[0.08] flex flex-wrap gap-6">
              <Link
                href="/privacy-policy"
                className="text-black/50 hover:text-[#2D6A4F] transition-colors underline underline-offset-2"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Privacy Policy →
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
