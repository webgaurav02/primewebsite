import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Self-serve registration richness through the real DAL + Postgres: registrant
 * type → persona derivation, the conditional entrepreneur profile, DPDP consent
 * persistence, the under-18 guardian flow, optional photo, and enumeration-safe
 * duplicate handling. Object storage is mocked (no real R2).
 */

vi.mock("@/lib/storage", () => ({
  MAX_IMAGE_BYTES: 5 * 1024 * 1024,
  detectImage: (b: Buffer) =>
    b[0] === 0x89 && b[1] === 0x50
      ? { ext: "png", mime: "image/png" }
      : b[0] === 0xff && b[1] === 0xd8
        ? { ext: "jpg", mime: "image/jpeg" }
        : null,
  uploadUserImage: async (prefix: string, userId: string) => ({ ok: true, key: `${prefix}/${userId}/photo.png` }),
}));

import { registerUser } from "@/lib/dal/auth";
import { getSql } from "@/lib/db/client";
import { SECTOR_LABELS } from "@/lib/entrepreneurs-data";
import { POLICY_VERSION } from "@/lib/legal/policy";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

const meta = { ip: "10.0.0.1", userAgent: "vitest" };
const PW = "correct-horse-8";
const SECTOR = Object.keys(SECTOR_LABELS)[0];

const base = (email: string, over: Record<string, unknown> = {}) => ({
  registrantType: "student",
  fullName: "Ban Ri",
  email,
  password: PW,
  confirmPassword: PW,
  gender: "female",
  dateOfBirth: "1994-03-11",
  mobile: "9876500022",
  preferredLanguage: "English",
  district: "West Garo Hills",
  howHeard: "Social media",
  consent: true,
  ...over,
});

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await getSql().end();
  await closeDb();
});

describe("registrant type → persona derivation", () => {
  test("mentor derives persona 'mentor'", async () => {
    await registerUser(base("m@x.com", { registrantType: "mentor" }), meta);
    const [u] = await migratorSql`SELECT persona, registrant_type FROM app_user WHERE email='m@x.com'`;
    expect(u.registrant_type).toBe("mentor");
    expect(u.persona).toBe("mentor");
  });

  test("student derives a NULL persona (not a mentee/mentor)", async () => {
    await registerUser(base("s@x.com", { registrantType: "student" }), meta);
    const [u] = await migratorSql`SELECT persona FROM app_user WHERE email='s@x.com'`;
    expect(u.persona).toBeNull();
  });
});

describe("conditional entrepreneur profile", () => {
  test("existing-business entrepreneur also gets an organisation + profile", async () => {
    const r = await registerUser(
      base("ent@x.com", {
        registrantType: "entrepreneur_existing",
        businessName: "Zero9 Farms",
        sector: SECTOR,
        entityType: "Pvt. Ltd",
        stage: "In Revenue",
        description: "We grow hydroponic greens for Shillong markets.",
        products: "Lettuce, basil, microgreens",
        turnover: "12 Lakh",
      }),
      meta,
    );
    expect(r.ok).toBe(true);

    const [u] = await migratorSql`SELECT id, persona, organization_id FROM app_user WHERE email='ent@x.com'`;
    expect(u.persona).toBe("entrepreneur");
    expect(u.organization_id).not.toBeNull();
    const prof = await migratorSql`SELECT business_name FROM entrepreneur_profile WHERE user_id=${u.id}`;
    expect(prof[0].business_name).toBe("Zero9 Farms");
    const org = await migratorSql`SELECT name, created_by FROM organization WHERE id=${u.organization_id}`;
    expect(org[0].name).toBe("Zero9 Farms");
    expect(org[0].created_by).toBe(u.id);
  });

  test("a non-entrepreneur has no organisation or profile", async () => {
    await registerUser(base("gov@x.com", { registrantType: "government_official" }), meta);
    const [u] = await migratorSql`SELECT id, organization_id FROM app_user WHERE email='gov@x.com'`;
    expect(u.organization_id).toBeNull();
    expect((await migratorSql`SELECT 1 FROM entrepreneur_profile WHERE user_id=${u.id}`).length).toBe(0);
  });

  test("existing-business entrepreneur must supply business fields", async () => {
    const r = await registerUser(base("bad@x.com", { registrantType: "entrepreneur_existing" }), meta);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.fieldErrors.businessName || r.fieldErrors.sector || r.fieldErrors.description).toBeTruthy();
    }
  });
});

describe("DPDP consent record", () => {
  test("registration persists a consent record with the policy version + purposes", async () => {
    await registerUser(base("c@x.com"), meta);
    const [u] = await migratorSql`SELECT id FROM app_user WHERE email='c@x.com'`;
    const [con] = await migratorSql`SELECT policy_version, purposes, is_minor, withdrawn_at, ip FROM user_consent WHERE user_id=${u.id}`;
    expect(con.policy_version).toBe(POLICY_VERSION);
    const purposes = typeof con.purposes === "string" ? JSON.parse(con.purposes) : con.purposes;
    expect(purposes).toContain("account_management");
    expect(con.is_minor).toBe(false);
    expect(con.withdrawn_at).toBeNull();
    expect(con.ip).toBe("10.0.0.1");
  });
});

describe("under-18 guardian flow (DPDP s.9)", () => {
  test("a minor without guardian consent is rejected", async () => {
    const r = await registerUser(base("kid@x.com", { dateOfBirth: "2015-06-15" }), meta);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.fieldErrors.guardianName || r.fieldErrors.guardianConsent).toBeTruthy();
    }
  });

  test("a minor with guardian consent registers, flagged is_minor", async () => {
    const r = await registerUser(
      base("kid2@x.com", {
        dateOfBirth: "2015-06-15",
        guardianName: "Dei Marak",
        guardianRelationship: "Parent",
        guardianConsent: true,
      }),
      meta,
    );
    expect(r.ok).toBe(true);
    const [u] = await migratorSql`SELECT id, guardian_name FROM app_user WHERE email='kid2@x.com'`;
    expect(u.guardian_name).toBe("Dei Marak");
    const [con] = await migratorSql`SELECT is_minor FROM user_consent WHERE user_id=${u.id}`;
    expect(con.is_minor).toBe(true);
  });
});

describe("optional profile photo", () => {
  test("a valid photo data URL is stored as a private key", async () => {
    // PNG magic bytes → the mocked storage returns a key.
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).toString("base64");
    await registerUser(base("pic@x.com", { photoDataUrl: `data:image/png;base64,${png}` }), meta);
    const [u] = await migratorSql`SELECT photo_path FROM app_user WHERE email='pic@x.com'`;
    expect(u.photo_path).toMatch(/^avatars\//);
  });

  test("a non-image payload is rejected", async () => {
    const junk = Buffer.from("not an image at all").toString("base64");
    const r = await registerUser(base("pic2@x.com", { photoDataUrl: `data:image/png;base64,${junk}` }), meta);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fieldErrors.photoDataUrl).toBeTruthy();
  });
});

describe("enumeration-safe duplicate", () => {
  test("uniform: no session, no duplicate, and a victim's reset token is NOT consumed", async () => {
    await registerUser(base("dupe@x.com"), meta);
    const [u] = await migratorSql`SELECT id FROM app_user WHERE email='dupe@x.com'`;
    // Simulate a reset link the victim legitimately requested and hasn't used yet.
    await migratorSql`INSERT INTO user_email_token (token_hash, user_id, kind, expires_at)
      VALUES ('victim-reset-hash', ${u.id}, 'reset', now() + interval '1 hour')`;

    const again = await registerUser(base("dupe@x.com"), meta);
    expect(again.ok).toBe(true);
    if (again.ok) expect(again.session).toBeUndefined(); // no session for a duplicate

    // No duplicate account was created...
    expect((await migratorSql`SELECT 1 FROM app_user WHERE email='dupe@x.com'`).length).toBe(1);
    // ...and the attacker did NOT consume the victim's pending reset token.
    const [tok] = await migratorSql`SELECT consumed_at FROM user_email_token WHERE token_hash='victim-reset-hash'`;
    expect(tok.consumed_at).toBeNull();
  });
});
