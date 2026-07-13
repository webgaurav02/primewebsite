import { describe, test, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import { publicSubmissionSchema } from "@/lib/validation/grievance";

const validRegister = {
  fullName: "Kyrsoibor Nongrum",
  email: "k@example.com",
  password: "correct-horse-8",
  confirmPassword: "correct-horse-8",
  persona: "entrepreneur",
  gender: "male",
  dateOfBirth: "1994-03-11",
  mobile: "9876500011",
  preferredLanguage: "Khasi",
  district: "East Khasi Hills",
  howHeard: "PRIME event or workshop",
  consent: true,
};

describe("registerSchema", () => {
  test("accepts a valid registration", () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
  });

  test("rejects mismatched passwords on confirmPassword", () => {
    const r = registerSchema.safeParse({
      ...validRegister,
      confirmPassword: "different",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.includes("confirmPassword"))).toBe(
        true,
      );
    }
  });

  test("rejects short password, bad email, non-10-digit mobile, unchecked consent", () => {
    expect(registerSchema.safeParse({ ...validRegister, password: "short", confirmPassword: "short" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, email: "nope" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, mobile: "123" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, consent: false }).success).toBe(false);
  });

  test("rejects an unknown district / persona", () => {
    expect(registerSchema.safeParse({ ...validRegister, district: "Nowhere" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, persona: "wizard" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  test("requires a valid email and a non-empty password", () => {
    expect(loginSchema.safeParse({ email: "k@example.com", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "bad", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "k@example.com", password: "" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  test("requires token + matching >=8 char passwords", () => {
    expect(resetPasswordSchema.safeParse({ token: "t", password: "longenough", confirmPassword: "longenough" }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ token: "", password: "longenough", confirmPassword: "longenough" }).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ token: "t", password: "longenough", confirmPassword: "mismatch!!" }).success).toBe(false);
  });
});

describe("publicSubmissionSchema (grievance intake)", () => {
  test("accepts a well-formed complaint", () => {
    const r = publicSubmissionSchema.safeParse({
      region: "ri_bhoi",
      subject: "Water connection for the Nongpoh hub kitchen",
      description: "The shared kitchen has had no running water for over a week now.",
      complainantName: "Test Complainant",
      complainantEmail: "test@example.com",
      complainantPhone: "+91 90000 00099",
    });
    expect(r.success).toBe(true);
  });

  test("rejects an unknown region and too-short fields", () => {
    expect(publicSubmissionSchema.safeParse({ region: "nowhere", subject: "x", description: "y", complainantName: "a", complainantEmail: "b@c.d", complainantPhone: "12345" }).success).toBe(false);
  });
});
