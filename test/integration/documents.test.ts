import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Document vault: upload → replace → admin verify/reject, and the IDOR guard on
 * file access (a member can never fetch another member's document). Object
 * storage is mocked; the magic-byte validation is unit-tested separately.
 */

const OWNER = {
  id: "90000000-0000-4000-8000-0000000000a1",
  email: "owner@example.com", fullName: "Owner One",
  persona: "entrepreneur" as const, status: "active" as const, emailVerified: true, district: null,
};
const OTHER = { ...OWNER, id: "90000000-0000-4000-8000-0000000000b2", email: "other@example.com", fullName: "Other Member" };
const SUPER = { id: "90000000-0000-4000-8000-0000000000e9", email: "super@x", name: "Super", role: "super_admin" as const, regions: null };

const state = vi.hoisted(() => ({ user: null as unknown, admin: null as unknown, n: 0 }));
vi.mock("@/lib/auth/user-session", () => ({
  requireUser: async () => state.user,
  getCurrentUser: async () => state.user,
}));
vi.mock("@/lib/auth/session", () => ({
  requireAdmin: async () => state.admin,
  getCurrentAdmin: async () => state.admin,
}));
vi.mock("@/lib/storage", () => ({
  uploadUserFile: async (prefix: string, userId: string) => ({
    ok: true, key: `${prefix}/${userId}/${state.n++}.pdf`, mime: "application/pdf", size: 2048,
  }),
  getFileBytes: async () => Buffer.from("%PDF-1.4 fake document bytes"),
  deleteObject: async () => {},
}));

import {
  uploadDocument,
  getMyDocuments,
  getMyDocumentFile,
  verifyDocument,
  rejectDocument,
  listDocuments,
} from "@/lib/dal/documents";
import { getMyNotifications } from "@/lib/dal/events";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

const PDF = Buffer.from("%PDF-1.4 hello");

beforeEach(async () => {
  await truncateAll();
  state.user = OWNER;
  state.admin = SUPER;
  for (const u of [OWNER, OTHER]) {
    await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status)
      VALUES (${u.id}, ${u.email}, ${u.fullName}, 'entrepreneur', 'active')`;
  }
  await migratorSql`INSERT INTO admin_user (id, email, name, role)
    VALUES (${SUPER.id}, ${SUPER.email}, ${SUPER.name}, 'super_admin')`;
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("upload", () => {
  test("upload creates a pending document", async () => {
    const res = await uploadDocument("pan", PDF, "pan.pdf");
    expect(res.ok).toBe(true);
    const docs = await getMyDocuments();
    expect(docs.length).toBe(1);
    expect(docs[0].kind).toBe("pan");
    expect(docs[0].status).toBe("pending");
  });

  test("re-uploading the same kind replaces the earlier one", async () => {
    await uploadDocument("pan", PDF, "pan-v1.pdf");
    await uploadDocument("pan", PDF, "pan-v2.pdf");
    const docs = await getMyDocuments();
    expect(docs.filter((d) => d.kind === "pan").length).toBe(1);
    expect(docs[0].originalName).toBe("pan-v2.pdf");
  });

  test("an invalid kind is rejected", async () => {
    const res = await uploadDocument("passport", PDF, "p.pdf");
    expect(res.ok).toBe(false);
  });

  test("an unverified email cannot upload (soft-gate)", async () => {
    state.user = { ...OWNER, emailVerified: false };
    const res = await uploadDocument("pan", PDF, "pan.pdf");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toMatch(/verify/i);
    state.user = OWNER;
  });
});

describe("admin verification state machine", () => {
  test("verify → verified + owner notified", async () => {
    await uploadDocument("aadhaar", PDF, "a.pdf");
    const [d] = await listDocuments();
    expect(d.ownerName).toBe("Owner One");

    expect((await verifyDocument(d.id)).ok).toBe(true);
    expect((await getMyDocuments())[0].status).toBe("verified");
    expect((await getMyNotifications()).items.some((n) => n.type === "document.verified")).toBe(true);
  });

  test("reject → rejected with a reason", async () => {
    await uploadDocument("gst", PDF, "g.pdf");
    const [d] = await listDocuments();
    const res = await rejectDocument({ documentId: d.id, reason: "Blurry scan — please re-upload." });
    expect(res.ok).toBe(true);
    const mine = (await getMyDocuments())[0];
    expect(mine.status).toBe("rejected");
    expect(mine.rejectionReason).toMatch(/Blurry/);
  });

  test("reject requires a reason", async () => {
    await uploadDocument("gst", PDF, "g.pdf");
    const [d] = await listDocuments();
    expect((await rejectDocument({ documentId: d.id, reason: "" })).ok).toBe(false);
  });
});

describe("IDOR guard on file access", () => {
  test("a member cannot fetch another member's document", async () => {
    // OTHER uploads a document.
    state.user = OTHER;
    await uploadDocument("bank_statement", PDF, "bank.pdf");
    const otherDocId = (await getMyDocuments())[0].id;

    // OWNER can fetch their OWN file...
    state.user = OWNER;
    await uploadDocument("pan", PDF, "pan.pdf");
    const ownDocId = (await getMyDocuments())[0].id;
    expect(await getMyDocumentFile(ownDocId)).not.toBeNull();

    // ...but NOT OTHER's file (RLS scopes the lookup to the caller → null).
    expect(await getMyDocumentFile(otherDocId)).toBeNull();

    // And OWNER's document list never contains OTHER's document.
    expect((await getMyDocuments()).some((d) => d.id === otherDocId)).toBe(false);
  });
});
