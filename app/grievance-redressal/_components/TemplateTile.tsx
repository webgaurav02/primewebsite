"use client";

import { TEMPLATE_ICONS, CheckIcon } from "./icons";
import type { Template } from "../templates";

export default function TemplateTile({
  template,
  selected,
  onSelect,
  tabIndex,
  ref,
}: {
  template: Template;
  selected: boolean;
  onSelect: () => void;
  tabIndex: number;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  const Icon = TEMPLATE_ICONS[template.iconKey];
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      onClick={onSelect}
      className={[
        "group relative flex min-h-16 w-full items-start gap-3 rounded-md border p-4 text-left transition-colors motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        selected
          ? "border-black bg-black text-white"
          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400",
      ].join(" ")}
    >
      <Icon
        className={`h-5 w-5 shrink-0 ${selected ? "text-white" : "text-zinc-700"}`}
      />
      <span className="min-w-0 pr-5">
        <span className="block text-sm font-medium">{template.title}</span>
        <span
          className={`mt-0.5 block text-xs ${selected ? "text-zinc-300" : "text-zinc-500"}`}
        >
          {template.helper}
        </span>
      </span>
      {selected && (
        <CheckIcon className="absolute right-3 top-3 h-4 w-4 text-white" />
      )}
    </button>
  );
}
