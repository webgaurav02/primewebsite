import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
      aria-label="Loading"
    >
      <Image
        src="/logo-color.png"
        alt="PRIME Meghalaya"
        width={676}
        height={183}
        style={{ height: "clamp(22px, 2.8vw, 34px)", width: "auto", opacity: 0.85 }}
        priority
      />

      {/* Line loader */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/[0.05]">
        <div className="h-full bg-[#2D6A4F] animate-line-load" />
      </div>
    </div>
  );
}
