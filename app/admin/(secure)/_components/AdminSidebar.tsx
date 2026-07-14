"use client";

/* eslint-disable @next/next/no-img-element -- static logo, no optimization needed in chrome */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can, type AdminUser, type Permission } from "@/lib/auth/rbac";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  grievance_officer: "Grievance Officer",
  auditor: "Auditor",
};

type Item = { href: string; label: string; perm: Permission | null; icon: React.ReactNode };

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px]">
      {d.split("|").map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

// More sections are added here as they are rebuilt server-side (Organisations,
// Programs, Documents in later phases).
const NAV: Item[] = [
  { href: "/admin", label: "Dashboard", perm: null, icon: <Icon d="M4 13h7V4H4zM13 9h7V4h-7zM13 20h7v-9h-7zM4 20h7v-5H4z" /> },
  { href: "/admin/users", label: "Users", perm: "user:manage", icon: <Icon d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7|2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6|17 4.5a3 3 0 0 1 0 6|18.5 14c2 .5 3 2.4 3 5" /> },
  { href: "/admin/prime-id", label: "PRIME ID", perm: "prime_id:review", icon: <Icon d="M3 6h18v12H3z|8 10.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6|5.5 16c.4-1.8 1.5-2.6 2.5-2.6s2.1.8 2.5 2.6|13.5 9h5M13.5 12h5M13.5 15h3" /> },
  { href: "/admin/events", label: "Events", perm: "event:publish", icon: <Icon d="M4 5h16v15H4z|4 9h16|8 3v4M16 3v4" /> },
  { href: "/admin/grievances", label: "Grievances", perm: "grievance:read", icon: <Icon d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z" /> },
];

export default function AdminSidebar({
  admin,
  logout,
}: {
  admin: AdminUser;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = NAV.filter((i) => i.perm === null || can(admin, i.perm));

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-zinc-200 px-5">
        <img src="/logo-color.png" alt="PRIME" className="h-7 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                active ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {it.icon}
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-3">
        <div className="px-2 pb-2">
          <div className="truncate text-sm font-medium text-zinc-900">{admin.name}</div>
          <div className="text-xs text-zinc-500">{ROLE_LABEL[admin.role] ?? admin.role}</div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-zinc-200 bg-white lg:block">
        {panel}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md border border-zinc-300 p-1.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <img src="/logo-color.png" alt="PRIME" className="h-6 w-auto" />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">{panel}</div>
        </div>
      )}
    </>
  );
}
