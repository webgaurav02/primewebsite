import { z } from "zod";
import {
  LANGUAGES,
  HOW_HEARD,
  MEGHALAYA_DISTRICTS,
} from "@/lib/users/types";

/**
 * All untrusted auth input is parsed through these before the DAL touches it.
 * The register schema mirrors the fields the public register wizard collects,
 * plus real password + consent (the old mock discarded the password).
 */

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(200, "That password is too long.");

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(80),
    email: z.email("Enter a valid email.").max(254),
    password,
    confirmPassword: z.string(),
    persona: z.enum(["entrepreneur", "mentor", "investor"]),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required.")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date.")
      .refine((v) => Date.parse(v) < Date.now(), "Date of birth must be in the past."),
    mobile: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Enter a 10-digit mobile number."),
    preferredLanguage: z.enum(LANGUAGES as unknown as [string, ...string[]]),
    district: z.enum(MEGHALAYA_DISTRICTS as unknown as [string, ...string[]]),
    howHeard: z.enum(HOW_HEARD as unknown as [string, ...string[]]),
    consent: z.literal(true, { error: "You must accept to continue." }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email.").max(254),
  password: z.string().min(1, "Enter your password."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email.").max(254),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
