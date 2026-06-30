"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

type Profile = {
  name: string;
  entrepreneur: string;
  district: string;
  sector: string;
  image: string;
  link: string;
};

const profiles: Profile[] = [
  { name: "Mohor", entrepreneur: "Cordelia Kharsati", district: "east-khasi-hills", sector: "fashion", image: "Custommahor2.jpg", link: "https://www.primemeghalaya.com/mohor/" },
  { name: "BTM Arts", entrepreneur: "Bashanbok Myrboh", district: "east-khasi-hills", sector: "handicrafts", image: "btmarts.jpg", link: "https://www.primemeghalaya.com/btm-arts/" },
  { name: "Zero9 Farms", entrepreneur: "Bitchri Sekso Mebitchi R Marak, Damuda D Sangma", district: "south-garo-hills", sector: "food-processing", image: "Zero9Farms.jpg", link: "https://www.primemeghalaya.com/zero9-farms/" },
  { name: "Shangkai", entrepreneur: "Damanbha Khongstia", district: "east-khasi-hills", sector: "tourism-hospitality", image: "Shangkai4.jpg", link: "https://www.primemeghalaya.com/shangkai/" },
  { name: "Four O Four", entrepreneur: "Eveleen E Marbaniang", district: "east-khasi-hills", sector: "handicrafts", image: "FourOFourProfile.jpg", link: "https://www.primemeghalaya.com/four-o-four" },
  { name: "Laichaphrang Handicraft", entrepreneur: "Jenifer Suiam", district: "west-jaintia-hills", sector: "handicrafts", image: "Laichphrangprofile.jpg", link: "https://www.primemeghalaya.com/laichaphrang-handicraft" },
  { name: "Hcollection", entrepreneur: "Hilarious Kharlyngdoh", district: "east-khasi-hills", sector: "fashion", image: "Hcollectionproduct.jpg", link: "https://www.primemeghalaya.com/hcollection/" },
  { name: "JETS 24x7", entrepreneur: "Pynskhemlang W Uriah", district: "east-khasi-hills", sector: "others", image: "jets2.jpg", link: "https://www.primemeghalaya.com/jets-24x7/" },
  { name: "Machine khoh kwai", entrepreneur: "Wanlang Lakuna", district: "east-khasi-hills", sector: "others", image: "Machinekhohkwaiimage.jpg", link: "https://www.primemeghalaya.com/machine-khoh-kwai/" },
  { name: "Zong Hi I", entrepreneur: "Precious Star Tmung", district: "ri-bhoi", sector: "textiles", image: "zonghii.jpg", link: "https://www.primemeghalaya.com/zong-hi-i" },
  { name: "Surwandiam Enterprise AV Production", entrepreneur: "Pondermost Khongkliam", district: "east-khasi-hills", sector: "others", image: "SurwandiamEnterprise3.jpg", link: "https://www.primemeghalaya.com/surwandiam-enterprise-av-production" },
  { name: "Ceefle Venture", entrepreneur: "Babitdor Kharsohtun", district: "east-khasi-hills", sector: "food-processing", image: "ceefleprofile.jpg", link: "https://www.primemeghalaya.com/ceefle-venture" },
  { name: "Crochet Haven", entrepreneur: "Ibajanai Lyngdoh", district: "east-khasi-hills", sector: "handicrafts", image: "CrochetHavenprofile.jpg", link: "https://www.primemeghalaya.com/crochet-haven" },
  { name: "Rose Tegite", entrepreneur: "Rosemary T Sangma", district: "south-garo-hills", sector: "fashion", image: "RoseTegiteprofile.jpg", link: "https://www.primemeghalaya.com/rose-tegite" },
  { name: "Salgro Wood-Carving", entrepreneur: "Thengku Sangma", district: "north-garo-hills", sector: "handicrafts", image: "SalgroWoodCarvingimg.jpg", link: "https://www.primemeghalaya.com/salgro-wood-carving" },
  { name: "Medira handloom", entrepreneur: "Medira G Sangma", district: "west-garo-hills", sector: "textiles", image: "Medirahandloomprofile.jpg", link: "https://www.primemeghalaya.com/medira-handloom" },
  { name: "Cassey Turima", entrepreneur: "Cassey Turima M Marak", district: "west-garo-hills", sector: "handicrafts", image: "CasseyTurima1.jpg", link: "https://www.primemeghalaya.com/cassey-turima" },
  { name: "Rising 26-9", entrepreneur: "Nichang Momin", district: "west-garo-hills", sector: "handicrafts", image: "Risingcp.jpg", link: "https://www.primemeghalaya.com/rising-26-9" },
  { name: "WEDOA chocolate", entrepreneur: "Tiara Roxettee M Sangma", district: "west-garo-hills", sector: "food-processing", image: "WEDOAcp.jpg", link: "https://www.primemeghalaya.com/wedoa-chocolate" },
  { name: "Shillong Agro Solutions", entrepreneur: "Wanlambok Wanshuwa Kshiar Shadap", district: "east-khasi-hills", sector: "food-processing", image: "Shillongagrosolutions3.jpg", link: "https://www.primemeghalaya.com/shillong-agro-solutions/" },
  { name: "LS.Food Products", entrepreneur: "Thruslinda S Sangma", district: "west-garo-hills", sector: "food-processing", image: "Lsfoodproductcp.jpg", link: "https://www.primemeghalaya.com/ls-food-products/" },
  { name: "Mei-Ramew Cafe", entrepreneur: "Plantina Mujai", district: "ri-bhoi", sector: "tourism-hospitality", image: "Meiramewcafecp.jpg", link: "https://www.primemeghalaya.com/mei-ramew-cafe-jingbam-tynrai/" },
  { name: "Boba Bae", entrepreneur: "Lyzander Sohkhlet", district: "east-khasi-hills", sector: "food-processing", image: "Bobabaecp.jpg", link: "https://www.primemeghalaya.com/boba-bae/" },
  { name: "Your Tee Your Style", entrepreneur: "Shano Chelsy M Sangma", district: "west-garo-hills", sector: "others", image: "Yourteeyourstylecp.jpg", link: "https://www.primemeghalaya.com/your-tee-your-style/" },
  { name: "Digital Fuel", entrepreneur: "Mansha Sharma", district: "east-khasi-hills", sector: "technology-it", image: "digitalfuelcp.jpg", link: "https://www.primemeghalaya.com/digital-fuel/" },
  { name: "Soola", entrepreneur: "Glorisa Kalra War & Wanda Kharakor", district: "east-khasi-hills", sector: "fashion", image: "soolaprofile.jpg", link: "https://www.primemeghalaya.com/soola/" },
  { name: "Solipsis Design", entrepreneur: "Rundolf Mawlieh", district: "east-khasi-hills", sector: "technology-it", image: "solipsiscp.jpg", link: "https://www.primemeghalaya.com/solipsis-design" },
  { name: "Rida Sten Food Cottage", entrepreneur: "Niwania I Sten", district: "west-jaintia-hills", sector: "food-processing", image: "Ridastenfoodcottagecp.jpg", link: "https://www.primemeghalaya.com/rida-sten-food-cottage" },
  { name: "Little SunShine Boutique and Nursery", entrepreneur: "Boblyford Thangkhiew", district: "east-khasi-hills", sector: "agriculture-horticulture", image: "Littlesunshinecp.jpg", link: "https://www.primemeghalaya.com/little-sunshine-boutique-and-nursery/" },
  { name: "Sakhiona", entrepreneur: "Sakhihok Lamare", district: "west-jaintia-hills", sector: "food-processing", image: "Sakhionaprofile.jpg", link: "https://www.primemeghalaya.com/sakhiona/" },
  { name: "Bithon Bamboo", entrepreneur: "Bithon D Sangma", district: "east-garo-hills", sector: "handicrafts", image: "Bithonbamboocp.jpg", link: "https://www.primemeghalaya.com/bithon-bamboo" },
  { name: "Nengminja industry", entrepreneur: "Briana Novemchi N. Sangma", district: "west-garo-hills", sector: "fashion", image: "Nengminjaindustrycp.jpg", link: "https://www.primemeghalaya.com/nengminja-industry/" },
  { name: "Level Up", entrepreneur: "Yashraj A. Sangma", district: "west-garo-hills", sector: "technology-it", image: "Levelupcp.jpg", link: "https://www.primemeghalaya.com/level-up-virtual-experience-cafe/" },
  { name: "SJ Visual Art", entrepreneur: "Saljagring N Arengh", district: "west-garo-hills", sector: "others", image: "SJvisualartcp.jpg", link: "https://www.primemeghalaya.com/sj-visual-art" },
  { name: "houseofura.studio", entrepreneur: "Divya K Marak", district: "west-garo-hills", sector: "fashion", image: "houseofurastudiocp.jpg", link: "https://www.primemeghalaya.com/houseofura-studio" },
  { name: "The Tea Story", entrepreneur: "Bibian Momin", district: "west-garo-hills", sector: "food-processing", image: "Theteastorycp.jpg", link: "https://www.primemeghalaya.com/the-tea-story/" },
  { name: "Durama handicrafts", entrepreneur: "Brithing C Marak", district: "south-garo-hills", sector: "handicrafts", image: "Duramahandicrafts2.jpg", link: "https://www.primemeghalaya.com/durama-handicrafts" },
  { name: "Vision To Arts And Fashion Design", entrepreneur: "Larimika Syrti", district: "east-jaintia-hills", sector: "fashion", image: "larimikacp.jpg", link: "https://www.primemeghalaya.com/vision-to-arts-and-fashion-design/" },
  { name: "M/S SARI SOAP", entrepreneur: "Dau Ruhi Sari", district: "west-jaintia-hills", sector: "others", image: "Sarisoapprofilr.jpg", link: "https://www.primemeghalaya.com/m-s-sari-soap/" },
  { name: "Lokki Food Products", entrepreneur: "Lokki M Sangma", district: "east-garo-hills", sector: "food-processing", image: "lokkifoodproductscp.jpg", link: "https://www.primemeghalaya.com/lokki-food-products" },
  { name: "OiHelp", entrepreneur: "Avik Chakraborty", district: "west-garo-hills", sector: "technology-it", image: "oihelpcp.jpg", link: "https://www.primemeghalaya.com/oihelp" },
  { name: "7 United Rice Beer", entrepreneur: "Keenan K Marak", district: "west-garo-hills", sector: "food-processing", image: "7unitedricebeecp.jpg", link: "https://www.primemeghalaya.com/7-united-rice-beer" },
  { name: "Baghmara Campers", entrepreneur: "Mark Pantora M Sangma", district: "south-garo-hills", sector: "tourism-hospitality", image: "Baghmaracamperscp.jpg", link: "https://www.primemeghalaya.com/baghmara-campers" },
  { name: "BANDASAL RURAL RESORT", entrepreneur: "Glorina N Sangma", district: "east-garo-hills", sector: "tourism-hospitality", image: "bandasalcp.jpg", link: "https://www.primemeghalaya.com/bandasal-rural-resort/" },
  { name: "Ong chnae ktoi", entrepreneur: "Paiaemdor LyngdohMawnai", district: "eastern-west-khasi-hills", sector: "handicrafts", image: "OngChnaeKtoicp.jpg", link: "https://www.primemeghalaya.com/ong-chnae-ktoi/" },
  { name: "Mawrie Garments", entrepreneur: "Fiyona Mawrie", district: "east-khasi-hills", sector: "textiles", image: "Mawriegarments5.jpg", link: "https://www.primemeghalaya.com/mawrie-garments-manufacturer/" },
  { name: "Ecommerce Buddy", entrepreneur: "Sudip Kumar Das", district: "west-garo-hills", sector: "technology-it", image: "ecommercebuddylogo.jpg", link: "https://www.primemeghalaya.com/ecommerce-buddy/" },
  { name: "Vox Crest Media", entrepreneur: "Ferdinand Rani", district: "east-khasi-hills", sector: "technology-it", image: "voxcrestmediacp.jpg", link: "https://www.primemeghalaya.com/vox-crest-media/" },
  { name: "Whispering Pines", entrepreneur: "Candida Kharsyntiew", district: "east-khasi-hills", sector: "food-processing", image: "whisperingpines.jpg", link: "https://www.primemeghalaya.com/whispering-pines/" },
  { name: "Marak Food Products", entrepreneur: "Tunila Ch. Marak", district: "east-garo-hills", sector: "food-processing", image: "Marakfoodproductscp.jpg", link: "https://www.primemeghalaya.com/marak-food-products/" },
  { name: "Jency Handicrafts", entrepreneur: "Jency Suchiang", district: "east-jaintia-hills", sector: "handicrafts", image: "Sharakritprofile.jpg", link: "https://www.primemeghalaya.com/jency-handicrafts/" },
  { name: "Sharak Rit", entrepreneur: "Amstrong Shylla", district: "south-west-khasi-hills", sector: "food-processing", image: "Sharakritrlcp.jpg", link: "https://www.primemeghalaya.com/sharak-rit" },
  { name: "Daka Handicraft", entrepreneur: "Dakaeishwami Shadap", district: "east-jaintia-hills", sector: "handicrafts", image: "Dakahandicraft.jpg", link: "https://www.primemeghalaya.com/daka-handicraft" },
];

const SECTOR_LABELS: Record<string, string> = {
  "all": "All Sectors",
  "fashion": "Fashion",
  "handicrafts": "Handicrafts",
  "food-processing": "Food Processing",
  "tourism-hospitality": "Tourism & Hospitality",
  "textiles": "Textiles",
  "technology-it": "Technology & IT",
  "agriculture-horticulture": "Agriculture & Horticulture",
  "others": "Others",
};

const DISTRICT_LABELS: Record<string, string> = {
  "all": "All Districts",
  "east-khasi-hills": "East Khasi Hills",
  "west-khasi-hills": "West Khasi Hills",
  "eastern-west-khasi-hills": "Eastern West Khasi Hills",
  "south-west-khasi-hills": "South West Khasi Hills",
  "ri-bhoi": "Ri Bhoi",
  "east-jaintia-hills": "East Jaintia Hills",
  "west-jaintia-hills": "West Jaintia Hills",
  "east-garo-hills": "East Garo Hills",
  "west-garo-hills": "West Garo Hills",
  "south-garo-hills": "South Garo Hills",
  "north-garo-hills": "North Garo Hills",
};

const SECTOR_COLORS: Record<string, string> = {
  "fashion": "bg-pink-50 text-pink-700 border-pink-200",
  "handicrafts": "bg-amber-50 text-amber-700 border-amber-200",
  "food-processing": "bg-orange-50 text-orange-700 border-orange-200",
  "tourism-hospitality": "bg-sky-50 text-sky-700 border-sky-200",
  "textiles": "bg-purple-50 text-purple-700 border-purple-200",
  "technology-it": "bg-blue-50 text-blue-700 border-blue-200",
  "agriculture-horticulture": "bg-green-50 text-green-700 border-green-200",
  "others": "bg-gray-50 text-gray-600 border-gray-200",
};

const sectors = ["all", ...Array.from(new Set(profiles.map(p => p.sector))).sort()];
const districts = ["all", ...Array.from(new Set(profiles.map(p => p.district))).sort()];

export default function EntrepreneursDirectoryPage() {
  const [sector, setSector] = useState("all");
  const [district, setDistrict] = useState("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(18);

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const matchSector   = sector === "all"   || p.sector === sector;
      const matchDistrict = district === "all" || p.district === district;
      const matchSearch   = search === "" || `${p.name} ${p.entrepreneur}`.toLowerCase().includes(search.toLowerCase());
      return matchSector && matchDistrict && matchSearch;
    });
  }, [sector, district, search]);

  const shown = filtered.slice(0, visible);

  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Community"
        title="Entrepreneurs of PRIME"
        subtitle={`${profiles.length} entrepreneurs across 10 districts — building Meghalaya's most dynamic startup ecosystem.`}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 pb-10 border-b border-black/[0.07]">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or entrepreneur…"
              value={search}
              onChange={e => { setSearch(e.target.value); setVisible(18); }}
              className="flex-1 border border-black/15 px-4 py-2.5 text-black placeholder:text-black/30 focus:outline-none focus:border-[#2D6A4F] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            />
            {/* Sector */}
            <select
              value={sector}
              onChange={e => { setSector(e.target.value); setVisible(18); }}
              className="border border-black/15 px-4 py-2.5 text-black focus:outline-none focus:border-[#2D6A4F] transition-colors bg-white"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {sectors.map(s => (
                <option key={s} value={s}>{SECTOR_LABELS[s] ?? s}</option>
              ))}
            </select>
            {/* District */}
            <select
              value={district}
              onChange={e => { setDistrict(e.target.value); setVisible(18); }}
              className="border border-black/15 px-4 py-2.5 text-black focus:outline-none focus:border-[#2D6A4F] transition-colors bg-white"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {districts.map(d => (
                <option key={d} value={d}>{DISTRICT_LABELS[d] ?? d}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          <p className="text-black/35 font-medium mb-8" style={{ fontSize: "var(--text-sm)" }}>
            Showing {Math.min(shown.length, filtered.length)} of {filtered.length} entrepreneurs
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-black/30 py-24" style={{ fontSize: "var(--text-body)" }}>
              No entrepreneurs match your filters.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {shown.map((p) => (
                  <Link
                    key={p.name}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col"
                  >
                    {/* Square image */}
                    <div className="relative aspect-square overflow-hidden bg-black/[0.06] mb-4">
                      <Image
                        src={`/assets/entrepreneurs-directory/${p.image}`}
                        alt={p.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span
                        className={`border px-2 py-0.5 font-semibold tracking-[0.12em] uppercase ${SECTOR_COLORS[p.sector] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
                        style={{ fontSize: "9px" }}
                      >
                        {SECTOR_LABELS[p.sector] ?? p.sector}
                      </span>
                      <span
                        className="border border-black/15 px-2 py-0.5 font-medium text-black/40"
                        style={{ fontSize: "9px" }}
                      >
                        {DISTRICT_LABELS[p.district] ?? p.district}
                      </span>
                    </div>

                    {/* Name */}
                    <p className="font-black text-black leading-snug group-hover:text-[#2D6A4F] transition-colors duration-200 mb-0.5" style={{ fontSize: "var(--text-body)" }}>
                      {p.name}
                    </p>

                    {/* Entrepreneur */}
                    <p className="text-black/40 font-medium" style={{ fontSize: "var(--text-sm)" }}>
                      {p.entrepreneur}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Load more */}
              {visible < filtered.length && (
                <div className="text-center mt-14">
                  <button
                    onClick={() => setVisible(v => v + 18)}
                    className="px-10 py-4 border border-black/20 font-semibold text-black hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all duration-300"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    Load more — {filtered.length - visible} remaining
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
