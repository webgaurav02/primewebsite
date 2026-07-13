"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { signInAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signInAction({ email, password });
    if (!res.ok) {
      setLoading(false);
      setError(res.error);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Branding panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between px-14 py-12 xl:px-20 xl:py-16">

        {/* Photo collage background */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1 pointer-events-none select-none">
          {/* Col 1 */}
          <div className="flex flex-col gap-1">
            {["Zero9Farms.jpg", "CasseyTurima1.jpg", "Mawriegarments5.jpg", "Sakhionaprofile.jpg"].map((img) => (
              <div key={img} className="relative flex-1">
                <Image src={`/assets/entrepreneurs-directory/${img}`} alt="" fill className="object-cover object-top" sizes="15vw" />
              </div>
            ))}
          </div>
          {/* Col 2 — offset down */}
          <div className="flex flex-col gap-1 -mt-16">
            {["Shangkai4.jpg", "RoseTegiteprofile.jpg", "Theteastorycp.jpg", "CrochetHavenprofile.jpg", "jets2.jpg"].map((img) => (
              <div key={img} className="relative flex-1">
                <Image src={`/assets/entrepreneurs-directory/${img}`} alt="" fill className="object-cover object-top" sizes="15vw" />
              </div>
            ))}
          </div>
          {/* Col 3 — offset up */}
          <div className="flex flex-col gap-1 mt-12">
            {["Medirahandloomprofile.jpg", "Laichphrangprofile.jpg", "larimikacp.jpg", "soolaprofile.jpg"].map((img) => (
              <div key={img} className="relative flex-1">
                <Image src={`/assets/entrepreneurs-directory/${img}`} alt="" fill className="object-cover object-top" sizes="15vw" />
              </div>
            ))}
          </div>
        </div>

        {/* Dark green overlay */}
        <div className="absolute inset-0 bg-[#1B4332]/[0.88]" />
        {/* Left edge vignette so text pops */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/60 via-transparent to-transparent" />

        {/* Content */}
        <Link href="/" className="relative z-10">
          <Image
            src="/logo-white.png"
            alt="PRIME"
            width={110}
            height={36}
            className="object-contain"
          />
        </Link>

        <div className="relative z-10">
          <h2
            className="font-black text-white leading-[0.88] tracking-tight mb-6"
            style={{ fontSize: "var(--text-display)" }}
          >
            Your<br />
            journey<br />
            starts<br />
            <span className="text-[#74C69D]">here.</span>
          </h2>
          <p
            className="text-white/40 leading-[1.75] max-w-xs"
            style={{ fontSize: "var(--text-body)" }}
          >
            Access your PRIME dashboard to track applications, enrol in programs,
            and grow your enterprise.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-8">
          <p
            className="font-black text-[#74C69D] leading-none mb-2"
            style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}
          >
            2,847+
          </p>
          <p className="text-white/30 font-medium" style={{ fontSize: "var(--text-sm)" }}>
            Entrepreneurs building Meghalaya&apos;s future
          </p>
        </div>
      </div>

      {/* ── Right: Login form ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-12 bg-[#f9f9f9]">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden mb-10">
            <Image src="/logo-color.png" alt="PRIME Meghalaya" width={160} height={44} className="h-8 w-auto object-contain object-left" />
          </Link>

          <p
            className="font-semibold tracking-[0.22em] uppercase text-black/30 mb-3"
            style={{ fontSize: "var(--text-label)" }}
          >
            Entrepreneur Portal
          </p>
          <h1
            className="font-black text-black tracking-tight mb-1.5"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Sign in
          </h1>
          <p className="text-black/40 mb-8" style={{ fontSize: "var(--text-sm)" }}>
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {error && (
              <p className="text-[#b91c1c]" style={{ fontSize: "var(--text-sm)" }} role="alert">
                {error}
              </p>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-semibold text-black/60"
                style={{ fontSize: "var(--text-sm)" }}
              >
                Email address
              </label>
              <div className="relative">
                <HiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                  size={16}
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-black/12 pl-10 pr-4 py-3 text-black placeholder:text-black/20 focus:outline-none focus:border-[#2D6A4F] transition-colors"
                  style={{ fontSize: "var(--text-sm)" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="font-semibold text-black/60"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <HiLockClosed
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                  size={16}
                />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-black/12 pl-10 pr-11 py-3 text-black placeholder:text-black/20 focus:outline-none focus:border-[#2D6A4F] transition-colors"
                  style={{ fontSize: "var(--text-sm)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4332] text-white font-bold py-3.5 hover:bg-[#2D6A4F] disabled:opacity-60 transition-all mt-1 flex items-center justify-center gap-2"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in to PRIME"
              )}
            </button>
          </form>

          <div className="border-t border-black/[0.07] mt-8 pt-6 text-center">
            <p className="text-black/40" style={{ fontSize: "var(--text-sm)" }}>
              New to PRIME?{" "}
              <Link
                href="/register"
                className="text-[#2D6A4F] font-semibold hover:text-[#1B4332] transition-colors"
              >
                Apply now →
              </Link>
            </p>
          </div>

          <p className="text-center text-black/20 mt-6" style={{ fontSize: "var(--text-label)" }}>
            Government of Meghalaya · PRIME Programme
          </p>
        </div>
      </div>
    </div>
  );
}
