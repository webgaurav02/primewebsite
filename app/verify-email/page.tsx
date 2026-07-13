import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/app/components/AuthCard";
import { verifyEmailToken } from "@/lib/dal/auth";
import ResendForm from "./_components/ResendForm";

export const metadata: Metadata = {
  title: "Verify email — PRIME Meghalaya",
};

// Force dynamic: this consumes a single-use token, never cache it.
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await verifyEmailToken(token) : { ok: false };

  if (result.ok) {
    return (
      <AuthCard title="Email verified">
        <p className="text-center text-sm text-zinc-600">
          Your PRIME account is now active. You can sign in.
        </p>
        <Link
          href="/login?verified=1"
          className="mt-5 block rounded-md bg-black px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Verification link invalid">
      <p className="text-center text-sm text-zinc-600">
        This link is invalid or has expired. Enter your email to get a fresh
        verification link.
      </p>
      <div className="mt-5">
        <ResendForm />
      </div>
    </AuthCard>
  );
}
