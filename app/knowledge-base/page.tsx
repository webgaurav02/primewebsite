"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";

type KBArticle = { q: string; a: string };
type KBCategory = { id: string; label: string; count: number; articles: KBArticle[] };

const CATEGORIES: KBCategory[] = [
  {
    id: "funding",
    label: "PRIME Entrepreneurship Funds",
    count: 8,
    articles: [
      {
        q: "What are the PRIME Entrepreneurship Funds?",
        a: "The Government of Meghalaya recognises that access to funding and credit is a major constraint in the operations and scaling up of a business. PRIME provides easy access to various funding channels for entrepreneurs of Meghalaya — depending on their type of business, traction, status and industry. With the support of these funds and other support measures, PRIME is creating an enabling and nurturing ecosystem for entrepreneurship in Meghalaya.",
      },
      {
        q: "Who is eligible for PRIME Entrepreneurship Funding?",
        a: "Any registered (e.g. Pvt. Ltd., LLP, OPC, Sole Proprietorship) and unregistered entrepreneur and community-driven enterprise (e.g. IVCS, PG, SHG) may apply for funding on the PRIME portal. Entrepreneurs who have applied for and received a PRIME ID and have been classified as Startup Entrepreneurs or Nano Entrepreneurs can apply for funding. Entrepreneurs are advised to read the profiles of the individual funding vehicles diligently to understand whether they are eligible for their specific type of business.",
      },
      {
        q: "How do I select the right funding option?",
        a: "For existing businesses, three options are available:\n\n1) PRIME Kickstart Grant — For innovative/unique businesses. Used only for R&D and product development. Up to ₹5 Lakhs, non-returnable grant.\n\n2) PRIME Innovation Scaleup Loan — For existing businesses wanting to scale up or extend operations (e.g. new warehouse, machinery). Up to ₹25 Lakhs, interest-free, collateral-free loan, 5-year term, 6-month moratorium. Requires full-time commitment.\n\n3) NESFB Zero-Interest Loan I — For existing food processing entrepreneurs scaling up. Up to ₹25 Lakhs, interest-free, collateral-free, up to 4-year term, 6-month moratorium.\n\nFor aspiring entrepreneurs starting a new food processing business, NESFB Zero-Interest Loan II is available for up to ₹5 Lakhs on the same terms.\n\nAll funds are only available for entrepreneurs and businesses residing within Meghalaya. Preference is given to registered companies (Pvt. Ltd., OPC, LLP) and registered organisations (Societies, Trusts, Section-8).",
      },
      {
        q: "How can I apply? How do I fill the application form?",
        a: "The application process is through a single window on the PRIME website for all funding options. Application windows are open for a fixed period (e.g. 2 months) before closing for processing. After evaluations and disbursals are complete, the window reopens. Follow PRIME on Social Media and subscribe to the newsletter to get updates.\n\nThe application form is split in two parts. Part 1 is a general description of the project, filled directly on the website. Part 2 is a detailed project plan with financials, filled in a downloadable Excel template which is then uploaded. Key fields include: funding option selected, project title, PRIME ID (auto-filled), total investment amount, own contribution, amount requested, project location, and a project description.",
      },
      {
        q: "How is the evaluation done? How long until disbursal?",
        a: "After closing of the application window, the PRIME team reviews all applications. After an initial completeness check, applications are sorted by fund type. For funds processed directly through PRIME, a multi-stage review and evaluation takes place — including a jury of senior government officers and banking/industry professionals who score applications against a predefined evaluation matrix. For funds processed through partners, those partners run their own evaluation.\n\nPRIME strives to give feedback to rejected applicants on what can be improved. The full review, evaluation and disbursal process may take up to eight weeks or more depending on information collection and total applications received. Women entrepreneurs, specially-abled and grass-root level entrepreneurs receive preferential treatment.",
      },
      {
        q: "What are the criteria for PRIME Funding Applicants?",
        a: "Key criteria include:\n• Entrepreneur cannot apply for both the PRIME Kickstart Grant and the Innovation Scaleup Loan at the same time.\n• Only one member from a family is eligible for the scheme.\n• Individual applicants must be above 18 and below 60 years of age.\n• Only permanent residents of Meghalaya can avail funding. In partnerships, majority share (51%+) must be held by Meghalaya residents.\n• Government employees are not eligible.\n• Applicants for the Innovation Scaleup Loan must have an existing business in Meghalaya with demonstrable traction or revenues.\n• Departmental stores, Kirana stores, general stores or similar reselling businesses are not eligible.\n• Entrepreneurs who have previously received the Kickstart Grant cannot re-apply for the same.\n• Utilization period for both grants and loans is a maximum of 18 months. Utilization certificates with original bills must be provided.\n• Diversion of funds without explanation will result in an immediate 15% interest charge.",
      },
      {
        q: "What documentation do entrepreneurs provide after funds are disbursed?",
        a: "Entrepreneurs selected for funding must provide comprehensive documentation on how they utilise the funds — for example, invoices and bills. Many selected entrepreneurs also participate in a coaching programme where experienced industry professionals guide them towards efficient and sustainable utilisation of funds. All funded entrepreneurs are obliged to regularly deliver status reports and update the PRIME team with the latest revenue, employment and other company figures.",
      },
      {
        q: "How does the PRIME Student Tinkering Fund work?",
        a: "Eligibility: Only students from academic institutes financially supported through PRIME and the EPDP (Entrepreneurship Promotion and Development Programme) are eligible. Institutes become eligible after receiving a sanction letter from PRIME/MBMA, completing the official EPDP inauguration, and signing the MoU.\n\nStudents must be regularly enrolled in Meghalaya. Individual students may only apply once per project, and a group cannot submit multiple applications for the same project. Maximum project duration is 6 months or one academic semester, whichever is longer.\n\nProcess: The institute prepares and pre-screens applications → forwards promising ones to PRIME → PRIME Selection Committee screens and scores → funds sanctioned or feedback provided → institute provides ongoing support → reporting and follow-up.\n\nSix funding cycles are conducted every year, with cutoff dates on the 30th of alternating months (Sep, Nov, Jan, Mar, May, Jul). Applications scoring 51+ points (out of 100) are approved.",
      },
    ],
  },
  {
    id: "skills",
    label: "Entrepreneurship Skills",
    count: 4,
    articles: [
      {
        q: "What are the state-supported incubators and accelerators in Meghalaya?",
        a: "The Government of Meghalaya currently supports several incubators and accelerators in the state. PRIME is actively working on expanding the incubator ecosystem by enabling colleges, universities and other organisations to establish new incubators across the state. For the most up-to-date list of supported incubators, visit the Incubation section on the PRIME website or contact your nearest PRIME Startup Hub in Shillong, Tura, or Nongpoh.",
      },
      {
        q: "How can an entrepreneur avail incubation support?",
        a: "Every year PRIME identifies the most promising entrepreneurs of the state through the Chief Minister's E-Champion Challenge. Applications are open once a year via the PRIME portal for a 6-week window. Applications are evaluated anonymously across five parameters: innovation, market potential, social impact, revenue model, and business model.\n\nThe top 100 applicants advance to a pitching phase (pitch deck, pitch video, and a 5-minute live pitch with 10-minute Q&A before a jury of entrepreneurs, government officials and industry professionals). The top 75 are then selected for incubation over a period of 9 months.\n\nFollow PRIME on Social Media and subscribe to the newsletter for announcements of the next application window.",
      },
      {
        q: "How can an entrepreneur avail mentoring support?",
        a: "PRIME has two layers of mentoring:\n\n1) Closed mentoring — exclusively for entrepreneurs in the incubation, pre-incubation and acceleration programmes under PRIME. This mentoring is customised, coordinated and scheduled by the PRIME team as per each entrepreneur's individual incubation plan.\n\n2) Public mentoring — accessible to every entrepreneur in Meghalaya who is registered on the Entrepreneur Portal and has received a PRIME ID and classification as a Startup, Nano or Livelihood Entrepreneur. These mentors are available free-of-cost. A call can be requested via the Entrepreneur Portal.",
      },
      {
        q: "What government departments offer support for entrepreneurs?",
        a: "PRIME collaborates closely with many Government Departments in the state to build a comprehensive entrepreneurship ecosystem. The Meghalaya State Skills Development Society (MSSDS) under the Ministry of Skill Development and Entrepreneurship offers empanelment of entrepreneurs as Training Providers (website: mssds.nic.in). More details about individual department support offerings are available on the respective department websites. Visit the PRIME portal or contact support@primemeghalaya.com for the latest list of partner departments.",
      },
    ],
  },
  {
    id: "general",
    label: "General & Others",
    count: 9,
    articles: [
      {
        q: "What are the different classifications of entrepreneurs when registering for a PRIME ID?",
        a: "Eligible Entrepreneurs in Meghalaya are classified into three types during PRIME ID registration, based on the details provided:\n\nStartup Entrepreneur — Innovation-based businesses with unique, value-added products or services. Have the potential to grow beyond 20 employees and scale beyond Meghalaya. Examples: EduTech platforms, innovative food products using local produce, new manufacturing technologies, e-commerce platforms for local artisans.\n\nNano Entrepreneur — Non-innovation based businesses that utilise local resources to solve local needs, typically employing up to 20 people within the local village, block or district. Examples: homestays, food processing units, bakeries, bamboo crafts, adventure sports operators.\n\nLivelihood Entrepreneur — Solo entrepreneurs operating at a very local level to cover family livelihood needs. Examples: farming, weaving, livestock rearing.\n\nIt is critical to provide an elaborate description and pictures of your products/services during registration, as the classification is based on the information you provide.",
      },
      {
        q: "What is the definition and criteria for a Startup recognition in Meghalaya?",
        a: "Under the PRIME programme, a Startup is defined as an entity where:\n\n• The date of incorporation, registration, or commencement of commercial operations is not prior to seven years.\n• Annual turnover does not exceed ₹25 crore for any preceding financial year.\n• The startup is working towards innovation/improvement of existing products, services and processes, and has the potential to generate employment or create wealth.\n• It is registered in Meghalaya, or employs at least 60% of its total qualified workforce from Meghalaya (excluding contract employees).\n• It is not an extension of an existing family business or formed by splitting/reconstruction of an existing business.\n\nStartups can be in any form of registered or unregistered entity, with the intention to formalise and incorporate within a reasonable timeframe.",
      },
      {
        q: "What state-level approvals and clearances are required to operate a Startup in Meghalaya?",
        a: "Every entrepreneur/startup adhering to the official PRIME definition may register on the Entrepreneur Portal for recognition as a Startup. You will need to upload details about your products and a short description of your business and its innovative features. The startup will be evaluated and assigned to one of three categories (Startup, Nano Entrepreneur, Livelihood Entrepreneur).\n\nOnce you receive your PRIME ID and are categorised as 'Startup', you are officially recognised by the state and will receive a Meghalaya Startup Certificate and access to various support measures. There are no further separate state-level approvals or clearances required to operate a startup in Meghalaya.",
      },
      {
        q: "What special incentives are provided to women entrepreneurs and grass-root level innovators?",
        a: "PRIME has instituted special inclusive provisions:\n\nWomen-Led Startups: A women-led startup is one recognised by the Government of Meghalaya under PRIME with at least one woman as founder, co-founder, and/or CXO. 20% of incubation seats (10 out of 50) and 20% of the PRIME Kickstart Grant and Innovation Scaleup Loan funds are reserved for women-led startups.\n\nGrass-Root Level Innovators: A grass-root level innovator is a startup working towards low-cost, commercially viable innovation aimed at improving productivity, infrastructure, living conditions, employment, livelihood or community facilities in a rural context. 20% of incubation seats (10 out of 50) and 10% of the PRIME Kickstart Grant and Innovation Scaleup Loan funds are reserved for such innovators. Additional support includes capacity building, mentoring, office/co-working space and marketing support.",
      },
      {
        q: "What are the modalities to apply for office or co-working space at the PRIME Startup Hubs?",
        a: "Every entrepreneur with a PRIME ID may apply for office and/or co-working space at the PRIME Startup Hubs in Shillong, Tura, or Nongpoh. Applications must be submitted via the Entrepreneur Portal only.\n\nDedicated Office Chambers: Minimum 75% occupancy on a monthly average; reviewed every 3 months. Standard occupancy period is 6 months, renewable once for up to 1 year in total.\n\nFlexible Coworking Space: No dedicated seats; first-come-first-serve. Maximum 5 team members from one startup. Minimum 3–4 visits per month expected. Standard period is 6 months, renewable once.\n\nMeeting Rooms/Auditoriums: Bookable on an ad-hoc basis via the Hub frontdesk for meetings, training or events.\n\nAll facilities are currently free-of-cost, subject to revision with 4 weeks' advance notice. Note: the PRIME Startup Hub address cannot currently be used for company registration.",
      },
      {
        q: "What are the terms and requirements to register as a mentor under PRIME?",
        a: "PRIME is keen on onboarding seasoned entrepreneurs and experienced industry professionals as mentors. Mentors from across India may register. The onboarding process includes a short 30-minute call with a PRIME team member.\n\nMentoring under PRIME is at zero cost to entrepreneurs. Mentors provide their support on a voluntary, unremunerated basis. While there is no minimum hour requirement, PRIME mentors typically spend around 1–2 hours per week. PRIME provides a Mentor Certificate after completing a total of 5 mentoring hours (self-certified basis).",
      },
      {
        q: "What public procurement support is available through PRIME?",
        a: "Meghalaya's Startup Policy of 2018 mandates that 20% of all public procurement shall be through Startups. PRIME includes the following relaxations in all its tenders and RFPs:\n\n• Prior turnover and prior experience requirements may be relaxed for Startups registered in Meghalaya (subject to quality and technical specifications).\n• Startups duly registered in Meghalaya are exempted from submission of EMD (Earnest Money Deposit).\n\nAdditionally, PRIME facilitates between entrepreneurs and government departments/organisations that have not included Startup relaxations in their tenders. To request PRIME's support, apply for a PRIME ID and submit a grievance under the 'Public Procurement' category with full details of the tender/RFP.",
      },
      {
        q: "How can I submit a grievance? How will it be addressed?",
        a: "Grievances can be submitted via the Entrepreneur Portal after registering. The escalation process is:\n\nLevel 0 — PRIME Administrative Team (within 40 days): The team registers the complaint, evaluates it and sends a notification of receipt within 10 days. The grievance is then forwarded to the relevant officer, department or location for resolution within a further 30 days.\n\nLevel 1 — Programme Heads, PRIME Meghalaya (within 30 days): If unresolved at Level 0, it escalates to the respective Programme Head.\n\nLevel 2 — Director, MBMA/MIE (within 30 days): If unresolved at Level 1, it escalates to the Director of MBMA/MIE.\n\nLevel 3 — CEO, MBMA (within 60 days): The final escalation for unresolved grievances. PRIME is committed to resolving all justified grievances transparently and at the earliest opportunity.",
      },
      {
        q: "How does the PRIME Entrepreneurship Ambassador Contest work?",
        a: "The PRIME Entrepreneurship Ambassador Contest invites the youth of Meghalaya to promote entrepreneurship across their communities. The objective is to motivate more youth to consider entrepreneurship as a career.\n\nHow to enter: Create a video (minimum 2 minutes) showing how you promote entrepreneurship awareness in your community, school, or college. Upload it on Facebook and Instagram, tag @primemeghalaya, and use hashtags #primemeghalaya and #meghapreneurs.\n\nExample activities: An awareness session with a local entrepreneur; a hackathon or 'Shark Tank'-style ideathon at your school/college; a music video about the benefits of entrepreneurship; showcasing successful Meghalaya entrepreneurs to your community.\n\nSelection criteria: Creativity, quality of video editing, number of Social Media shares, and the level of awareness created.",
      },
    ],
  },
];

export default function KnowledgeBasePage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const category = CATEGORIES.find(c => c.id === activeCat) ?? CATEGORIES[0];
  const totalArticles = CATEGORIES.reduce((s, c) => s + c.articles.length, 0);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          breadcrumb="Entrepreneur Portal"
          title="Knowledge Base"
          subtitle="Answers to common questions about PRIME programmes, funding, and entrepreneurship in Meghalaya."
        />

        <section className="bg-white texture-grid border-t border-black/[0.06]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24">

            {/* Summary row */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-10 border-b border-black/[0.07]">
              <div className="flex items-center gap-10">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <p className="font-black text-black leading-none mb-1" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                      {cat.articles.length}
                    </p>
                    <p className="text-black/35 font-medium" style={{ fontSize: "var(--text-label)" }}>
                      {cat.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-black/30 font-medium" style={{ fontSize: "var(--text-sm)" }}>
                {totalArticles} articles total
              </p>
            </div>

            <div className="grid lg:grid-cols-[240px_1fr] gap-12 lg:gap-16 items-start">

              {/* Sidebar — category nav */}
              <nav className="lg:sticky lg:top-28 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); setOpenArticle(null); }}
                    className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-all border-l-2 ${
                      activeCat === cat.id
                        ? "bg-[#1B4332]/[0.05] border-[#1B4332] text-[#1B4332]"
                        : "border-transparent text-black/45 hover:text-black hover:bg-black/[0.03]"
                    }`}
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    <span className="font-semibold leading-tight">{cat.label}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0 ${
                        activeCat === cat.id
                          ? "bg-[#1B4332] text-white"
                          : "bg-black/[0.07] text-black/35"
                      }`}
                    >
                      {cat.articles.length}
                    </span>
                  </button>
                ))}

                <div className="hidden lg:block mt-8 pt-8 border-t border-black/[0.07]">
                  <p className="text-black/30 font-medium mb-3" style={{ fontSize: "var(--text-label)" }}>
                    Still have questions?
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-[#2D6A4F] font-bold hover:text-[#1B4332] transition-colors"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Contact us <span>{"→"}</span>
                  </Link>
                </div>
              </nav>

              {/* Article accordion */}
              <div>
                <div className="mb-6">
                  <h2 className="font-black text-black" style={{ fontSize: "var(--text-heading)" }}>
                    {category.label}
                  </h2>
                  <p className="text-black/35 mt-1 font-medium" style={{ fontSize: "var(--text-sm)" }}>
                    {category.articles.length} {category.articles.length === 1 ? "article" : "articles"}
                  </p>
                </div>

                <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
                  {category.articles.map((article, idx) => {
                    const key = `${activeCat}-${idx}`;
                    const isOpen = openArticle === key;
                    return (
                      <div key={key}>
                        <button
                          onClick={() => setOpenArticle(isOpen ? null : key)}
                          className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                        >
                          <p
                            className={`font-semibold leading-snug flex-1 transition-colors ${isOpen ? "text-[#1B4332]" : "text-black/80 group-hover:text-black"}`}
                            style={{ fontSize: "var(--text-body)" }}
                          >
                            {article.q}
                          </p>
                          <span className={`flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2D6A4F]" : "text-black/20 group-hover:text-black/40"}`}>
                            <HiChevronDown size={20} />
                          </span>
                        </button>
                        {isOpen && (
                          <div className="pb-6">
                            <div
                              className="text-black/55 leading-[1.9] whitespace-pre-line"
                              style={{ fontSize: "var(--text-body)" }}
                            >
                              {article.a}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile contact prompt */}
                <div className="lg:hidden mt-10 bg-[#1B4332]/[0.04] border border-[#1B4332]/10 p-5 flex items-start gap-4">
                  <HiQuestionMarkCircle className="text-[#2D6A4F] flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-[#1B4332] mb-1" style={{ fontSize: "var(--text-sm)" }}>
                      Can&apos;t find what you&apos;re looking for?
                    </p>
                    <Link href="/contact" className="text-[#2D6A4F] font-bold hover:text-[#1B4332] transition-colors" style={{ fontSize: "var(--text-sm)" }}>
                      Contact PRIME {"→"}
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
