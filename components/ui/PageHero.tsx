import MeshGradient from "@/components/ui/MeshGradient";

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
    >
      {/* Animated mesh gradient — fills the whole hero */}
      <MeshGradient className="absolute inset-0 w-full h-full" />

      {/* Dot grid overlay — adds geometric structure over the organic blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(116,198,157,0.08) 1px, transparent 1px)",
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
          <path d={d} stroke="#74C69D" strokeWidth="1" opacity="0.30" />
        </svg>
      ))}

      {/* Concentric circles — right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[58%] pointer-events-none">
        {[560, 400, 270, 160].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-white/[0.06]"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Bottom accent rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(116,198,157,0.30) 30%, rgba(116,198,157,0.30) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-6 h-px bg-[#2D6A4F]" />
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
