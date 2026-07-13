"use client";

import { useMemo, useRef } from "react";
import TemplateTile from "./TemplateTile";
import type { Template } from "../templates";

function matches(t: Template, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    t.title.toLowerCase().includes(needle) ||
    t.category.toLowerCase().includes(needle) ||
    t.keywords.some((k) => k.includes(needle))
  );
}

/**
 * Selectable template tiles as an accessible radiogroup: real <button role=radio>
 * with roving tabindex and arrow-key navigation (deliberately NOT a combobox).
 */
export default function TemplateGrid({
  templates,
  selectedId,
  filterQuery,
  onSelect,
}: {
  templates: Template[];
  selectedId?: string;
  filterQuery: string;
  onSelect: (id: string) => void;
}) {
  const visible = useMemo(
    () => templates.filter((t) => matches(t, filterQuery)),
    [templates, filterQuery],
  );
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The tabbable tile: the selected one if visible, else the first.
  const selectedVisibleIndex = visible.findIndex((t) => t.id === selectedId);
  const tabbableIndex = selectedVisibleIndex >= 0 ? selectedVisibleIndex : 0;

  function focusIndex(i: number) {
    const n = visible.length;
    if (n === 0) return;
    const idx = ((i % n) + n) % n;
    btnRefs.current[idx]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusIndex(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusIndex(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusIndex(0);
        break;
      case "End":
        e.preventDefault();
        focusIndex(visible.length - 1);
        break;
    }
  }

  if (visible.length === 0) {
    return (
      <p className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
        No matching topic — press Enter in the search box to file this as a custom
        grievance.
      </p>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Grievance topic"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
    >
      {visible.map((t, i) => (
        <div key={t.id} onKeyDown={(e) => onKeyDown(e, i)}>
          <TemplateTile
            template={t}
            selected={t.id === selectedId}
            onSelect={() => onSelect(t.id)}
            tabIndex={i === tabbableIndex ? 0 : -1}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
          />
        </div>
      ))}
    </div>
  );
}
