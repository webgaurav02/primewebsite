const items = [
  "2847+ CM Elevate Graduates",
  "1350+ Registered Startups",
  "885+ Funding Cases Supported",
  "459 BFS Sector Startups",
  "353 Incubation Cohort Members",
  "287 Rural Enterprises",
  "Shillong · Tura · Nongpoh",
  "Est. 2019",
];

const text = items.join("   ·   ");

export default function Marquee() {
  return (
    <div className="bg-[#9EC84A] py-3.5 overflow-hidden">
      <div className="animate-marquee select-none">
        {[text, text].map((t, i) => (
          <span key={i} className="flex items-center pr-20 text-[11px] font-bold tracking-[0.2em] uppercase text-black whitespace-nowrap">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
