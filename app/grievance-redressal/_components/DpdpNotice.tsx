import { DPDP_NOTICE } from "@/lib/grievance/consent";

/**
 * The itemized DPDP Act, 2023 §5 notice shown at the point of collection, just
 * above the consent checkbox. Server component — pure content.
 */
export default function DpdpNotice() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-sm font-semibold text-zinc-900">
        How PRIME uses your data (DPDP Act, 2023)
      </p>
      <dl className="mt-2 space-y-2">
        {DPDP_NOTICE.map((item) => (
          <div key={item.heading} className="text-sm">
            <dt className="font-medium text-zinc-900">{item.heading}</dt>
            <dd className="text-zinc-600">{item.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
