import Image from "next/image";

const partners = [
  { name: "Startup India",                        src: "/assets/partners/startup-india.png", w: 541, h: 140 },
  { name: "IIM Calcutta Innovation Park",         src: "/assets/partners/iim-calcutta.png",  w: 350, h: 381 },
  { name: "MBMA",                                 src: "/assets/partners/mbma.png",           w: 445, h: 155 },
  { name: "Meghalaya Institute of Entrepreneurship", src: "/assets/partners/mie.png",        w: 168, h: 190 },
];

export default function Partners() {
  return (
    <section className="bg-white border-t border-black/[0.06] py-14 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center gap-10 md:gap-12">

        {/* Label */}
        <p
          className="font-semibold tracking-[0.25em] uppercase text-black/30"
          style={{ fontSize: "var(--text-label)" }}
        >
          Partners &amp; Affiliations
        </p>

        {/*
          Mobile  (< 640px): 2-col grid → 2×2
          Tablet  (640–1023px): 4-col grid → single row
          Desktop (1024px+): flex row, centred, larger logos
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row lg:justify-center lg:items-center gap-8 sm:gap-10 lg:gap-20 w-full">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-center"
            >
              <Image
                src={p.src}
                alt={p.name}
                width={p.w}
                height={p.h}
                className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain"
                style={{
                  height: "clamp(40px, 6vw, 64px)",
                  width: "auto",
                  maxWidth: "100%",
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
