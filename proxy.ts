import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie";
import { USER_SESSION_COOKIE_NAME } from "@/lib/auth/user-cookie";

/**
 * proxy.ts is the Next.js 16 successor to middleware.ts. It runs at the network
 * boundary, before routes render.
 *
 * SECURITY NOTE — READ BEFORE EDITING:
 * This is a COARSE, OPTIMISTIC gate only. It (a) attaches a strict, nonce-based
 * CSP to ADMIN responses and (b) bounces obviously-anonymous users to a login
 * page so we don't stream a shell for them. It is NOT the authorization
 * boundary — it can be bypassed (cf. CVE-2025-29927) and Server Actions POST
 * straight to their route. The REAL checks live in the server-only Data Access
 * Layer (lib/dal/*) and in requireAdmin()/requireUser(), re-run every request.
 *
 * Two zones, deliberately different:
 *   - /admin/*                 → admin-cookie gate + strict nonce CSP.
 *   - /dashboard, /account     → user-cookie gate, NO CSP override. The member
 *     area shares the PUBLIC site's frontend (inline styles + framer-motion),
 *     which a strict nonce CSP would break.
 *
 * Why the member gate lives here: the public root layout streams a loading
 * splash, which turns an in-page redirect() into a soft client-side redirect.
 * An edge gate yields a clean 307 before anything renders.
 */

const ADMIN_LOGIN = "/admin/login";
const MEMBER_LOGIN = "/login";
const MEMBER_PREFIXES = ["/dashboard", "/account"];

function buildCsp(nonce: string, isDev: boolean): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    `img-src 'self' blob: data:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  // ── Member area: user-cookie gate only, no CSP override ─────────────────────
  if (MEMBER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!request.cookies.has(USER_SESSION_COOKIE_NAME)) {
      const url = request.nextUrl.clone();
      url.pathname = MEMBER_LOGIN;
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Admin area: strict nonce CSP + admin-cookie gate ────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce, isDev);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const isLoginPage = pathname === ADMIN_LOGIN;

  if (!hasSession && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN;
    url.search = `?next=${encodeURIComponent(pathname)}`;
    const redirect = NextResponse.redirect(url);
    redirect.headers.set("Content-Security-Policy", csp);
    return redirect;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // NOTE: this must be a STATIC literal — Next can't analyze a matcher built
  // from variables and would then run the proxy on EVERY route. `/x/:path*`
  // matches the bare `/x` and any subpath. Matcher changes require a
  // dev-server RESTART (HMR only reloads the proxy function).
  matcher: [
    {
      source: "/admin/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/dashboard/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/account/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
