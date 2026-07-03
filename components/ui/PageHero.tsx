interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

const corners = [
  { pos: "top-5 left-5",     d: "M28 0H0V28" },
  { pos: "top-5 right-5",    d: "M0 0H28V28" },
  { pos: "bottom-5 left-5",  d: "M28 28H0V0" },
  { pos: "bottom-5 right-5", d: "M0 28H28V0" },
];

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section
      id="main-content"
      className="relative pt-32 md:pt-44 pb-14 md:pb-20 border-b border-white/[0.06] overflow-hidden"
      style={{ background: "#0d2318" }}
    >
      {/* Radial gradient spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 20% 40%, rgba(45,106,79,0.42) 0%, transparent 65%),
            radial-gradient(ellipse 55% 75% at 80% 85%, rgba(8,24,16,0.65) 0%, transparent 68%)
          `,
        }}
      />

      {/* Arc lines — right side */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {[200, 330, 470, 620, 780].map((r) => (
          <circle
            key={r}
            cx="95%"
            cy="55%"
            r={r}
            fill="none"
            stroke="rgba(116,198,157,0.05)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(116,198,157,0.065) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Corner L-ornaments */}
      {corners.map(({ pos, d }, i) => (
        <svg
          key={i}
          className={`absolute w-7 h-7 ${pos} pointer-events-none`}
          viewBox="0 0 28 28"
          fill="none"
        >
          <path d={d} stroke="#74C69D" strokeWidth="1" opacity="0.25" />
        </svg>
      ))}

      {/* Bottom accent rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(116,198,157,0.25) 30%, rgba(116,198,157,0.25) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-6 h-px bg-[#74C69D]/50" />
          <p
            className="font-semibold tracking-[0.25em] uppercase text-white/30"
            style={{ fontSize: "0.6875rem" }}
          >
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
          <p
            className="text-white/40 leading-[1.75] mt-6 max-w-2xl"
            style={{ fontSize: "1.0625rem" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
