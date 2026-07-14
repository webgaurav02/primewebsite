import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TrackForm from "./_components/TrackForm";

export const metadata: Metadata = {
  title: "Track your grievance — PRIME Meghalaya",
};

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center">
          <Image src="/logo-color.png" alt="PRIME Meghalaya" width={676} height={183} className="h-9 w-auto" priority />
        </div>
        <h1 className="text-center text-2xl font-black tracking-tight text-[#1B4332]">Track your grievance</h1>
        <p className="mt-2 text-center text-sm text-black/50">
          Enter your ticket reference and the email you used. We&apos;ll show the
          current status — no personal details are displayed.
        </p>
        <div className="mt-8">
          <TrackForm />
        </div>
        <p className="mt-6 text-center text-sm text-black/40">
          <Link href="/grievance-redressal" className="underline">File a new grievance</Link>
        </p>
      </div>
    </main>
  );
}
