import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { verifyPrimeIdToken } from "@/lib/dal/prime-id";
import { slidingWindow } from "@/lib/security/rate-limit";

export const metadata: Metadata = {
  title: "Verify PRIME ID",
  robots: { index: false },
};

// Single-use token check — never cache.
export const dynamic = "force-dynamic";

const HOLDER_LABEL: Record<string, string> = {
  entrepreneur: "Entrepreneur",
  mentor: "Mentor",
  other: "Member",
};
const CATEGORY_LABEL: Record<string, string> = {
  startup: "Startup Entrepreneur",
  nano: "Nano Entrepreneur",
  livelihood: "Livelihood Entrepreneur",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/[0.06] py-2.5 text-sm last:border-0">
      <span className="text-black/40">{label}</span>
      <span className="font-medium text-black text-right">{value}</span>
    </div>
  );
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const token = (await searchParams).t ?? "";
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const rl = slidingWindow(`verify:${ip ?? "unknown"}`, 30, 5 * 60 * 1000);
  const result = rl.ok
    ? await verifyPrimeIdToken(token)
    : { valid: false as const, reason: "Too many checks. Please try again shortly." };

  const c = "valid" in result && result.valid ? result.credential : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f9f9] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Image src="/logo-color.png" alt="PRIME Meghalaya" width={676} height={183} className="h-9 w-auto" priority />
        </div>

        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <div
            className={`px-6 py-5 text-center ${result.valid ? "bg-[#1B4332]" : "bg-red-700"}`}
          >
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              {result.valid ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.4} className="h-6 w-6"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.4} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              )}
            </div>
            <p className="text-lg font-bold text-white">
              {result.valid ? "Valid PRIME ID" : "Not verified"}
            </p>
            {!result.valid && result.reason && (
              <p className="mt-1 text-sm text-white/80">{result.reason}</p>
            )}
          </div>

          {c && (
            <div className="px-6 py-5">
              <Row label="Holder" value={c.fullName} />
              <Row label="PRIME ID" value={c.id} />
              <Row label="Role" value={HOLDER_LABEL[c.holderType] ?? c.holderType} />
              {c.category && <Row label="Category" value={CATEGORY_LABEL[c.category] ?? c.category} />}
              {c.ventureName && <Row label="Venture" value={c.ventureName} />}
              <Row label="District" value={c.district} />
              <Row label="Issued" value={c.issueDate} />
              <Row label="Valid thru" value={c.validThru} />
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-black/30">
          Government of Meghalaya · PRIME Programme
        </p>
      </div>
    </main>
  );
}
