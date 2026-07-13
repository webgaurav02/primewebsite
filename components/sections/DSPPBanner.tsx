import Link from "next/link";

export default function DSPPBanner() {
  return (
    <section className="bg-[#0d2318] border-t border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-8">

        {/* Left — label + heading */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-[#74C69D]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-[#74C69D]/60" style={{ fontSize: "var(--text-label)" }}>
              New Portal
            </p>
          </div>
          <h2 className="font-black text-white leading-[0.9] tracking-tight" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}>
            PRIME DSPP
          </h2>
          <p className="text-white/40 mt-3 max-w-md leading-relaxed" style={{ fontSize: "var(--text-sm)" }}>
            District Startup Promotion Programme — supporting grassroots entrepreneurs across every district in Meghalaya.
          </p>
        </div>

        {/* Right — CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="https://primedspp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#74C69D] text-[#0d2318] font-black hover:bg-white transition-colors duration-300"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Visit PRIME DSPP <span>→</span>
          </a>
          <Link
            href="/prime-dspp"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-white/50 font-semibold hover:border-white/40 hover:text-white transition-all duration-300"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Learn more
          </Link>
        </div>

      </div>
    </section>
  );
}
