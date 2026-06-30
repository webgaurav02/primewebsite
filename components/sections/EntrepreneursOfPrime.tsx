"use client";

import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";

const entrepreneurs = [
  { name: "Cordelia Kharsati",       business: "Mohor",                    sector: "Fashion",              tag: "East Khasi Hills",   img: "/assets/entrepreneurs-directory/Custommahor2.jpg" },
  { name: "Jenifer Suiam",           business: "Laichaphrang Handicraft",  sector: "Handicrafts",          tag: "West Jaintia Hills", img: "/assets/entrepreneurs-directory/Laichphrangprofile.jpg" },
  { name: "Plantina Mujai",          business: "Mei-Ramew Cafe",           sector: "Tourism & Hospitality",tag: "Ri Bhoi",            img: "/assets/entrepreneurs-directory/Meiramewcafecp.jpg" },
  { name: "Tiara Roxettee M Sangma", business: "WEDOA Chocolate",          sector: "Food Processing",      tag: "West Garo Hills",    img: "/assets/entrepreneurs-directory/WEDOAcp.jpg" },
  { name: "Rosemary T Sangma",       business: "Rose Tegite",              sector: "Fashion",              tag: "South Garo Hills",   img: "/assets/entrepreneurs-directory/RoseTegiteprofile.jpg" },
  { name: "Ibajanai Lyngdoh",        business: "Crochet Haven",            sector: "Handicrafts",          tag: "East Khasi Hills",   img: "/assets/entrepreneurs-directory/CrochetHavenprofile.jpg" },
];

export default function EntrepreneursOfPrime() {
  return (
    <section className="bg-white py-24 md:py-36 border-t border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <AnimateIn direction="left">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                The People
              </p>
            </div>
            <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-display)" }}>
              Entrepreneurs<br />
              <span className="text-[#2D6A4F]">of Prime.</span>
            </h2>
          </AnimateIn>
          <AnimateIn direction="right" delay={0.1} className="max-w-xs">
            <p className="text-black/45 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
              Real people. Real businesses. Powered by PRIME across every district of&nbsp;Meghalaya.
            </p>
          </AnimateIn>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {entrepreneurs.map((e, i) => (
            <AnimateIn key={e.name} delay={i * 0.06} direction="up">
              <div className="group cursor-default">
                {/* Square image */}
                <div className="relative aspect-square overflow-hidden bg-black/10 mb-4">
                  <Image
                    src={e.img}
                    alt={e.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className="border border-black/20 px-2.5 py-1 font-semibold tracking-[0.15em] uppercase text-black/50"
                    style={{ fontSize: "10px" }}
                  >
                    {e.sector}
                  </span>
                  <span
                    className="border border-black/20 px-2.5 py-1 font-semibold tracking-[0.15em] uppercase text-black/50"
                    style={{ fontSize: "10px" }}
                  >
                    {e.tag}
                  </span>
                </div>

                {/* Business name */}
                <p className="font-black text-black leading-snug mb-0.5" style={{ fontSize: "var(--text-body)" }}>
                  {e.business}
                </p>
                {/* Entrepreneur name */}
                <p className="text-black/40 font-medium" style={{ fontSize: "var(--text-sm)" }}>
                  {e.name}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  );
}
