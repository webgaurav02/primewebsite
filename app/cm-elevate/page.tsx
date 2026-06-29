import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const objectives = [
  {
    title: "Economic Growth",
    desc: "Accelerate and sustain economic development through entrepreneurship, job creation, infrastructure development, tourism promotion, and investment in businesses.",
  },
  {
    title: "Increase Credit Flow",
    desc: "Improve access to loans for aspiring individuals and businesses facing difficulty in obtaining credit — especially marginalised communities and SMEs.",
  },
  {
    title: "Encourage Entrepreneurship",
    desc: "Equip local youth with capital, knowledge, and skills through capacity building programmes and trainings needed to successfully run their businesses.",
  },
  {
    title: "Increase Employment",
    desc: "Create jobs by encouraging entrepreneurship and helping existing businesses increase their capacity and operational scale.",
  },
  {
    title: "Encompass Diverse Needs",
    desc: "Cater to diverse needs spanning agriculture, horticulture, animal husbandry, tourism, entertainment, wellbeing, power, and more.",
  },
  {
    title: "Single Window Portal",
    desc: "A unified online platform for individuals and registered/unregistered entities to apply for any business venture across various sectors.",
  },
  {
    title: "Financial & Handholding Support",
    desc: "35–75% subsidy on project costs across various schemes, plus comprehensive handholding and capacity building programmes.",
  },
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
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 max-w-3xl">
          <blockquote className="text-white text-[15px] leading-[1.8] italic mb-5">
            &ldquo;The CM-ELEVATE program is the next step to the PRIME program that we had started 5 years back. It targets 20,000 entrepreneurs in the next 5 years. We want to push and support entrepreneurs by giving subsidy, linking with banks allowing you to get easy finance as well as linking you with technology providers. This again is another massive step towards ensuring that we are creating that entrepreneurship spirit and pushing our entrepreneurs to really take that risk, follow that passion, and really bring Meghalaya into the entrepreneurship map.&rdquo;
          </blockquote>
          <p className="text-[#9EC84A] text-xs font-semibold tracking-wide">— Conrad Sangma, Hon&apos;ble Chief Minister of Meghalaya</p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 max-w-3xl">
          <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">What is CM-ELEVATE?</p>
          <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
            A state-supported, credit-linked flagship programme
          </h2>
          <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
            CM-ELEVATE is designed to create a conducive environment for entrepreneurs to accelerate private-sector-led growth. The programme stimulates economic development through increased credit flow, entrepreneurship development, and job creation.
          </p>
          <p className="text-[13px] text-gray-600 leading-[1.8]">
            Financial support ranging from <strong className="text-[#111111]">35% to 75% of project cost</strong> is provided to selected applicants across a wide range of sectors — from agriculture and tourism to entertainment and wellness.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Programme Goals</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Objectives of the programme
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {objectives.map((o, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-6 hover:border-[#9EC84A]/40 transition-colors group">
                <div className="w-7 h-7 rounded-full bg-[#9EC84A]/10 flex items-center justify-center mb-4 group-hover:bg-[#9EC84A]/20 transition-colors">
                  <span className="text-[#9EC84A] font-black text-xs">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[#111111] mb-2">{o.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Coverage</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Sectors covered under CM-ELEVATE
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((s) => (
              <div key={s.name} className="border border-gray-100 rounded p-5 hover:border-[#9EC84A]/30 transition-colors">
                <h3 className="text-[13px] font-bold text-[#111111] mb-1">{s.name}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-white mb-4">Apply for CM-ELEVATE</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Register on the PRIME portal and apply for a scheme that matches your business. Financial support of 35–75% of project cost is available across all covered sectors.
          </p>
          <a
            href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-9 py-3 rounded-sm bg-[#9EC84A] text-white text-sm font-semibold hover:bg-[#8BB53F] transition-colors"
          >
            Register on PRIME Portal
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
