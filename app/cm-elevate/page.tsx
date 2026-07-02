import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import {
  HiTrendingUp,
  HiCurrencyRupee,
  HiLightningBolt,
  HiUsers,
  HiGlobe,
  HiDesktopComputer,
  HiShieldCheck,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const objectives: { title: string; desc: string; Icon: IconType }[] = [
  { title: "Economic Growth",              desc: "Accelerate and sustain economic development through entrepreneurship, job creation, infrastructure development, tourism promotion, and investment in businesses.", Icon: HiTrendingUp },
  { title: "Increase Credit Flow",         desc: "Improve access to loans for aspiring individuals and businesses facing difficulty in obtaining credit — especially marginalised communities and SMEs.", Icon: HiCurrencyRupee },
  { title: "Encourage Entrepreneurship",   desc: "Equip local youth with capital, knowledge, and skills through capacity building programmes and trainings needed to successfully run their businesses.", Icon: HiLightningBolt },
  { title: "Increase Employment",          desc: "Create jobs by encouraging entrepreneurship and helping existing businesses increase their capacity and operational scale.", Icon: HiUsers },
  { title: "Encompass Diverse Needs",      desc: "Cater to diverse needs spanning agriculture, horticulture, animal husbandry, tourism, entertainment, wellbeing, power, and more.", Icon: HiGlobe },
  { title: "Single Window Portal",         desc: "A unified online platform for individuals and registered/unregistered entities to apply for any business venture across various sectors.", Icon: HiDesktopComputer },
  { title: "Financial & Handholding Support", desc: "35–75% subsidy on project costs across various schemes, plus comprehensive handholding and capacity building programmes.", Icon: HiShieldCheck },
];

const sectors = [
  { name: "Sports & Wellness", desc: "Promoting establishment of sporting units and wellness centres serving as platforms for sporting excellence and healthy living." },
  { name: "Cinema Theatre", desc: "Supporting the development of cinema theatres and entertainment venues to promote culture and the creative economy in Meghalaya." },
  { name: "Agriculture Warehouse", desc: "Encouraging construction of modern agricultural warehouses to improve storage, reduce post-harvest losses, and strengthen agri-supply chains." },
  { name: "Common Facility Centre", desc: "Supporting shared production and processing facilities enabling micro-enterprises to scale without individual capital investment." },
  { name: "Polyhouse", desc: "Funding polyhouse construction for high-yield, protected cultivation to boost horticultural output across the state." },
  { name: "Agro Tourism Villa", desc: "Supporting agro-tourism enterprises that blend agriculture with hospitality — creating unique rural experiences and boosting farmer incomes." },
  { name: "Tourism Vehicle", desc: "Enabling tourism-sector entrepreneurs to acquire vehicles for transport, safaris, and experience-led travel products." },
  { name: "Tourism Homestay", desc: "Developing quality homestay accommodation for tourists seeking authentic Meghalayan hospitality in local homes." },
  { name: "Motorcaravan", desc: "Supporting development of motorcaravan tourism experiences that allow travellers to explore Meghalaya's landscapes flexibly." },
  { name: "Piggery", desc: "Building capacity in piggery farming with technical training, infrastructure support, and credit linkages." },
  { name: "Poultry Farming", desc: "Scaling up poultry enterprises in Meghalaya to meet growing demand and improve incomes for rural farmers." },
  { name: "Goat Farming", desc: "Supporting goat farming operations with training, veterinary support, and access to capital for expansion." },
  { name: "Dairy Development", desc: "Growing Meghalaya's dairy sector with modern infrastructure, breed improvement, and milk processing support." },
  { name: "Any Business Venture", desc: "A flexible scheme open to entrepreneurs across all sectors not covered by specific category schemes." },
  { name: "Sericulture & Weaving", desc: "Supporting silk-rearing and weaving enterprises — protecting Meghalaya's rich textile heritage while creating market opportunities." },
];

export default function CMElevatePage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Funding & Schemes"
        title="CM-ELEVATE"
        subtitle="The Chief Minister's flagship credit-linked programme targeting 20,000 entrepreneurs over 5 years — accelerating private-sector-led growth across Meghalaya."
      />

      {/* Quote */}
      <section className="bg-[#1B4332] py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <blockquote
              className="text-white/70 italic leading-[1.8] mb-8"
              style={{ fontSize: "var(--text-lead)" }}
            >
              &ldquo;The CM-ELEVATE program is the next step to the PRIME program that we had started 5 years back. It targets 20,000 entrepreneurs in the next 5 years. We want to push and support entrepreneurs by giving subsidy, linking with banks allowing you to get easy finance as well as linking you with technology providers. This again is another massive step towards ensuring that we are creating that entrepreneurship spirit and pushing our entrepreneurs to really take that risk, follow that passion, and really bring Meghalaya into the entrepreneurship map.&rdquo;
            </blockquote>
            <p className="text-[#2D6A4F] font-semibold tracking-wide" style={{ fontSize: "var(--text-sm)" }}>
              — Conrad Sangma, Hon&apos;ble Chief Minister of Meghalaya
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                What is CM-ELEVATE?
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "var(--text-heading)" }}
            >
              A state-supported, credit-linked flagship programme
            </h2>
            <p className="text-black/50 leading-[1.8] mb-4" style={{ fontSize: "var(--text-body)" }}>
              CM-ELEVATE is designed to create a conducive environment for entrepreneurs to accelerate private-sector-led growth. The programme stimulates economic development through increased credit flow, entrepreneurship development, and job creation.
            </p>
            <p className="text-black/50 leading-[1.8]" style={{ fontSize: "var(--text-body)" }}>
              Financial support ranging from <strong className="text-black">35% to 75% of project cost</strong> is provided to selected applicants across a wide range of sectors — from agriculture and tourism to entertainment and wellness.
            </p>
          </div>
          <ImagePlaceholder label="CM-Elevate Programme" className="aspect-[4/3]" />
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-[#f5f5f5] py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Programme Goals
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Objectives of the programme
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
            {objectives.map((o) => (
              <div key={o.title} className="bg-white p-8 group hover:bg-[#f5f5f5] transition-colors">
                <div className="w-12 h-12 flex items-center justify-center bg-[#74C69D]/20 mb-6">
                  <span className="text-[#2D6A4F]"><o.Icon size={24} /></span>
                </div>
                <h3 className="font-bold text-black mb-3" style={{ fontSize: "var(--text-body)" }}>
                  {o.title}
                </h3>
                <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                  {o.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                Coverage
              </p>
            </div>
            <h2
              className="font-black text-black leading-[0.9] tracking-tight"
              style={{ fontSize: "var(--text-heading)" }}
            >
              Sectors covered under CM-ELEVATE
            </h2>
          </div>
          <div className="border-t border-black/[0.08]">
            {sectors.map((s, i) => (
              <div key={s.name} className="grid grid-cols-[48px_1fr] gap-6 py-5 border-b border-black/[0.08] group hover:bg-[#f5f5f5] px-2 transition-colors">
                <span className="font-black text-black/20 group-hover:text-[#2D6A4F] transition-colors" style={{ fontSize: "var(--text-sm)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-bold text-black mb-1" style={{ fontSize: "var(--text-body)" }}>
                    {s.name}
                  </h3>
                  <p className="text-black/50 leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4332] py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "var(--text-label)" }}>
              Apply Now
            </p>
          </div>
          <h2
            className="font-black text-white leading-[0.9] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Apply for CM-ELEVATE
          </h2>
          <p className="text-white/40 leading-[1.75] mb-10 max-w-lg" style={{ fontSize: "var(--text-lead)" }}>
            Register on the PRIME portal and apply for a scheme that matches your business. Financial support of 35–75% of project cost is available across all covered sectors.
          </p>
          <a
            href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-9 py-4 bg-white text-[#1B4332] font-bold hover:bg-[#74C69D] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Register on PRIME Portal
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
