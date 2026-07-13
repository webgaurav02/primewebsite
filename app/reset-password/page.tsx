import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/app/components/AuthCard";
import ResetForm from "./_components/ResetForm";

export const metadata: Metadata = {
  title: "Set a new password — PRIME Meghalaya",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthCard title="Set a new password">
        <p className="text-center text-sm text-zinc-600">
          This link is missing its reset token.{" "}
          <Link href="/forgot-password" className="font-medium text-zinc-900 underline">
            Request a new one
          </Link>
          .
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set a new password">
      <ResetForm token={token} />
    </AuthCard>
  );
}
