import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HiArrowLeft, HiCalendar, HiClock, HiUser } from "react-icons/hi";
import { getArticle, articles } from "@/lib/updates-data";

export function generateStaticParams() {
  return articles
    .filter((a) => a.content)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — PRIME Meghalaya`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article || !article.content) notFound();

  const related = articles
    .filter((a) => a.slug !== slug && a.category === article.category && a.content)
    .slice(0, 3);

  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-[#1B4332] pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
        {article.img && (
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={article.img}
              alt=""
              fill
              className="object-cover opacity-[0.1]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] via-[#1B4332]/90 to-[#1B4332]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-transparent to-transparent" />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-12 text-white/35" style={{ fontSize: "var(--text-label)" }}>
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/updates" className="hover:text-white/60 transition-colors">Updates</Link>
            <span>/</span>
            <span className="text-white/55 truncate max-w-[200px]">{article.category}</span>
          </nav>

          {/* Category + date */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-[#74C69D]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-[#74C69D]" style={{ fontSize: "var(--text-label)" }}>
              {article.category}
            </p>
          </div>

          {/* Title */}
          <h1
            className="font-black text-white leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: "var(--text-display)" }}
          >
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-white/35">
            <span className="flex items-center gap-1.5" style={{ fontSize: "var(--text-sm)" }}>
              <HiCalendar size={14} /> {article.date}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1.5" style={{ fontSize: "var(--text-sm)" }}>
                <HiClock size={14} /> {article.readTime}
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1.5" style={{ fontSize: "var(--text-sm)" }}>
                <HiUser size={14} /> {article.author}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Article image ─────────────────────────────────────── */}
      {article.img && (
        <div className="max-w-4xl mx-auto px-6 lg:px-10 -mt-12 relative z-10 mb-0">
          <div className="relative aspect-[16/7] overflow-hidden">
            <Image
              src={article.img}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      )}

      {/* ── Article body ──────────────────────────────────────── */}
      <article className="max-w-4xl mx-auto px-6 lg:px-10 py-16 md:py-20">

        {/* Lead */}
        <p
          className="text-black/70 leading-[1.8] mb-10 font-medium border-l-2 border-[#74C69D] pl-6"
          style={{ fontSize: "var(--text-lead)" }}
        >
          {article.excerpt}
        </p>

        {/* Body paragraphs */}
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-black/65 leading-[1.85]" style={{ fontSize: "var(--text-body)" }}>
              {para}
            </p>
          ))}
        </div>
      </article>

      {/* ── Related articles ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-black/[0.07] bg-[#f9f9f9] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px bg-[#2D6A4F]" />
              <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
                More {article.category}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/updates/${r.slug}`} className="group">
                  {r.img && (
                    <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-black/[0.05]">
                      <Image
                        src={r.img}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <p className="text-black/30 mb-1.5" style={{ fontSize: "var(--text-label)" }}>{r.date}</p>
                  <p
                    className="font-black text-black group-hover:text-[#2D6A4F] leading-snug transition-colors duration-200"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Back nav ──────────────────────────────────────────── */}
      <div className="bg-[#1B4332] py-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Link
            href="/updates"
            className="inline-flex items-center gap-3 font-semibold text-white/50 hover:text-white transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            <HiArrowLeft size={16} /> Back to all updates
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
