import type { Region } from "@/lib/auth/rbac";

/**
 * Single source of truth for the three PRIME helpline zones and their REAL
 * numbers (from the site footer). Khasi/Jaintia Hills AND Ri-Bhoi SHARE the same
 * helpline; Garo Hills has its own. Do NOT invent a third number.
 */
export interface Zone {
  value: Region;
  label: string;
  hub: string;
  helplineLabel: string;
  helplineTel: string;
}

export const ZONES: readonly Zone[] = [
  {
    value: "khasi_jaintia",
    label: "Khasi & Jaintia Hills",
    hub: "Shillong — PRIME Startup Hub",
    helplineLabel: "+91 90778 26559",
    helplineTel: "+919077826559",
  },
  {
    value: "garo",
    label: "Garo Hills",
    hub: "Tura — PRIME Startup Hub",
    helplineLabel: "8131805897",
    helplineTel: "+918131805897",
  },
  {
    value: "ri_bhoi",
    label: "Ri-Bhoi",
    hub: "Nongpoh — PRIME Startup Hub",
    helplineLabel: "+91 90778 26559",
    helplineTel: "+919077826559",
  },
];

export function getZone(value: Region | string | undefined): Zone | undefined {
  return ZONES.find((z) => z.value === value);
}
