import Image from "next/image";
import type { ReactNode } from "react";

/** Centered card shell shared by the login / forgot / reset / verify screens. */
export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <Image
          src="/logo-color.png"
          alt="PRIME"
          width={676}
          height={183}
          className="mx-auto h-9 w-auto"
          priority
        />
        <h1 className="mt-6 text-center text-lg font-semibold text-zinc-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-zinc-500">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-5 text-center text-xs text-zinc-400">
        Government of Meghalaya · PRIME Programme
      </p>
    </main>
  );
}
