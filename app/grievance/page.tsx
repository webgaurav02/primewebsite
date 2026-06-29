import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grievance Redressal — PRIME Meghalaya",
  description:
    "Submit complaints, data-protection requests, or general queries to PRIME Meghalaya. Responses within 30 working days as required by the DPDP Act, 2023.",
};

const steps = [
  {
    num: "01",
    heading: "Prepare your grievance",
    detail:
      "Clearly describe your concern — whether it's a data-protection request, a complaint about our services, or a general query. Include your name, contact details, and any reference numbers.",
  },
  {
    num: "02",
    heading: "Submit via email",
    detail:
      "Email your grievance to grievance@primemeghalaya.com with the subject line 'PRIME Grievance — [brief description]'. You may also send a written complaint to our postal address.",
  },
  {
    num: "03",
    heading: "Acknowledgement",
    detail:
      "We will acknowledge your complaint within 3 working days of receipt and provide a reference number for tracking.",
  },
  {
    num: "04",
    heading: "Resolution",
    detail:
      "We aim to resolve all grievances within 30 days of receipt. Complex cases may require additional time; we will keep you informed of progress.",
  },
  {
    num: "05",
    heading: "Escalation",
    detail:
      "If unresolved within 30 days or if you are unsatisfied with the resolution, you may escalate to the Data Protection Board of India (once constituted) for data-related matters, or to the appropriate government authority for other complaints.",
  },
];

const categories = [
  {
    icon: "🔐",
    title: "Data Protection Requests",
    description:
      "Exercise your rights under the DPDP Act, 2023 — request access, correction, or erasure of your personal data held by PRIME.",
    type: "data",
  },
  {
    icon: "📋",
    title: "Programme Complaints",
    description:
      "Complaints about PRIME programmes, schemes, funding applications, selection processes, or conduct of staff.",
    type: "programme",
  },
  {
    icon: "🌐",
    title: "Website Issues",
    description:
      "Report broken links, accessibility barriers, incorrect information, or technical problems on this website.",
    type: "website",
  },
  {
    icon: "❓",
    title: "General Queries",
    description:
      "Questions about eligibility, application processes, scheme details, or any other PRIME-related queries.",
    type: "general",
  },
];

export default function GrievancePage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Contact & Support"
        title="Grievance Redressal"
        subtitle="We are committed to addressing your concerns transparently and promptly. All grievances are handled in accordance with the DPDP Act, 2023 and applicable Government of Meghalaya guidelines."
      />

      <main id="main-content">
        {/* Officer card */}
        <section className="bg-[#0d0d0d] py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Officer info */}
              <div className="bg-[#141414] border border-white/[0.08] rounded-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-[#9EC84A]/15 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9EC84A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9EC84A] font-semibold tracking-[0.2em] uppercase">Designated Officer</p>
                    <h2 className="text-white font-bold text-[15px]">Grievance Officer — PRIME</h2>
                  </div>
                </div>

                <dl className="space-y-4 text-[13px]">
                  <div>
                    <dt className="text-white/35 text-[10px] font-semibold uppercase tracking-wider mb-1">Organisation</dt>
                    <dd className="text-white/80">Department of Commerce &amp; Industries, Government of Meghalaya</dd>
                  </div>
                  <div>
                    <dt className="text-white/35 text-[10px] font-semibold uppercase tracking-wider mb-1">Email</dt>
                    <dd>
                      <a href="mailto:grievance@primemeghalaya.com" className="text-[#9EC84A] hover:text-white transition-colors">
                        grievance@primemeghalaya.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/35 text-[10px] font-semibold uppercase tracking-wider mb-1">Postal Address</dt>
                    <dd className="text-white/70 leading-relaxed">
                      PRIME Meghalaya<br />
                      3rd Floor, Ri Kynmaw Complex<br />
                      Nongrim Hills, Shillong – 793003<br />
                      Meghalaya, India
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/35 text-[10px] font-semibold uppercase tracking-wider mb-1">Office Hours</dt>
                    <dd className="text-white/70">Monday – Friday, 10:00 AM – 5:00 PM<br />(Excluding public holidays)</dd>
                  </div>
                </dl>
              </div>

              {/* Timelines */}
              <div className="space-y-4">
                <h3 className="text-white font-bold text-[15px] mb-5">Response Timelines</h3>
                {[
                  { label: "Acknowledgement", time: "Within 3 working days", color: "bg-[#9EC84A]" },
                  { label: "Resolution (standard)", time: "Within 30 days", color: "bg-[#9EC84A]/70" },
                  { label: "Resolution (complex)", time: "Up to 60 days (with notice)", color: "bg-[#9EC84A]/40" },
                  { label: "Data-protection requests (DPDP Act)", time: "Within 30 days", color: "bg-blue-400/60" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#141414] border border-white/[0.06] rounded-sm p-4">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${t.color}`} />
                    <div className="flex-1">
                      <p className="text-white/80 text-[13px] font-medium">{t.label}</p>
                    </div>
                    <p className="text-[12px] text-white/45 shrink-0">{t.time}</p>
                  </div>
                ))}

                <div className="mt-4 p-4 border border-[#9EC84A]/20 bg-[#9EC84A]/5 rounded-sm">
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    <strong className="text-[#9EC84A]">DPDP Act, 2023:</strong> For data-protection
                    requests, if we fail to respond within 30 days or if you are dissatisfied, you
                    may approach the <strong className="text-white/80">Data Protection Board of India</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grievance categories */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-12">
              <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                Types of Grievances
              </p>
              <h2 className="text-[26px] md:text-[32px] font-black text-[#111] leading-snug">
                What can you report?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((c) => (
                <div
                  key={c.type}
                  className="border border-gray-100 rounded-sm p-6 hover:border-[#9EC84A]/40 transition-colors group"
                >
                  <span className="text-2xl mb-4 block" aria-hidden="true">{c.icon}</span>
                  <h3 className="text-[14px] font-black text-[#111] mb-2">{c.title}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-step process */}
        <section className="bg-[#f9f9f9] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-12">
              <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">How It Works</p>
              <h2 className="text-[26px] md:text-[32px] font-black text-[#111] leading-snug">
                Step-by-step process
              </h2>
            </div>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-[22px] top-10 bottom-10 w-px bg-gray-200 hidden md:block" aria-hidden="true" />
              <div className="space-y-6">
                {steps.map((s) => (
                  <div key={s.num} className="flex gap-6 items-start">
                    <div className="w-11 h-11 rounded-full bg-[#9EC84A] flex items-center justify-center shrink-0 font-black text-black text-[11px] z-10">
                      {s.num}
                    </div>
                    <div className="bg-white border border-gray-100 rounded-sm p-5 flex-1 hover:border-[#9EC84A]/30 transition-colors">
                      <h3 className="text-[14px] font-bold text-[#111] mb-2">{s.heading}</h3>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0d0d0d] py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
            <h2 className="text-[24px] md:text-[32px] font-black text-white mb-4">
              Ready to raise a concern?
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Email us directly — we are a government body and take every complaint seriously.
            </p>
            <a
              href="mailto:grievance@primemeghalaya.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9EC84A] text-black text-[13px] font-bold rounded-sm hover:bg-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              grievance@primemeghalaya.com
            </a>

            <div className="mt-8 flex flex-wrap gap-4 justify-center text-[12px] text-white/35">
              <Link href="/privacy-policy" className="hover:text-[#9EC84A] transition-colors">
                Privacy Policy
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/terms-and-conditions" className="hover:text-[#9EC84A] transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
