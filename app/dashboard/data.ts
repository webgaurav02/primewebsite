import "server-only";
import { requireUser } from "@/lib/auth/user-session";
import { getMyProfile } from "@/lib/dal/profile";
import { getMyApplications, listOpenPrograms } from "@/lib/dal/programs";
import { getMyDocuments } from "@/lib/dal/documents";
import { getMyTimeline, listPublicEvents, unreadNotificationCount } from "@/lib/dal/events";
import { getMyPrimeId } from "@/lib/dal/prime-id";
import { REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import { DOCUMENT_KINDS } from "@/lib/documents/types";
import type { ApplicationStatus } from "@/lib/programs/types";
import { formatINR, formatCount, monthYear, shortDate, relativeTime } from "@/lib/format/display";
import type {
  DashboardData, DashProgram, DashActivity, DashDoc, StatusTone,
} from "./types";

/**
 * Assembles the member dashboard from the same audited DALs the /account pages
 * use — no mock data. Runs server-side; hands the client a flat, pre-formatted
 * view model (app/dashboard/types.ts).
 */

const ACTIVE_APP: ApplicationStatus[] = ["submitted", "under_review", "shortlisted", "approved"];

// Application status → dot/badge tone + human label (mirrors the mock's palette).
const APP_TONE: Record<ApplicationStatus, { tone: StatusTone; label: string }> = {
  draft: { tone: "muted", label: "Draft" },
  submitted: { tone: "active", label: "Submitted" },
  under_review: { tone: "warn", label: "Under review" },
  shortlisted: { tone: "active", label: "Shortlisted" },
  approved: { tone: "positive", label: "Approved" },
  rejected: { tone: "muted", label: "Not selected" },
  withdrawn: { tone: "muted", label: "Withdrawn" },
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const chars = (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
  return chars.toUpperCase() || "P";
}

// Timeline event type → activity icon + tone.
function activityLook(type: string): { iconKey: DashActivity["iconKey"]; tone: StatusTone } {
  if (type.startsWith("document.")) return { iconKey: "doc", tone: type.includes("verified") ? "positive" : "muted" };
  if (type.startsWith("application.")) return { iconKey: "program", tone: type.includes("withdrawn") ? "muted" : "active" };
  if (type.startsWith("id.")) return { iconKey: "id", tone: type.includes("rejected") ? "negative" : "active" };
  if (type.startsWith("grievance.")) return { iconKey: "grievance", tone: "warn" };
  if (type.startsWith("user.")) return { iconKey: "check", tone: "positive" };
  if (type === "announcement") return { iconKey: "announce", tone: "muted" };
  return { iconKey: "check", tone: "muted" };
}

export async function getDashboardData(): Promise<DashboardData> {
  const user = await requireUser("/dashboard");

  const [profile, primeId, apps, openPrograms, publicEvents, timeline, docs, unread] =
    await Promise.all([
      getMyProfile(),
      getMyPrimeId(),
      getMyApplications(),
      listOpenPrograms(),
      listPublicEvents(6),
      getMyTimeline(12),
      getMyDocuments(),
      unreadNotificationCount(),
    ]);

  const b = profile.business;
  const registrantLabel = user.registrantType ? REGISTRANT_TYPE_LABELS[user.registrantType] : null;

  // ── PRIME ID pill ──────────────────────────────────────────────────────────
  let primeIdText = "Not requested";
  let primeIdTone: StatusTone = "muted";
  if (primeId.credential) {
    primeIdText = primeId.credential.id;
    primeIdTone = primeId.credential.status === "active" ? "active" : "muted";
  } else if (primeId.request) {
    primeIdText = primeId.request.status === "rejected" ? "ID rejected" : "ID requested";
    primeIdTone = primeId.request.status === "rejected" ? "negative" : "warn";
  }

  // ── Programs: my applications, then still-open programs I haven't applied to ──
  const appliedProgramNames = new Set(apps.map((a) => a.programName));
  const applicationPrograms: DashProgram[] = apps.map((a) => ({
    name: a.programName,
    meta: a.submittedAt ? `${a.cycleLabel} · ${shortDate(a.submittedAt)}` : a.cycleLabel,
    statusLabel: APP_TONE[a.status].label,
    tone: APP_TONE[a.status].tone,
    applyHref: null,
  }));
  const availablePrograms: DashProgram[] = openPrograms
    .filter((p) => !appliedProgramNames.has(p.name) && p.cycles.some((c) => c.myApplicationId == null))
    .map((p) => ({
      name: p.name,
      meta: p.cycles[0]?.label ?? "Open now",
      statusLabel: "Available",
      tone: "muted" as StatusTone,
      applyHref: "/account/programs",
    }));
  const programsActive = apps.filter((a) => ACTIVE_APP.includes(a.status)).length;

  // ── Documents: the KYC checklist, with each row's real status merged in ───────
  const byKind = new Map(docs.map((d) => [d.kind, d]));
  const checklist: DashDoc[] = DOCUMENT_KINDS.filter((k) => k.value !== "other").map((k) => {
    const d = byKind.get(k.value);
    if (!d) return { name: k.label, statusLabel: "Not uploaded", tone: "muted", date: "—", href: null };
    const tone: StatusTone = d.status === "verified" ? "positive" : d.status === "rejected" ? "negative" : "warn";
    const statusLabel = d.status === "verified" ? "Verified" : d.status === "rejected" ? "Rejected" : "Pending";
    return { name: k.label, statusLabel, tone, date: monthYear(d.uploadedAt), href: `/account/documents/${d.id}/file` };
  });
  // Any uploaded "Other" documents append after the standard checklist.
  for (const d of docs.filter((x) => x.kind === "other")) {
    const tone: StatusTone = d.status === "verified" ? "positive" : d.status === "rejected" ? "negative" : "warn";
    const statusLabel = d.status === "verified" ? "Verified" : d.status === "rejected" ? "Rejected" : "Pending";
    checklist.push({ name: d.originalName || "Other document", statusLabel, tone, date: monthYear(d.uploadedAt), href: `/account/documents/${d.id}/file` });
  }

  // ── Activity feed (journey ∪ announcements) ───────────────────────────────────
  const activity: DashActivity[] = timeline.map((t) => ({
    text: t.title,
    time: relativeTime(t.at),
    ...activityLook(t.type),
  }));

  // ── Funding totals (no per-grant ledger exists — surface the real profile sums) ─
  const govt = b?.govtFunding ?? null;
  const external = b?.externalFunding ?? null;
  const hasAny = govt != null || external != null;
  const total = hasAny ? (govt ?? 0) + (external ?? 0) : null;

  return {
    user: {
      fullName: user.fullName,
      email: user.email,
      shortName: user.fullName.split(" ")[0] || user.fullName,
      headline: b?.businessName ?? registrantLabel ?? "PRIME Member",
      sector: b?.sector ?? null,
      primeId: primeIdText,
      primeIdTone,
      district: user.district ?? "—",
      status: "Active",
      since: monthYear(profile.memberSince),
      photoDataUrl: profile.photoDataUrl,
      initials: initials(user.fullName),
      emailVerified: user.emailVerified,
    },
    stats: {
      employed: b ? formatCount(b.employmentCount) : "—",
      turnover: b ? formatINR(b.turnover) : "—",
      govtFunding: b ? formatINR(b.govtFunding) : "—",
      programsActive: String(programsActive),
    },
    programs: [...applicationPrograms, ...availablePrograms],
    events: publicEvents.map((e) => ({ title: e.title, date: shortDate(e.at), detail: e.body })),
    activity,
    documents: checklist,
    funding: {
      govtFunding: formatINR(govt),
      externalFunding: formatINR(external),
      total: formatINR(total),
      hasAny,
    },
    business: b
      ? {
          name: b.businessName || "Your business",
          about: b.description,
          rows: [
            { label: "PRIME ID", value: primeIdText },
            { label: "Sector", value: b.sector || "—" },
            { label: "District", value: user.district ?? "—" },
            { label: "Entity type", value: b.entityType || "—" },
            { label: "Stage", value: b.stage || "—" },
            { label: "Member since", value: monthYear(profile.memberSince) },
          ],
          tiles: [
            { value: formatCount(b.employmentCount), label: "People Employed" },
            { value: formatCount(b.livesImpacted), label: "Lives Impacted" },
            { value: formatINR(b.turnover), label: "Annual Turnover" },
            { value: formatINR(b.govtFunding), label: "Funding Received" },
          ],
        }
      : null,
    unread,
  };
}
