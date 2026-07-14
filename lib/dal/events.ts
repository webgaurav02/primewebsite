import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { requireUser } from "@/lib/auth/user-session";
import { withAdminContext, withUserContext, getSql, type Db } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";

/**
 * Timeline + notifications DAL.
 *
 * emitTimelineEvent / emitNotification are called INSIDE an existing mutation's
 * transaction (they take the tx), so an event commits atomically with the thing
 * it describes and inherits that transaction's RLS context (auth-op / user /
 * admin all satisfy the insert policies).
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function emitTimelineEvent(
  tx: Db,
  e: {
    userId: string | null;
    type: string;
    title: string;
    body?: string | null;
    metadata?: Record<string, unknown>;
    visibility?: "private" | "public";
    occursAt?: string | null;
    publishedBy?: string | null;
  },
): Promise<void> {
  await tx`
    INSERT INTO timeline_event
      (user_id, type, title, body, metadata, visibility, occurs_at, published_by)
    VALUES
      (${e.userId}, ${e.type}, ${e.title}, ${e.body ?? null},
       ${JSON.stringify(e.metadata ?? {})}::jsonb,
       ${e.visibility ?? "private"}, ${e.occursAt ?? null}, ${e.publishedBy ?? null})
  `;
}

export async function emitNotification(
  tx: Db,
  n: { userId: string; type: string; title: string; body?: string | null; link?: string | null },
): Promise<void> {
  await tx`
    INSERT INTO notification (user_id, type, title, body, link)
    VALUES (${n.userId}, ${n.type}, ${n.title}, ${n.body ?? null}, ${n.link ?? null})
  `;
}

// ── Member reads ──────────────────────────────────────────────────────────────

export interface TimelineItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  visibility: "private" | "public";
  at: string;
}

/** The member's journey ∪ public events (RLS returns exactly those). */
export async function getMyTimeline(limit = 50): Promise<TimelineItem[]> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const rows = await tx<
      { id: string; type: string; title: string; body: string | null; visibility: "private" | "public"; at: Date }[]
    >`
      SELECT id, type, title, body, visibility,
             coalesce(occurs_at, created_at) AS at
      FROM timeline_event
      ORDER BY coalesce(occurs_at, created_at) DESC
      LIMIT ${limit}`;
    return rows.map((r) => ({ ...r, at: r.at.toISOString() }));
  });
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export async function getMyNotifications(limit = 50): Promise<{ items: NotificationItem[]; unread: number }> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const rows = await tx<
      { id: string; type: string; title: string; body: string | null; link: string | null; readAt: Date | null; createdAt: Date }[]
    >`
      SELECT id, type, title, body, link, read_at AS "readAt", created_at AS "createdAt"
      FROM notification ORDER BY created_at DESC LIMIT ${limit}`;
    const unread = rows.filter((r) => r.readAt === null).length;
    return {
      items: rows.map((r) => ({
        ...r,
        readAt: r.readAt ? r.readAt.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
      unread,
    };
  });
}

/** Cheap unread count for the account badge. */
export async function unreadNotificationCount(): Promise<number> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const [row] = await tx<{ n: number }[]>`
      SELECT count(*)::int AS n FROM notification WHERE read_at IS NULL`;
    return row?.n ?? 0;
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  const user = await requireUser();
  if (!UUID_RE.test(id)) return;
  await withUserContext(user.id, (tx) => tx`
    UPDATE notification SET read_at = now() WHERE id = ${id} AND read_at IS NULL`);
}

export async function markAllNotificationsRead(): Promise<void> {
  const user = await requireUser();
  await withUserContext(user.id, (tx) => tx`
    UPDATE notification SET read_at = now() WHERE read_at IS NULL`);
}

// ── Public events ─────────────────────────────────────────────────────────────

export interface PublicEvent {
  id: string;
  title: string;
  body: string | null;
  at: string;
}

/** Admin-published public events. Readable with no auth (RLS allows public rows). */
export async function listPublicEvents(limit = 50): Promise<PublicEvent[]> {
  const rows = await getSql()<
    { id: string; title: string; body: string | null; at: Date }[]
  >`
    SELECT id, title, body, coalesce(occurs_at, created_at) AS at
    FROM timeline_event
    WHERE visibility = 'public'
    ORDER BY coalesce(occurs_at, created_at) DESC
    LIMIT ${limit}`;
  return rows.map((r) => ({ ...r, at: r.at.toISOString() }));
}

const publishSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().max(2000).optional().default(""),
  occursAt: z.string().trim().optional().default(""),
});

export async function publishPublicEvent(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "event:publish");
  const parsed = publishSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Title is required (3–160 chars)." };
  const d = parsed.data;
  const occursAt = d.occursAt && !Number.isNaN(Date.parse(d.occursAt)) ? d.occursAt : null;

  await withAdminContext(admin, async (tx) => {
    await emitTimelineEvent(tx, {
      userId: null,
      type: "announcement",
      title: d.title,
      body: d.body || null,
      visibility: "public",
      occursAt,
      publishedBy: admin.id,
    });
    await recordAudit(
      { actor: admin, action: "event.publish", resourceType: "timeline_event", metadata: { title: d.title } },
      tx,
    );
  });
  return { ok: true };
}
