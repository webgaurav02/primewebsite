"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import type { PrimeIdCardDTO } from "@/lib/dal/prime-id";

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

export default function PrimeIdCard({
  card,
  preview = false,
}: {
  card: PrimeIdCardDTO;
  /** Live preview before issue: hide the download button (no QR/id yet). */
  preview?: boolean;
}) {
  const [qr, setQr] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(card.verifyUrl, { errorCorrectionLevel: "M", margin: 1, width: 240 })
      .then(setQr)
      .catch(() => {});
  }, [card.verifyUrl]);

  async function download() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${card.id}.png`;
    a.click();
  }

  const role = card.customRoleLabel || HOLDER_LABEL[card.holderType] || card.holderType;

  return (
    <div className="flex flex-col items-center gap-4">
      {card.status === "revoked" && (
        <p className="w-full rounded-md bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700">
          This credential has been revoked.
        </p>
      )}

      <div
        ref={cardRef}
        className="w-[340px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10"
      >
        <div className="bg-[#1B4332] px-6 py-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#74C69D]">
            Government of Meghalaya
          </p>
          <p className="mt-0.5 text-lg font-black tracking-tight text-white">PRIME ID</p>
        </div>

        <div className="px-6 py-5 text-center">
          {card.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.photoDataUrl}
              alt={card.fullName}
              className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-[#1B4332]/15"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1B4332]/10 text-2xl font-bold text-[#1B4332]">
              {card.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
          )}
          <p className="mt-3 text-lg font-bold text-black">{card.fullName}</p>
          <p className="text-sm text-black/50">{role}</p>
          {card.category && (
            <p className="mt-0.5 text-xs text-[#2D6A4F]">{CATEGORY_LABEL[card.category]}</p>
          )}

          <div className="mt-4 flex items-center justify-center">
            {qr && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt="Verify QR" width={132} height={132} className="rounded" />
            )}
          </div>

          <p className="mt-3 font-mono text-sm font-semibold tracking-wide text-black">{card.id}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-left text-[11px] text-black/60">
            <div><span className="text-black/35">District</span><br />{card.district}</div>
            <div className="text-right"><span className="text-black/35">Valid thru</span><br />{card.validThru}</div>
          </div>
          {card.ventureName && (
            <p className="mt-2 text-[11px] text-black/50">{card.ventureName}</p>
          )}
          <p className="mt-3 border-t border-black/10 pt-2 font-mono text-[9px] text-black/30">
            {card.tokenFingerprint}
          </p>
        </div>
      </div>

      {preview ? (
        <p className="text-xs text-zinc-400">Live preview — issue to sign &amp; enable download.</p>
      ) : (
        <button
          onClick={download}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Download card (PNG)
        </button>
      )}
    </div>
  );
}
