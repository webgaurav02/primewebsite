import type { Metadata } from "next";
import Link from "next/link";
import { getMyEditableProfile } from "@/lib/dal/profile";
import ProfileForm from "./_components/ProfileForm";

export const metadata: Metadata = {
  title: "Edit profile — My account",
};

export default async function ProfilePage() {
  const profile = await getMyEditableProfile();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Edit profile</h1>
        <Link href="/account" className="text-sm text-zinc-500 underline">
          Back to account
        </Link>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Update your details and business information. Email, date of birth, and registration
        type are fixed and can&apos;t be changed here.
      </p>

      <div className="mt-8">
        <ProfileForm initial={profile} />
      </div>
    </main>
  );
}
