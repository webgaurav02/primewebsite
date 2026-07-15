"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { inputCls, labelCls, btnCls } from "@/app/components/formStyles";
import { adminSignInAction } from "../actions";

/**
 * Admin email + password sign-in form. Visible in ALL environments (production
 * included). Verification, rate-limiting, lockout and the session cookie are
 * handled server-side by adminSignInAction → the admin-auth DAL.
 */
export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await adminSignInAction({ email, password });
    if (!res.ok) {
      setLoading(false);
      setError(res.error);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="email" className={labelCls}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@primemeghalaya.com"
          className={`mt-1.5 ${inputCls}`}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelCls}>
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className={btnCls}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
