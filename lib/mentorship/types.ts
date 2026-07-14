/**
 * Mentorship shared constants + labels. No I/O.
 */

export type MentorshipMode = "in_person" | "virtual" | "phone";
export type MentorshipStatus = "active" | "ended";

/** A mentor earns the PRIME mentorship certificate at 5 logged hours. */
export const CERTIFICATE_THRESHOLD_MINUTES = 300;

export const MODE_LABELS: Record<MentorshipMode, string> = {
  in_person: "In person",
  virtual: "Virtual",
  phone: "Phone",
};

export const MODES: MentorshipMode[] = ["virtual", "in_person", "phone"];

export function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}
