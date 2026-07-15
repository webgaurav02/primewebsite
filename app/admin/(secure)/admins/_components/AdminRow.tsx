"use client";

import { useActionState, useState } from "react";
import { IDLE, formError, type FormState } from "@/lib/forms";
import { ADMIN_ROLE_LABELS, REGION_LABELS } from "@/lib/admins/types";
import type { Region, Role } from "@/lib/auth/rbac";
import { setActiveAction, updateAdminAction } from "../actions";
import AdminForm from "./AdminForm";

export interface AdminRowData {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  regions: Region[];
  assignedOpenGrievances: number;
}

const ROLE_STYLE: Record<Role, string> = {
  super_admin: "bg-indigo-100 text-indigo-800",
  grievance_officer: "bg-sky-100 text-sky-800",
  auditor: "bg-zinc-200 text-zinc-700",
};

export default function AdminRow({ admin, isSelf }: { admin: AdminRowData; isSelf: boolean }) {
  const [editing, setEditing] = useState(false);
  const [state, toggle, pending] = useActionState<FormState, FormData>(setActiveAction, IDLE);
  const toggleErr = formError(state);

  return (
    <div className={`rounded-lg border bg-white p-4 ${admin.isActive ? "border-zinc-200" : "border-zinc-200 opacity-70"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-zinc-900">{admin.name}</span>
        {isSelf && <span className="rounded-full bg-black px-2 py-0.5 text-[11px] text-white">You</span>}
        <span className={`rounded-full px-2 py-0.5 text-xs ${ROLE_STYLE[admin.role]}`}>
          {ADMIN_ROLE_LABELS[admin.role]}
        </span>
        {!admin.isActive && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">disabled</span>
        )}
        <span className="ml-auto text-sm text-zinc-500">{admin.email}</span>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span>
          {admin.role === "grievance_officer"
            ? admin.regions.length
              ? admin.regions.map((r) => REGION_LABELS[r]).join(", ")
              : "no regions"
            : "all regions"}
        </span>
        {admin.assignedOpenGrievances > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
            {admin.assignedOpenGrievances} open grievance(s) assigned
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium hover:bg-zinc-100"
        >
          {editing ? "Close" : "Edit"}
        </button>

        <form action={toggle} className="flex items-center gap-2">
          <input type="hidden" name="adminId" value={admin.id} />
          <input type="hidden" name="isActive" value={(!admin.isActive).toString()} />
          <button
            type="submit"
            disabled={pending || (isSelf && admin.isActive)}
            title={isSelf && admin.isActive ? "You cannot disable your own account" : undefined}
            className={`rounded border px-2.5 py-1 text-xs font-medium disabled:opacity-40 ${
              admin.isActive
                ? "border-red-300 text-red-700 hover:bg-red-50"
                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {pending ? "…" : admin.isActive ? "Disable" : "Enable"}
          </button>
        </form>
        {toggleErr && <span className="text-xs font-medium text-red-600">{toggleErr}</span>}
      </div>

      {editing && (
        <div className="mt-3">
          <AdminForm
            mode="edit"
            action={updateAdminAction}
            admin={{ id: admin.id, email: admin.email, name: admin.name, role: admin.role, regions: admin.regions }}
            submitLabel="Save changes"
          />
        </div>
      )}
    </div>
  );
}
