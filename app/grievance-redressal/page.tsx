import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import { TEMPLATES, getTemplate } from "./templates";
import { ZONES } from "./zones";
import GrievanceWizard from "./_components/GrievanceWizard";
import { InfoIcon } from "./_components/icons";

export const metadata: Metadata = {
  title: "Grievance Redressal — PRIME Meghalaya State Startup Portal",
  description:
    "File a grievance with the PRIME Startup Portal. Pick a topic or describe it yourself — we route it to the right zone helpline and give you a ticket reference to track it.",
};

export default async function GrievanceRedressalPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const sp = await searchParams;
  // Validate ?topic= against the catalog so an arbitrary value can't seed state.
  const initialTopic = getTemplate(sp.topic)?.id;

  return (
    <>
      <a
        href="#grievance-form"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to grievance form
      </a>

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
          <Image
            src="/logo-color.png"
            alt="PRIME — Meghalaya State Startup Portal"
            width={676}
            height={183}
            priority
            className="h-9 w-auto"
          />

          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            How can we help?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            File a grievance with the PRIME Startup Portal. We&apos;ll route it to
            the right zone helpline and give you a ticket reference to track it.
          </p>

          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-700" />
            <p className="text-sm text-zinc-600">
              Your details are used only to handle this grievance and update you,
              and are processed under the Digital Personal Data Protection (DPDP)
              Act. No login needed.
            </p>
          </div>

          <div id="grievance-form">
            <GrievanceWizard
              templates={[...TEMPLATES]}
              zones={[...ZONES]}
              initialTopic={initialTopic}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
