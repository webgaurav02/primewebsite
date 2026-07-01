export type Category = "All" | "Success Stories" | "Updates" | "Newsletter" | "Catalogue" | "Brochure" | "Videos";

export type Article = {
  slug: string;
  category: Exclude<Category, "All">;
  title: string;
  excerpt: string;
  content: string;           // full article body (paragraphs separated by \n\n)
  date: string;
  dateISO: string;
  img: string | null;
  featured?: boolean;
  download?: boolean;
  downloadHref?: string;
  video?: boolean;
  videoHref?: string;
  author?: string;
  readTime?: string;
};

export const CATEGORIES: Category[] = [
  "All", "Success Stories", "Updates", "Newsletter", "Catalogue", "Brochure", "Videos",
];

export const articles: Article[] = [
  {
    slug: "chisa-bakery-story",
    category: "Success Stories",
    title: "From a small kitchen to Meghalaya's favourite bakery — Chisa's story",
    excerpt: "A self-taught baker from Karkutta, North Garo Hills, who turned passion into a thriving local business — now employing five people and training women in baking.",
    date: "March 2024",
    dateISO: "2024-03-15",
    img: "/assets/images/event-1.jpg",
    featured: true,
    author: "PRIME Team",
    readTime: "4 min read",
    content: `Chisa never had formal training. Growing up in Karkutta, a quiet village in North Garo Hills, she baked by instinct — learning from her mother, refining through trial and error, and perfecting recipes that tasted distinctly of home.

When PRIME's field officers visited the district in early 2022, Chisa was already selling baked goods from her kitchen — small batches, word-of-mouth orders, no formal setup. What she lacked was capital, structure, and market access.

PRIME enrolled her in the CM Elevate programme. Within three months, she had a certified commercial kitchen, packaging that reflected her brand, and a listing on the ONDC network. Orders came from Tura, then Shillong, then beyond.

"I never imagined people in Shillong would be eating my bread," she told us during a visit last December. "Now I have five women working with me. We bake every morning and we train every afternoon."

Today, Chisa's Bakery is one of the most recognised artisan food brands in the Garo Hills. She supplies hotels, local supermarkets, and takes bulk orders for corporate events. She also runs weekly baking training sessions for other women in her community — a ripple effect PRIME hoped for but could not have predicted.

Her turnover crossed ₹8 lakhs in FY 2023–24. She is planning a second production unit.

Chisa's story is not exceptional because it is dramatic. It is exceptional because it is replicable. Across Meghalaya, hundreds of entrepreneurs like her are proving that structured, well-resourced support transforms potential into enterprise.`,
  },
  {
    slug: "ezer-wine-success",
    category: "Success Stories",
    title: "EZER Wine: From ₹50,000 to 19 flavours and international recognition",
    excerpt: "Started with minimal capital, Probina grew EZER Wine from 2 flavours to 19 varieties — earning international acclaim while donating 5% of profits to charity.",
    date: "February 2024",
    dateISO: "2024-02-10",
    img: "/assets/images/event-2.jpg",
    author: "PRIME Team",
    readTime: "5 min read",
    content: `Probina Marak started EZER Wine in 2020 with ₹50,000 and two flavours — rice wine and passion fruit. Today, EZER carries 19 distinct varieties, ships across seven states, and has been featured at international food and beverage expos.

The name EZER means "helper" in Hebrew — a deliberate choice by Probina, who designed the business as much around community as commerce. Five percent of all profits go directly to supporting widows and orphans in her district.

PRIME supported EZER at a critical moment: when demand outgrew capacity. The Incubation Programme gave Probina access to food-grade production facilities, compliance guidance for FSSAI certification, and a mentor who had scaled an FMCG brand. She used that support to industrialise production without losing the handcrafted character of her wines.

"The hardest thing was learning to say no," Probina says. "When orders came in faster than I could produce, I had to slow down, fix the process, then scale. PRIME helped me think like a business owner, not just a maker."

EZER won a regional food innovation award in 2023. It was also featured at the Act East Business Show, where Probina secured two institutional buyers and a distributor for Assam.

The brand now employs eleven people, nine of whom are women from Probina's village.`,
  },
  {
    slug: "bakyrshan-food-truck",
    category: "Success Stories",
    title: "Bakyrshan Health Food Truck — from bike to wheels",
    excerpt: "From selling juice off his bike in 2021 to running a fully equipped food truck by 2023, Shillong's most inspiring health-focused food brand.",
    date: "January 2024",
    dateISO: "2024-01-20",
    img: "/assets/images/about-image.jpg",
    author: "PRIME Team",
    readTime: "3 min read",
    content: `In 2021, Bakyrshan cycled through Shillong's streets selling fresh cold-pressed juice from a modified bicycle. He had no shop, no employees, and a cooler box strapped to the back. What he had was conviction: that Meghalaya's fruits deserved a premium health-food brand.

Two years later, Bakyrshan Health Foods operates a fully equipped food truck, a small production kitchen, and a regular presence at Shillong's weekend markets. Turnover has grown from near-zero to ₹12 lakhs annually.

The transformation came through a PRIME Rural Linkage grant that enabled Bakyrshan to purchase the truck and kitchen equipment. He also completed PRIME's retail readiness training, learning packaging design, food safety standards, and digital marketing basics.

"The truck was the turning point," he says. "People could see that this was a real business. It changed how they thought about what I was selling."

Bakyrshan's products — cold-pressed juices, jackfruit chips, and a line of turmeric-based wellness drinks — are now stocked in three health food stores in Shillong. He is in conversation with a Guwahati distributor.

He has also become an informal mentor: other young entrepreneurs in his neighbourhood come to him for advice on getting started, on navigating PRIME's programmes, on what worked and what did not.`,
  },
  {
    slug: "cm-elevate-7th-cohort",
    category: "Updates",
    title: "PRIME launches its 7th cohort of the CM's E-Championship",
    excerpt: "75 selected founders join the latest edition of Meghalaya's most prestigious startup challenge — with ₹2 lakh grants, IIM Calcutta mentorship, and Demo Day pitches.",
    date: "April 2024",
    dateISO: "2024-04-05",
    img: "/assets/images/event-3.jpg",
    featured: true,
    author: "PRIME Communications",
    readTime: "3 min read",
    content: `The 7th cohort of the CM's E-Championship officially launched on April 3rd, 2024, bringing together 75 of Meghalaya's most promising early-stage entrepreneurs for a rigorous twelve-week programme.

Selected from over 400 applications across all twelve districts, this cohort represents the full breadth of the state's entrepreneurial landscape — food processing, tourism, handicrafts, technology, healthcare, and agriculture.

Each participant receives a ₹2 lakh non-returnable grant, access to IIM Calcutta's certified entrepreneurship curriculum, one-on-one mentorship from industry experts, and a place on Demo Day — where the most promising ventures pitch to a panel of investors and government stakeholders.

"This cohort is our strongest yet," said the PRIME Director at the launch ceremony in Shillong. "The quality of applications has grown every year. Meghalaya's entrepreneurs are becoming more sophisticated, more market-aware, and more ambitious."

The programme runs through June 2024. A Demo Day is scheduled for the last week of June, open to investors, buyers, and media.

Applications for the 8th cohort will open in August 2024.`,
  },
  {
    slug: "act-east-business-show-2024",
    category: "Updates",
    title: "Act East Business Show 2024 — PRIME at Northeast India's biggest trade expo",
    excerpt: "Over 200 PRIME-supported entrepreneurs showcased their products and secured buyers at the Act East Business Show in Shillong.",
    date: "March 2024",
    dateISO: "2024-03-22",
    img: "/assets/images/team-bg.jpg",
    author: "PRIME Communications",
    readTime: "3 min read",
    content: `The Act East Business Show 2024, held at the Polo Ground Exhibition Centre in Shillong, saw PRIME take its largest-ever contingent of supported entrepreneurs to Northeast India's most significant trade exhibition.

Over 200 PRIME-affiliated businesses occupied a dedicated pavilion spanning 3,000 square metres. Products ranged from artisan food and beverage to handloom, bamboo goods, and digital services.

The three-day event generated an estimated ₹1.8 crore in direct orders and ₹4.5 crore in prospective trade commitments — figures that PRIME will track through follow-up with participating entrepreneurs over the next six months.

Several PRIME entrepreneurs used the expo as a launchpad for institutional tie-ups. EZER Wine secured a distribution agreement with a Guwahati-based FMCG distributor. Three handicraft businesses signed supply agreements with hotel chains operating in the northeast.

"Trade shows like this are not just about sales," said one of PRIME's market linkage officers. "They change how entrepreneurs see their own potential. When a buyer from Delhi wants your product, something shifts."

PRIME will return to Act East Business Show 2025 with an expanded pavilion and a curated selection process to ensure the highest-quality representation.`,
  },
  {
    slug: "2847-cm-elevate-graduates",
    category: "Updates",
    title: "PRIME crosses 2,847 CM Elevate graduates across Meghalaya",
    excerpt: "The CM Elevate programme reaches a milestone — over 2,800 entrepreneurs now trained and supported under the state's flagship credit-linked scheme.",
    date: "February 2024",
    dateISO: "2024-02-28",
    img: "/assets/images/incubation.jpg",
    author: "PRIME Communications",
    readTime: "2 min read",
    content: `PRIME's CM Elevate programme has crossed a significant milestone: 2,847 entrepreneurs have now completed the programme since its launch in 2019, making it one of the most impactful state-level entrepreneurship initiatives in India.

CM Elevate provides a 35–75% cost subsidy to eligible enterprises across fifteen sectors, paired with structured training, mentorship, and market linkage support. The programme is credit-linked, meaning disbursement is tied to demonstrated enterprise activity — ensuring accountability on both sides.

The milestone reflects consistent growth: from 112 graduates in the first cohort to over 400 in each recent batch. The programme now operates simultaneously across all twelve districts, with dedicated PRIME Hubs facilitating local delivery.

A longitudinal study of CM Elevate graduates conducted in 2023 found that 73% of participants reported a measurable increase in turnover within eighteen months of completing the programme. 41% had hired at least one additional employee.

"The number matters," said the PRIME Director. "But what matters more is what those 2,847 people are building — and what they're building for their communities."

Applications for the next CM Elevate batch open in May 2024.`,
  },
  {
    slug: "newsletter-issue-12",
    category: "Newsletter",
    title: "PRIME E-Newsletter — Issue 12",
    excerpt: "This month: fellowship applications open, new training centre launches in Tura, Entrepreneur of the Month spotlight, and funding scheme updates.",
    date: "April 2024",
    dateISO: "2024-04-01",
    img: null,
    download: true,
    downloadHref: "#",
    content: "",
  },
  {
    slug: "newsletter-issue-11",
    category: "Newsletter",
    title: "PRIME E-Newsletter — Issue 11",
    excerpt: "Inside: Act East Business Show recap, CM Elevate new batch announcement, and PRIME Rural expansion into 5 new blocks.",
    date: "March 2024",
    dateISO: "2024-03-01",
    img: null,
    download: true,
    downloadHref: "#",
    content: "",
  },
  {
    slug: "product-catalogue-2024",
    category: "Catalogue",
    title: "PRIME Product Catalogue 2024",
    excerpt: "A curated catalogue of products made by PRIME-supported entrepreneurs — food, fashion, craft, and tech from across Meghalaya.",
    date: "January 2024",
    dateISO: "2024-01-15",
    img: null,
    download: true,
    downloadHref: "#",
    content: "",
  },
  {
    slug: "prime-one-year-journey",
    category: "Brochure",
    title: "PRIME One Year Journey",
    excerpt: "A retrospective of PRIME's first year — milestones, stories, numbers, and the vision that drives Meghalaya's most ambitious entrepreneurship mission.",
    date: "2020",
    dateISO: "2020-12-01",
    img: null,
    download: true,
    downloadHref: "#",
    content: "",
  },
  {
    slug: "prime-ebrochure-2024",
    category: "Brochure",
    title: "PRIME E-Brochure",
    excerpt: "Everything about PRIME in one document — programmes, eligibility, how to apply, and what support looks like at every stage.",
    date: "2024",
    dateISO: "2024-01-01",
    img: null,
    download: true,
    downloadHref: "#",
    content: "",
  },
  {
    slug: "official-film-2023",
    category: "Videos",
    title: "PRIME — Meghalaya's Hub for Entrepreneurs (Official Film)",
    excerpt: "A short documentary on PRIME's journey, impact, and the real entrepreneurs whose lives have been transformed by the programme.",
    date: "2023",
    dateISO: "2023-06-01",
    img: "/assets/images/hero-bg.jpg",
    video: true,
    videoHref: "#",
    content: "",
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null;
}
