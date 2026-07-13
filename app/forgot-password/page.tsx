import type { Metadata } from "next";
import AuthCard from "@/app/components/AuthCard";
import ForgotForm from "./_components/ForgotForm";

export const metadata: Metadata = {
  title: "Reset password — PRIME Meghalaya",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" subtitle="We'll email you a reset link">
      <ForgotForm />
    </AuthCard>
  );
}
