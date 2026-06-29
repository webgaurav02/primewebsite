interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section id="main-content" className="bg-[#0d0d0d] pt-20 pb-16 px-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {breadcrumb && (
          <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {breadcrumb}
          </p>
        )}
        <h1 className="text-[36px] md:text-[52px] font-black text-white leading-[1.05] tracking-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-base leading-relaxed mt-4 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
