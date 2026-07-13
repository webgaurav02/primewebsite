"use client";

import { SearchIcon } from "./icons";

/**
 * Plain search input that filters the template tiles. Enter on a query with no
 * matching tile routes to the Custom template (handled by the parent via
 * onEnter). Intentionally a plain <input type="search"> — NOT a combobox.
 */
export default function SearchRouter({
  value,
  onChange,
  onEnter,
  noMatches,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  noMatches: boolean;
}) {
  return (
    <div>
      <label
        htmlFor="grievance-search"
        className="text-sm font-medium text-zinc-900"
      >
        Search to start a grievance
      </label>
      <div className="relative mt-1.5">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          id="grievance-search"
          type="search"
          value={value}
          placeholder="e.g. stipend not paid"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter();
            }
          }}
          className="h-12 w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        />
      </div>
      {value.trim() !== "" && noMatches && (
        <p className="mt-1.5 text-sm text-zinc-500">
          No matching topic — press Enter to file this as a custom grievance.
        </p>
      )}
    </div>
  );
}
