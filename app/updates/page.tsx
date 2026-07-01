"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { HiDownload, HiPlay, HiArrowRight } from "react-icons/hi";
import { articles, CATEGORIES, type Category, type Article } from "@/lib/updates-data";

function ArticleCard({ post }: { post: Article }) {
  const isReadable = !post.download && !post.video && post.content;

  return (
    <article className="group flex flex-col">

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.05] mb-5">
        {post.img ? (
          <>
            <Image
              src={post.img}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#f5f5f5] border border-dashed border-black/[0.12]">
            <div className="w-10 h-10 bg-black/[0.05] flex items-center justify-center mb-3">
              {post.download ? <HiDownload className="text-black/20" size={20} /> :
               post.video   ? <HiPlay     className="text-black/20" size={20} /> :
               <HiArrowRight className="text-black/20" size={20} />}
            </div>
            <p className="font-semibold tracking-[0.2em] uppercase text-black/20" style={{ fontSize: "9px" }}>
              {post.category}
            </p>
          </div>
        )}

        {post.video && post.img && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HiPlay className="text-[#1B4332] ml-1" size={22} />
            </div>
          </div>
        )}

        {post.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1B4332] text-white font-bold tracking-[0.18em] uppercase" style={{ fontSize: "9px" }}>
            Featured
          </span>
        )}
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="border border-black/20 px-2.5 py-1 font-semibold tracking-[0.15em] uppercase text-black/50" style={{ fontSize: "10px" }}>
          {post.category}
        </span>
        <span className="text-black/25 font-medium" style={{ fontSize: "10px" }}>{post.date}</span>
        {post.readTime && (
          <>
            <span className="text-black/15">·</span>
            <span className="text-black/25 font-medium" style={{ fontSize: "10px" }}>{post.readTime}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h2
        className="font-black text-black leading-snug mb-3 transition-colors duration-200 group-hover:text-[#2D6A4F]"
        style={{ fontSize: "var(--text-body)" }}
      >
        {post.title}
      </h2>

      {/* Excerpt */}
      <p className="text-black/45 leading-relaxed mb-5 flex-1" style={{ fontSize: "var(--text-sm)" }}>
        {post.excerpt}
      </p>

      {/* CTA */}
      {post.download ? (
        <a
          href={post.downloadHref ?? "#"}
          download
          className="inline-flex items-center gap-2 font-semibold text-[#2D6A4F] hover:gap-3 transition-all duration-200 self-start"
          style={{ fontSize: "var(--text-sm)" }}
        >
          <HiDownload size={15} /> Download PDF
        </a>
      ) : post.video ? (
        <a
          href={post.videoHref ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-[#2D6A4F] hover:gap-3 transition-all duration-200 self-start"
          style={{ fontSize: "var(--text-sm)" }}
        >
          <HiPlay size={15} /> Watch video
        </a>
      ) : isReadable ? (
        <Link
          href={`/updates/${post.slug}`}
          className="inline-flex items-center gap-2 font-semibold text-[#2D6A4F] hover:gap-3 transition-all duration-200 self-start"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Read more <HiArrowRight size={14} />
        </Link>
      ) : null}
    </article>
  );
}

export default function UpdatesPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? articles : articles.filter((a) => a.category === active);

  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Resources"
        title="PRIME Updates"
        subtitle="Success stories, programme news, newsletters, catalogues, brochures, and videos from across the PRIME ecosystem."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-14 border-b border-black/[0.07] pb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 font-semibold tracking-[0.12em] uppercase transition-all duration-200 ${
                  active === cat
                    ? "bg-[#1B4332] text-white"
                    : "bg-black/[0.04] text-black/50 hover:bg-black/[0.08] hover:text-black"
                }`}
                style={{ fontSize: "11px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {filtered.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-black/35 text-center py-24" style={{ fontSize: "var(--text-body)" }}>
              No posts in this category yet.
            </p>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
