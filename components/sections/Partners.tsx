import Image from "next/image";

const partners = [
  {
    name: "Meghalaya Institute of Entrepreneurship",
    src: "/assets/partners/mie.png",
    w: 168, h: 190,
    label: "Implementation Partner",
    href: "https://mie.nic.in",
  },
  {
    name: "MBMA",
    src: "/assets/partners/mbma.png",
    w: 445, h: 155,
    label: "Implementation Partner",
    href: "https://mbma.co.in",
  },
  {
    name: "IIM Calcutta Innovation Park",
    src: "/assets/partners/iim-calcutta.png",
    w: 350, h: 381,
    label: "Knowledge Partner",
    href: "https://www.iiminovationpark.org",
  },
  {
    name: "Startup India",
    src: "/assets/partners/startup-india.png",
    w: 541, h: 140,
    label: "Ecosystem Partner",
    href: "https://www.startupindia.gov.in",
  },
];

export default function Partners() {
  return (
    <section className="bg-white border-t border-black/[0.06] py-14 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center gap-10 md:gap-12">

        <p
          className="font-semibold tracking-[0.25em] uppercase text-black/30"
          style={{ fontSize: "var(--text-label)" }}
        >
          Partners &amp; Affiliations
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {partners.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-4">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-black/[0.08] bg-white flex items-center justify-center px-6 py-8 hover:border-[#2D6A4F]/40 hover:shadow-[0_0_0_1px_rgba(45,106,79,0.2)] transition-all duration-300 group"
                aria-label={`Visit ${p.name} website`}
              >
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  className="grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 object-contain"
                  style={{
                    height: "clamp(36px, 5vw, 56px)",
                    width: "auto",
                    maxWidth: "100%",
                  }}
                />
              </a>
              <p
                className="font-medium text-black/40 text-center"
                style={{ fontSize: "var(--text-label)" }}
              >
                {p.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
