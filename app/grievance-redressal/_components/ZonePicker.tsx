"use client";

import type { Zone } from "../zones";
import type { Region } from "@/lib/auth/rbac";

/**
 * Required region selection mapped to the enum. Uses native radio inputs (so the
 * form posts `region` and works without JS) styled as segmented cards. Selected
 * card inverts to black. Colorless throughout.
 */
export default function ZonePicker({
  zones,
  value,
  suggested,
  onChange,
}: {
  zones: Zone[];
  value?: Region;
  suggested?: Region;
  onChange: (r: Region) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-zinc-900">
        Which zone is this about?{" "}
        <span className="font-normal text-zinc-500">
          This routes you to the right helpline officer.
        </span>
      </legend>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {zones.map((zone) => {
          const selected = value === zone.value;
          const isSuggested = !value && suggested === zone.value;
          return (
            <label
              key={zone.value}
              className={[
                "flex min-h-14 cursor-pointer flex-col justify-center rounded-md border p-3 transition-colors motion-reduce:transition-none",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white",
                selected
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400",
              ].join(" ")}
            >
              <input
                type="radio"
                name="region"
                value={zone.value}
                checked={selected}
                onChange={() => onChange(zone.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{zone.label}</span>
              <span
                className={`mt-0.5 text-xs ${selected ? "text-zinc-300" : "text-zinc-500"}`}
              >
                {zone.hub}
              </span>
              <span
                className={`mt-1 text-xs ${selected ? "text-zinc-200" : "text-zinc-600"}`}
              >
                Helpline {zone.helplineLabel}
              </span>
              {isSuggested && (
                <span className="mt-1 text-xs font-semibold text-zinc-900">
                  Suggested — please confirm
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
