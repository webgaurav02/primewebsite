"use client";

import { useActionState, useState } from "react";
import { IDLE, fieldError, formError, type FormState } from "@/lib/forms";
import { inputCls, labelCls, errCls, btnCls } from "@/app/components/formStyles";
import { ADMIN_ROLE_OPTIONS, REGION_OPTIONS, roleOwnsRegions } from "@/lib/admins/types";
import type { Region, Role } from "@/lib/auth/rbac";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export default function AdminForm({
  mode,
  action,
  admin,
  submitLabel,
}: {
  mode: "create" | "edit";
  action: Action;
  admin?: { id: string; email: string; name: string; role: Role; regions: Region[] };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, IDLE);
  const [role, setRole] = useState<Role>(admin?.role ?? "grievance_officer");
  const showRegions = roleOwnsRegions(role);
  const blurb = ADMIN_ROLE_OPTIONS.find((o) => o.value === role)?.blurb;

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
      {formError(state) && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError(state)}</p>
      )}
      {state.status === "success" && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {mode === "create" ? "Admin created." : "Changes saved."}
        </p>
      )}

      {mode === "edit" && <input type="hidden" name="adminId" value={admin!.id} />}

      {mode === "create" ? (
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" autoComplete="off" className={`mt-1.5 ${inputCls}`} placeholder="officer@primemeghalaya.com" />
          {fieldError(state, "email") && <p className={errCls}>{fieldError(state, "email")}</p>}
        </div>
      ) : (
        <div>
          <span className={labelCls}>Email</span>
          <p className="mt-1 text-sm text-zinc-500">
            {admin!.email} <span className="text-zinc-400">· cannot be changed</span>
          </p>
        </div>
      )}

      <div>
        <label htmlFor={`name-${mode}`} className={labelCls}>Full name</label>
        <input id={`name-${mode}`} name="name" defaultValue={admin?.name ?? ""} className={`mt-1.5 ${inputCls}`} placeholder="Full name" />
        {fieldError(state, "name") && <p className={errCls}>{fieldError(state, "name")}</p>}
      </div>

      <div>
        <label htmlFor={`role-${mode}`} className={labelCls}>Role</label>
        <select
          id={`role-${mode}`}
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className={`mt-1.5 ${inputCls}`}
        >
          {ADMIN_ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {blurb && <p className="mt-1 text-xs text-zinc-500">{blurb}</p>}
      </div>

      {showRegions && (
        <fieldset>
          <legend className={labelCls}>Regions</legend>
          <div className="mt-1.5 space-y-1.5">
            {REGION_OPTIONS.map((r) => (
              <label key={r.value} className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  name="regions"
                  value={r.value}
                  defaultChecked={admin?.regions.includes(r.value) ?? false}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                {r.label}
              </label>
            ))}
          </div>
          {fieldError(state, "regions") && <p className={errCls}>{fieldError(state, "regions")}</p>}
        </fieldset>
      )}

      {mode === "create" && (
        <div>
          <label htmlFor="password" className={labelCls}>
            Initial password <span className="font-normal text-zinc-400">· optional</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={`mt-1.5 ${inputCls}`}
            placeholder="Min 8 characters"
          />
          {fieldError(state, "password") && <p className={errCls}>{fieldError(state, "password")}</p>}
          <p className="mt-1 text-xs text-zinc-500">
            Sets their sign-in password. Leave blank to create a directory record only — you can
            set a password later from the row.
          </p>
        </div>
      )}

      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
