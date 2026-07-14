import type { Metadata } from "next";
import Link from "next/link";
import { getMyPrimeId } from "@/lib/dal/prime-id";
import RequestForm from "./_components/RequestForm";
import PrimeIdCard from "./_components/PrimeIdCard";

export const metadata: Metadata = {
  title: "PRIME ID — My account",
};

export default async function IdCardPage() {
  const { request, credential } = await getMyPrimeId();

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Your PRIME ID</h1>
        <Link href="/account" className="text-sm text-zinc-500 underline">
          Back to account
        </Link>
      </div>

      {/* Issued credential → show the card */}
      {credential && credential.status !== "revoked" ? (
        <div className="mt-8">
          <PrimeIdCard card={credential} />
        </div>
      ) : credential && credential.status === "revoked" ? (
        <div className="mt-8">
          <PrimeIdCard card={credential} />
        </div>
      ) : request?.status === "pending" ? (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-900">Request under review</p>
          <p className="mt-1 text-sm text-amber-800">
            PRIME is reviewing your request. You&apos;ll be able to download your
            card here once it&apos;s approved.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          {request?.status === "rejected" && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Your previous request was declined
              {request.rejectionReason ? `: ${request.rejectionReason}` : "."} You
              can submit a new request below.
            </p>
          )}
          <p className="mb-4 text-sm text-zinc-600">
            Request a government-recognized PRIME ID credential. Most details come
            from your profile; confirm the framing below.
          </p>
          <RequestForm defaultVenture={undefined} />
        </div>
      )}
    </main>
  );
}
