import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

const USER = {
  id: "cccc1111-0000-4000-8000-00000000000d",
  email: "founder@example.com",
  fullName: "Kyrsoibor Nongrum",
  persona: "entrepreneur" as const,
  status: "active" as const,
  emailVerified: true,
  district: "East Khasi Hills",
};
const ADMIN = {
  id: "dddd2222-0000-4000-8000-00000000000e",
  email: "super@primemeghalaya.com",
  name: "Super Admin",
  role: "super_admin" as const,
  regions: null,
};

vi.mock("@/lib/auth/user-session", () => ({ requireUser: async () => USER }));
vi.mock("@/lib/auth/session", () => ({
  requireAdmin: async () => ADMIN,
  getCurrentAdmin: async () => null,
}));

import {
  requestPrimeId,
  approveAndIssuePrimeId,
  rejectPrimeIdRequest,
  revokePrimeIdCredential,
  verifyPrimeIdToken,
  getMyPrimeId,
  adminIssuePrimeId,
  getPrimeIdIssueContext,
  listPrimeIdEligibleUsers,
} from "@/lib/dal/prime-id";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

async function seedUser() {
  // The mocked admin must exist: prime_id_request.reviewed_by /
  // prime_id_credential.issued_by are FKs to admin_user.
  await migratorSql`
    INSERT INTO admin_user (id, email, name, role)
    VALUES (${ADMIN.id}, ${ADMIN.email}, ${ADMIN.name}, 'super_admin')`;
  await migratorSql`
    INSERT INTO app_user (id, email, full_name, persona, status, district)
    VALUES (${USER.id}, ${USER.email}, ${USER.fullName}, 'entrepreneur', 'active', ${USER.district})`;
  await migratorSql`
    INSERT INTO entrepreneur_profile (user_id, business_name)
    VALUES (${USER.id}, 'Zero9 Farms')`;
}

async function requestId(): Promise<string> {
  const [r] = await migratorSql`SELECT id FROM prime_id_request WHERE user_id = ${USER.id} ORDER BY requested_at DESC LIMIT 1`;
  return r.id as string;
}
async function tokenOf(credId: string): Promise<string> {
  const [c] = await migratorSql`SELECT token FROM prime_id_credential WHERE id = ${credId}`;
  return c.token as string;
}

beforeEach(async () => {
  await truncateAll();
  await seedUser();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("request → approve → issue → verify", () => {
  test("member requests, and a duplicate open request is blocked", async () => {
    expect(await requestPrimeId({ holderType: "entrepreneur", category: "startup", ventureName: "Zero9 Farms" })).toEqual({ ok: true });
    const dup = await requestPrimeId({ holderType: "entrepreneur", category: "startup" });
    expect(dup.ok).toBe(false);
    const [row] = await migratorSql`SELECT status, full_name AS "fullName", district FROM prime_id_request WHERE user_id = ${USER.id}`;
    expect(row.status).toBe("pending");
    expect(row.fullName).toBe(USER.fullName); // snapshotted from profile
    expect(row.district).toBe(USER.district);
  });

  test("admin approval issues a signed, sequential credential", async () => {
    await requestPrimeId({ holderType: "entrepreneur", category: "startup", ventureName: "Zero9 Farms" });
    const res = await approveAndIssuePrimeId(await requestId());
    expect(res.ok).toBe(true);
    expect(res.id).toMatch(/^PRM-ML-\d{4}-\d{6}$/);

    const [cred] = await migratorSql`SELECT status, token, token_hash, issued_by FROM prime_id_credential WHERE id = ${res.id!}`;
    expect(cred.status).toBe("active");
    expect(cred.token.split(".").length).toBe(3); // header.payload.sig
    expect(cred.issued_by).toBe(ADMIN.id);
    const [req] = await migratorSql`SELECT status FROM prime_id_request WHERE user_id = ${USER.id}`;
    expect(req.status).toBe("issued");
  });

  test("the issued token verifies publicly; tampering and revocation invalidate it", async () => {
    await requestPrimeId({ holderType: "entrepreneur", category: "startup" });
    const { id } = await approveAndIssuePrimeId(await requestId());
    const token = await tokenOf(id!);

    const good = await verifyPrimeIdToken(token);
    expect(good.valid).toBe(true);
    expect(good.credential?.id).toBe(id);
    expect(good.credential?.fullName).toBe(USER.fullName);

    const [h, p, s] = token.split(".");
    expect((await verifyPrimeIdToken(`${h}.${p}x.${s}`)).valid).toBe(false);

    expect(await revokePrimeIdCredential({ credentialId: id!, reason: "Card reported lost" })).toEqual({ ok: true });
    const afterRevoke = await verifyPrimeIdToken(token);
    expect(afterRevoke.valid).toBe(false);
    expect(afterRevoke.reason).toMatch(/revoked/i);
  });

  test("double-issue is refused (request already issued)", async () => {
    await requestPrimeId({ holderType: "entrepreneur" });
    const rid = await requestId();
    await approveAndIssuePrimeId(rid);
    const again = await approveAndIssuePrimeId(rid);
    expect(again.ok).toBe(false);
  });

  test("rejection records a reason; the member sees it and can re-request", async () => {
    await requestPrimeId({ holderType: "entrepreneur" });
    expect(await rejectPrimeIdRequest({ requestId: await requestId(), reason: "Incomplete profile" })).toEqual({ ok: true });

    const state = await getMyPrimeId();
    expect(state.request?.status).toBe("rejected");
    expect(state.request?.rejectionReason).toBe("Incomplete profile");
    expect(state.credential).toBeNull();

    // No pending request now → can request again.
    expect(await requestPrimeId({ holderType: "entrepreneur" })).toEqual({ ok: true });
  });
});

describe("admin direct-issue (generator)", () => {
  test("issues a signed credential for a user with no request; token verifies", async () => {
    const res = await adminIssuePrimeId({ userId: USER.id, holderType: "entrepreneur", category: "nano" });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.card.id).toMatch(/^PRM-ML-\d{4}-\d{6}$/);
    expect(res.card.fullName).toBe(USER.fullName);
    expect(res.card.district).toBe(USER.district);
    expect(res.card.category).toBe("nano");

    // Credential row exists, linked to the user, with no request.
    const [c] = await migratorSql`SELECT request_id, user_id, issued_by, status FROM prime_id_credential WHERE id = ${res.card.id}`;
    expect(c.request_id).toBeNull();
    expect(c.user_id).toBe(USER.id);
    expect(c.issued_by).toBe(ADMIN.id);

    // The signed token authoritatively verifies as valid.
    const v = await verifyPrimeIdToken(await tokenOf(res.card.id));
    expect(v.valid).toBe(true);
    expect(v.credential?.id).toBe(res.card.id);
  });

  test("blocks a second active credential for the same user", async () => {
    expect((await adminIssuePrimeId({ userId: USER.id, holderType: "mentor" })).ok).toBe(true);
    const again = await adminIssuePrimeId({ userId: USER.id, holderType: "mentor" });
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.error).toMatch(/already has an active/i);
  });

  test("clears the user's pending request when issued directly", async () => {
    await requestPrimeId({ holderType: "entrepreneur", category: "startup" });
    expect((await adminIssuePrimeId({ userId: USER.id, holderType: "entrepreneur", category: "startup" })).ok).toBe(true);
    const [r] = await migratorSql`SELECT status FROM prime_id_request WHERE user_id = ${USER.id}`;
    expect(r.status).toBe("issued");
  });

  test("eligibility + context reflect an already-issued credential", async () => {
    // Before: eligible + no active credential.
    expect((await listPrimeIdEligibleUsers()).some((u) => u.id === USER.id)).toBe(true);
    const before = await getPrimeIdIssueContext(USER.id);
    expect(before?.activeCredentialId).toBeNull();
    expect(before?.suggestedHolderType).toBe("entrepreneur");
    expect(before?.ventureName).toBe("Zero9 Farms");

    await adminIssuePrimeId({ userId: USER.id, holderType: "entrepreneur", category: "startup" });

    // After: no longer eligible; context reports the active credential.
    expect((await listPrimeIdEligibleUsers()).some((u) => u.id === USER.id)).toBe(false);
    const after = await getPrimeIdIssueContext(USER.id);
    expect(after?.activeCredentialId).toMatch(/^PRM-ML-/);
  });
});
