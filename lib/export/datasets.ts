import "server-only";
import type { Permission } from "@/lib/auth/rbac";
import type { XlsxCell, XlsxColumn } from "./xlsx";
import { listUsers } from "@/lib/dal/users";
import { listApplications } from "@/lib/dal/programs";
import { listGrievances } from "@/lib/dal/grievances";
import { listPrimeIdRequests } from "@/lib/dal/prime-id";
import { listDocuments } from "@/lib/dal/documents";
import { listAssignments } from "@/lib/dal/mentorship";
import { listAdmins } from "@/lib/dal/admins";
import { listAuditLog } from "@/lib/dal/audit";
import { listPublicEvents } from "@/lib/dal/events";
import { REGISTRANT_TYPE_LABELS } from "@/lib/users/types";
import { APPLICATION_STATUS_LABELS } from "@/lib/programs/types";

/**
 * Registry of admin datasets that can be exported as XLSX. Each entry declares
 * the permission that gates it, the download filename, and a `build` that pulls
 * ALL matching rows through the SAME DAL the page uses (so RLS, region scoping,
 * PII redaction, and audit all still apply) and maps them to columns + rows.
 *
 * The DALs already requireAdmin + assertCan; the export route re-checks the
 * permission before calling as defence in depth.
 */

const EXPORT_LIMIT = 10000; // hard cap the list DALs also enforce

export interface ExportSpec {
  permission: Permission;
  filenameBase: string;
  sheet: string;
  build: (sp: URLSearchParams) => Promise<{ columns: XlsxColumn[]; rows: XlsxCell[][] }>;
}

const s = (v: unknown): XlsxCell => (v == null ? null : String(v));
const yesNo = (v: boolean): XlsxCell => (v ? "Yes" : "No");

export const EXPORTS: Record<string, ExportSpec> = {
  users: {
    permission: "user:manage",
    filenameBase: "prime-users",
    sheet: "Users",
    async build(sp) {
      const { rows } = await listUsers({
        status: (sp.get("status") as never) || undefined,
        registrantType: (sp.get("type") as never) || undefined,
        district: sp.get("district") || undefined,
        q: sp.get("q") || undefined,
        limit: EXPORT_LIMIT,
        offset: 0,
      });
      return {
        columns: [
          { header: "Name", width: 26 }, { header: "Email", width: 30 },
          { header: "Registered as", width: 28 }, { header: "Persona" },
          { header: "District", width: 20 }, { header: "Venture", width: 26 },
          { header: "Status" }, { header: "Email verified" }, { header: "Registered", width: 14 },
        ],
        rows: rows.map((u) => [
          u.fullName, u.email,
          u.registrantType ? REGISTRANT_TYPE_LABELS[u.registrantType] : (u.persona ?? ""),
          u.persona ?? "", u.district ?? "", u.businessName ?? "",
          u.status, yesNo(u.activated), u.createdAt.slice(0, 10),
        ]),
      };
    },
  },

  applications: {
    permission: "program:manage",
    filenameBase: "prime-applications",
    sheet: "Applications",
    async build(sp) {
      const { rows } = await listApplications({
        status: (sp.get("status") as never) || undefined,
        programId: sp.get("program") || undefined,
        q: sp.get("q") || undefined,
        limit: EXPORT_LIMIT,
        offset: 0,
      });
      return {
        columns: [
          { header: "Applicant", width: 26 }, { header: "Email", width: 30 },
          { header: "Registered as", width: 28 }, { header: "District", width: 20 },
          { header: "Program", width: 26 }, { header: "Cycle", width: 20 },
          { header: "Status" }, { header: "Submitted", width: 14 },
          { header: "Venture summary", width: 50 }, { header: "Objective", width: 50 },
          { header: "Decision note", width: 40 },
        ],
        rows: rows.map((a) => [
          a.applicantName, a.applicantEmail,
          a.registrantType ? (REGISTRANT_TYPE_LABELS[a.registrantType as keyof typeof REGISTRANT_TYPE_LABELS] ?? a.registrantType) : "",
          a.district ?? "", a.programName, a.cycleLabel,
          APPLICATION_STATUS_LABELS[a.status], a.submittedAt ? a.submittedAt.slice(0, 10) : "",
          a.answers?.summary ?? "", a.answers?.objective ?? "", a.decisionNote ?? "",
        ]),
      };
    },
  },

  grievances: {
    permission: "grievance:read",
    filenameBase: "prime-grievances",
    sheet: "Grievances",
    async build(sp) {
      const rows = await listGrievances({
        status: sp.get("status") || undefined,
        region: sp.get("region") || undefined,
        q: sp.get("q") || undefined,
      });
      return {
        columns: [
          { header: "Ticket", width: 16 }, { header: "Region", width: 18 },
          { header: "Category", width: 18 }, { header: "Subject", width: 40 },
          { header: "Status" }, { header: "Escalation" },
          { header: "Complainant", width: 24 }, { header: "Email", width: 28 },
          { header: "Phone", width: 16 }, { header: "PRIME ID", width: 16 },
          { header: "Business", width: 24 }, { header: "Created", width: 14 },
        ],
        rows: rows.map((g) => [
          g.ticketRef, g.region, g.category, g.subject, g.status, g.escalationLevel,
          g.complainant.name, g.complainant.email, g.complainant.phone,
          g.primeIdRef ?? "", g.businessName ?? "", g.createdAt.slice(0, 10),
        ]),
      };
    },
  },

  "prime-id": {
    permission: "prime_id:review",
    filenameBase: "prime-id-requests",
    sheet: "PRIME ID requests",
    async build(sp) {
      const rows = await listPrimeIdRequests((sp.get("status") as never) || undefined);
      return {
        columns: [
          { header: "Applicant", width: 26 }, { header: "Holder type", width: 16 },
          { header: "Category", width: 16 }, { header: "Venture", width: 26 },
          { header: "District", width: 20 }, { header: "Status" }, { header: "Requested", width: 14 },
        ],
        rows: rows.map((r) => [
          r.fullName, r.holderType, r.category ?? "", r.ventureName ?? "",
          r.district, r.status, r.requestedAt.slice(0, 10),
        ]),
      };
    },
  },

  documents: {
    permission: "document:verify",
    filenameBase: "prime-documents",
    sheet: "Documents",
    async build(sp) {
      const rows = await listDocuments({ status: (sp.get("status") as never) || undefined });
      return {
        columns: [
          { header: "Owner", width: 26 }, { header: "Kind", width: 18 },
          { header: "Status" }, { header: "File name", width: 30 }, { header: "Type", width: 20 },
          { header: "Size (KB)" }, { header: "Uploaded", width: 14 }, { header: "Rejection reason", width: 34 },
        ],
        rows: rows.map((d) => [
          d.ownerName, d.kind, d.status, d.originalName ?? "", d.mime,
          Math.round(d.sizeBytes / 1024), d.uploadedAt.slice(0, 10), d.rejectionReason ?? "",
        ]),
      };
    },
  },

  mentorship: {
    permission: "mentorship:manage",
    filenameBase: "prime-mentorship",
    sheet: "Mentorship",
    async build() {
      const rows = await listAssignments();
      return {
        columns: [
          { header: "Mentor", width: 26 }, { header: "Mentee", width: 26 },
          { header: "Status" }, { header: "Total minutes" }, { header: "Sessions" },
          { header: "Started", width: 14 },
        ],
        rows: rows.map((a) => [
          a.mentorName, a.menteeName, a.status, a.totalMinutes, a.sessionCount, a.startedAt.slice(0, 10),
        ]),
      };
    },
  },

  admins: {
    permission: "admin:manage",
    filenameBase: "prime-admins",
    sheet: "Admins",
    async build() {
      const rows = await listAdmins();
      return {
        columns: [
          { header: "Name", width: 26 }, { header: "Email", width: 30 }, { header: "Role", width: 18 },
          { header: "Active" }, { header: "Regions", width: 30 },
          { header: "Open grievances" }, { header: "Created", width: 14 },
        ],
        rows: rows.map((a) => [
          a.name, a.email, a.role, yesNo(a.isActive), a.regions.join(", "),
          a.assignedOpenGrievances, a.createdAt.slice(0, 10),
        ]),
      };
    },
  },

  events: {
    permission: "event:publish",
    filenameBase: "prime-events",
    sheet: "Events",
    async build() {
      const rows = await listPublicEvents(EXPORT_LIMIT);
      return {
        columns: [
          { header: "Title", width: 40 }, { header: "Details", width: 60 }, { header: "When", width: 20 },
        ],
        rows: rows.map((e) => [e.title, e.body ?? "", e.at.slice(0, 16).replace("T", " ")]),
      };
    },
  },

  audit: {
    permission: "audit:read",
    filenameBase: "prime-audit-log",
    sheet: "Audit log",
    async build(sp) {
      const { rows } = await listAuditLog({
        action: sp.get("action") || undefined,
        resourceType: sp.get("resourceType") || undefined,
        actorEmail: sp.get("actorEmail") || undefined,
        from: sp.get("from") || undefined,
        to: sp.get("to") || undefined,
        limit: EXPORT_LIMIT,
        offset: 0,
      });
      return {
        columns: [
          { header: "#" }, { header: "When", width: 20 }, { header: "Actor", width: 28 },
          { header: "Action", width: 24 }, { header: "Resource", width: 20 },
          { header: "Resource ID", width: 30 }, { header: "Details", width: 50 }, { header: "IP", width: 16 },
        ],
        rows: rows.map((r) => [
          r.seq, r.at.slice(0, 16).replace("T", " "), r.actorEmail, r.action,
          r.resourceType, r.resourceId ?? "",
          Object.keys(r.metadata ?? {}).length ? JSON.stringify(r.metadata) : "",
          s(r.ip),
        ]),
      };
    },
  },
};
