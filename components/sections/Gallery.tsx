import Image from "next/image";
import AnimateIn from "@/components/ui/AnimateIn";

const images = [
  { src: "/assets/images/event-1.jpg", label: "Act East Business Show" },
  { src: "/assets/images/event-2.jpg", label: "Incubation Cohort"      },
  { src: "/assets/images/event-3.jpg", label: "PRIME Hub Activity"     },
  { src: "/assets/images/team-bg.jpg", label: "Team & Leadership"      },
  { src: "/assets/home-7.jpg",         label: "PRIME in Action"        },
  { src: "/assets/sectors.jpg",        label: "Sectors Powering PRIME" },
];

export default function Gallery() {
  return (
    <section className="bg-white border-t border-black/[0.06]">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <AnimateIn direction="left">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-px bg-[#2D6A4F]" />
            <p className="font-semibold tracking-[0.25em] uppercase text-black/35" style={{ fontSize: "var(--text-label)" }}>
              Gallery
            </p>
          </div>
          <h2 className="font-black text-black leading-[0.9] tracking-tight" style={{ fontSize: "var(--text-display)" }}>
            PRIME in<br />
            <span className="text-[#2D6A4F]">action.</span>
          </h2>
        </AnimateIn>
        <AnimateIn direction="right" delay={0.1} className="max-w-xs">
          <p className="text-black/45 leading-[1.75]" style={{ fontSize: "var(--text-body)" }}>
            From pitch days to trade shows — a glimpse into the PRIME ecosystem across Meghalaya.
          </p>
        </AnimateIn>
      </div>

      {/* Full-bleed image strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {images.map((img, i) => (
          <AnimateIn key={i} delay={i * 0.04} direction="up">
            <div className="relative aspect-[3/4] overflow-hidden bg-black/10 group">
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-4 left-4 right-4 text-white font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontSize: "11px" }}>
                {img.label}
              </p>
            </div>
          </AnimateIn>
        ))}
      </div>

    </section>
  );
}
