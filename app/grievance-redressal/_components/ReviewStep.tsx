"use client";

import { EditIcon } from "./icons";
import DpdpNotice from "./DpdpNotice";
import { CONSENT_LABEL } from "@/lib/grievance/consent";

export interface ReviewValues {
  zoneLabel: string;
  subject: string;
  description: string;
  complainantName: string;
  complainantEmail: string;
  complainantPhone: string;
  businessName: string;
  primeId: string;
  attachmentNames: string[];
}

/**
 * Read-only summary mirroring exactly what will POST, with per-row Edit jumps,
 * the accuracy acknowledgement, the DPDP notice, and the mandatory consent.
 */
export default function ReviewStep({
  values,
  onEdit,
  ack,
  onAckChange,
  consent,
  onConsentChange,
  consentError,
}: {
  values: ReviewValues;
  onEdit: (step: number) => void;
  ack: boolean;
  onAckChange: (b: boolean) => void;
  consent: boolean;
  onConsentChange: (b: boolean) => void;
  consentError?: string;
}) {
  const attachmentSummary =
    values.attachmentNames.length === 0
      ? ""
      : values.attachmentNames.length === 1
        ? values.attachmentNames[0]
        : `${values.attachmentNames.length} files: ${values.attachmentNames.join(", ")}`;

  const rows: { label: string; value: string; step: number; pre?: boolean }[] = [
    { label: "Zone", value: values.zoneLabel, step: 1 },
    { label: "Subject", value: values.subject, step: 2 },
    { label: "Description", value: values.description, step: 2, pre: true },
    { label: "Attachments", value: attachmentSummary, step: 2 },
    { label: "Name", value: values.complainantName, step: 3 },
    { label: "Email", value: values.complainantEmail, step: 3 },
    { label: "Phone", value: values.complainantPhone, step: 3 },
    { label: "Business name", value: values.businessName, step: 3 },
    { label: "PRIME ID", value: values.primeId, step: 3 },
  ];

  return (
    <div>
      <dl className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                {row.label}
              </dt>
              <dd
                className={`mt-0.5 text-sm text-zinc-900 ${row.pre ? "whitespace-pre-wrap" : "break-words"}`}
              >
                {row.value || (
                  <span className="text-zinc-400">Not provided</span>
                )}
              </dd>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="flex shrink-0 items-center gap-1 text-sm text-zinc-600 underline underline-offset-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <EditIcon className="h-4 w-4" />
              Edit
            </button>
          </div>
        ))}
      </dl>

      <label className="mt-4 flex items-start gap-3 text-sm text-zinc-900">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => onAckChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        />
        <span>I confirm the information above is accurate.</span>
      </label>

      <div className="mt-5">
        <DpdpNotice />
        <label className="mt-3 flex items-start gap-3 text-sm text-zinc-900">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            aria-invalid={consentError ? true : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          />
          <span>{CONSENT_LABEL}</span>
        </label>
        {consentError && (
          <p className="mt-1.5 text-sm font-semibold text-zinc-900">{consentError}</p>
        )}
      </div>
    </div>
  );
}
