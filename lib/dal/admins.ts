import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan, type Region, type Role } from "@/lib/auth/rbac";
import { withAdminContext } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import {
  createAdminSchema,
  updateAdminSchema,
  setAdminActiveSchema,
  normaliseRegions,
} from "@/lib/admins/types";

/**
 * Admin-facing DAL for the admin directory (admin_user + admin_region).
 * Authorization boundary: requireAdmin → assertCan("admin:manage") →
 * withAdminContext (RLS additionally requires current_admin_role='super_admin'
 * for every write, per migration 0019) → audit.
 *
 * Manages WHO is an admin, their role, region scope, and active flag. It does
 * not grant login (admin auth is fail-closed until passkeys land) — see
 * lib/admins/types.ts. Guardrails below make it impossible to lock the org out
 * of super-admin control.
 */

export interface AdminListItem {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  regions: Region[];
  assignedOpenGrievances: number;
  createdAt: string;
}

export type MutationResult =
  | { ok: true }
  | { ok: false; error?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function listAdmins(): Promise<AdminListItem[]> {
  const viewer = await requireAdmin();
  assertCan(viewer, "admin:manage");

  return withAdminContext(viewer, async (tx) => {
    const rows = await tx<
      (Omit<AdminListItem, "createdAt"> & { createdAt: Date })[]
    >`
      SELECT a.id, a.email, a.name, a.role, a.is_active AS "isActive",
             a.created_at AS "createdAt",
             coalesce(
               array_agg(DISTINCT ar.region) FILTER (WHERE ar.region IS NOT NULL),
               '{}'
             ) AS regions,
             (SELECT count(*)::int FROM grievance g
                WHERE g.assigned_to = a.id
                  AND g.status NOT IN ('resolved', 'rejected')) AS "assignedOpenGrievances"
      FROM admin_user a
      LEFT JOIN admin_region ar ON ar.admin_id = a.id
      GROUP BY a.id
      ORDER BY a.is_active DESC, a.name
    `;

    await recordAudit(
      {
        actor: viewer,
        action: "admin.list",
        resourceType: "admin_user",
        metadata: { count: rows.length },
      },
      tx,
    );

    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  });
}

function flatten(err: z.ZodError): Record<string, string[] | undefined> {
  return z.flattenError(err).fieldErrors;
}

export async function createAdmin(raw: unknown): Promise<MutationResult> {
  const viewer = await requireAdmin();
  assertCan(viewer, "admin:manage");

  const parsed = createAdminSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, fieldErrors: flatten(parsed.error) };

  const email = parsed.data.email.toLowerCase();
  const { name, role } = parsed.data;
  const regions = normaliseRegions(role, parsed.data.regions);

  return withAdminContext(viewer, async (tx) => {
    const [dupe] = await tx`SELECT 1 FROM admin_user WHERE lower(email) = ${email}`;
    if (dupe) {
      return { ok: false, fieldErrors: { email: ["An admin with this email already exists."] } };
    }

    let createdId: string;
    try {
      const [created] = await tx<{ id: string }[]>`
        INSERT INTO admin_user (email, name, role)
        VALUES (${email}, ${name}, ${role})
        RETURNING id
      `;
      createdId = created.id;
    } catch (e) {
      // Unique-violation race between the check and the insert.
      if (e && typeof e === "object" && "code" in e && e.code === "23505") {
        return { ok: false, fieldErrors: { email: ["An admin with this email already exists."] } };
      }
      throw e;
    }

    for (const region of regions) {
      await tx`INSERT INTO admin_region (admin_id, region) VALUES (${createdId}, ${region})`;
    }

    await recordAudit(
      {
        actor: viewer,
        action: "admin.create",
        resourceType: "admin_user",
        resourceId: createdId,
        metadata: { email, role, regions },
      },
      tx,
    );

    return { ok: true };
  });
}

export async function updateAdmin(raw: unknown): Promise<MutationResult> {
  const viewer = await requireAdmin();
  assertCan(viewer, "admin:manage");

  const parsed = updateAdminSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, fieldErrors: flatten(parsed.error) };

  const { adminId, name, role } = parsed.data;
  const regions = normaliseRegions(role, parsed.data.regions);

  return withAdminContext(viewer, async (tx) => {
    const [target] = await tx<{ role: Role }[]>`
      SELECT role FROM admin_user WHERE id = ${adminId}
    `;
    if (!target) return { ok: false, error: "Admin not found." };

    if (adminId === viewer.id && role !== "super_admin") {
      return { ok: false, error: "You cannot change your own role." };
    }
    if (target.role === "super_admin" && role !== "super_admin") {
      const [{ others }] = await tx<{ others: number }[]>`
        SELECT count(*)::int AS others FROM admin_user
        WHERE role = 'super_admin' AND is_active = true AND id <> ${adminId}
      `;
      if (others === 0) {
        return { ok: false, error: "You cannot demote the last active super admin." };
      }
    }

    await tx`UPDATE admin_user SET name = ${name}, role = ${role} WHERE id = ${adminId}`;
    await tx`DELETE FROM admin_region WHERE admin_id = ${adminId}`;
    for (const region of regions) {
      await tx`INSERT INTO admin_region (admin_id, region) VALUES (${adminId}, ${region})`;
    }

    await recordAudit(
      {
        actor: viewer,
        action: "admin.update",
        resourceType: "admin_user",
        resourceId: adminId,
        metadata: { name, role, regions },
      },
      tx,
    );

    return { ok: true };
  });
}

export async function setAdminActive(raw: unknown): Promise<MutationResult> {
  const viewer = await requireAdmin();
  assertCan(viewer, "admin:manage");

  const parsed = setAdminActiveSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, fieldErrors: flatten(parsed.error) };

  const { adminId, isActive } = parsed.data;

  return withAdminContext(viewer, async (tx) => {
    const [target] = await tx<{ role: Role }[]>`
      SELECT role FROM admin_user WHERE id = ${adminId}
    `;
    if (!target) return { ok: false, error: "Admin not found." };

    if (!isActive) {
      if (adminId === viewer.id) {
        return { ok: false, error: "You cannot disable your own account." };
      }
      if (target.role === "super_admin") {
        const [{ others }] = await tx<{ others: number }[]>`
          SELECT count(*)::int AS others FROM admin_user
          WHERE role = 'super_admin' AND is_active = true AND id <> ${adminId}
        `;
        if (others === 0) {
          return { ok: false, error: "You cannot disable the last active super admin." };
        }
      }
    }

    await tx`UPDATE admin_user SET is_active = ${isActive} WHERE id = ${adminId}`;
    await recordAudit(
      {
        actor: viewer,
        action: isActive ? "admin.reactivate" : "admin.deactivate",
        resourceType: "admin_user",
        resourceId: adminId,
      },
      tx,
    );

    return { ok: true };
  });
}
