interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section id="main-content" className="bg-[#1B4332] pt-32 md:pt-44 pb-14 md:pb-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-6 h-px bg-[#2D6A4F]" />
          <p className="font-semibold tracking-[0.25em] uppercase text-white/30" style={{ fontSize: "0.6875rem" }}>
            {breadcrumb ?? "PRIME Meghalaya"}
          </p>
        </div>
        <h1
          className="font-black text-white leading-[0.9] tracking-tight max-w-4xl"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/40 leading-[1.75] mt-6 max-w-2xl" style={{ fontSize: "1.0625rem" }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
