"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { profiles, SECTOR_LABELS, DISTRICT_LABELS } from "@/lib/entrepreneurs-data";

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

const sectors = ["all", ...Array.from(new Set(profiles.map((p) => p.sector))).sort()];
const districts = ["all", ...Array.from(new Set(profiles.map((p) => p.district))).sort()];

export default function EntrepreneursDirectoryPage() {
  const [sector, setSector] = useState("all");
  const [district, setDistrict] = useState("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(18);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchSector   = sector === "all"   || p.sector === sector;
      const matchDistrict = district === "all" || p.district === district;
      const matchSearch   = search === "" || `${p.businessName} ${p.entrepreneurName}`.toLowerCase().includes(search.toLowerCase());
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

      <section className="bg-white texture-grid py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 pb-10 border-b border-black/[0.07]">
            <input
              type="text"
              placeholder="Search by name or entrepreneur…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(18); }}
              className="flex-1 border border-black/15 px-4 py-2.5 text-black placeholder:text-black/30 focus:outline-none focus:border-[#2D6A4F] transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            />
            <select
              value={sector}
              onChange={(e) => { setSector(e.target.value); setVisible(18); }}
              className="border border-black/15 px-4 py-2.5 text-black focus:outline-none focus:border-[#2D6A4F] transition-colors bg-white"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Sectors" : (SECTOR_LABELS[s] ?? s)}</option>
              ))}
            </select>
            <select
              value={district}
              onChange={(e) => { setDistrict(e.target.value); setVisible(18); }}
              className="border border-black/15 px-4 py-2.5 text-black focus:outline-none focus:border-[#2D6A4F] transition-colors bg-white"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d === "all" ? "All Districts" : (DISTRICT_LABELS[d] ?? d)}</option>
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
                    key={p.slug}
                    href={`/entrepreneurs/${p.slug}`}
                    className="group flex flex-col"
                  >
                    {/* Square image */}
                    <div className="relative aspect-square overflow-hidden bg-black/[0.06] mb-4">
                      <Image
                        src={`/assets/entrepreneurs-directory/${p.image}`}
                        alt={p.businessName}
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

                    {/* Business name */}
                    <p
                      className="font-black text-black leading-snug group-hover:text-[#2D6A4F] transition-colors duration-200 mb-0.5"
                      style={{ fontSize: "var(--text-body)" }}
                    >
                      {p.businessName}
                    </p>

                    {/* Entrepreneur name */}
                    <p className="text-black/40 font-medium" style={{ fontSize: "var(--text-sm)" }}>
                      {p.entrepreneurName}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Load more */}
              {visible < filtered.length && (
                <div className="text-center mt-14">
                  <button
                    onClick={() => setVisible((v) => v + 18)}
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
