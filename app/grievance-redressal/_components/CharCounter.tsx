"use client";

/**
 * Colorless live length feedback. Out-of-bounds is signalled by weight +
 * underline (never hue), and announced politely to assistive tech.
 */
export default function CharCounter({
  value,
  min,
  max,
}: {
  value: number;
  min?: number;
  max: number;
}) {
  const belowMin = min !== undefined && value < min;
  const aboveMax = value > max;
  const outOfBounds = belowMin || aboveMax;

  const text = belowMin ? `${value} / ${min} minimum` : `${value} / ${max}`;

  return (
    <span
      aria-live="polite"
      className={
        outOfBounds
          ? "font-bold text-zinc-900 underline"
          : "text-zinc-400"
      }
    >
      {text}
    </span>
  );
}
