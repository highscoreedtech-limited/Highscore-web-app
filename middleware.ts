import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// App routes that require a logged-in user. Marketing pages (/, /pricing, …)
// and auth pages stay public.
const PROTECTED = [
  "/dashboard",
  "/lms",
  "/courses",
  "/cbt",
  "/quiz",
  "/rewards",
  "/chat",
  "/profile",
  "/analytics",
  "/referral",
  "/news",
  "/admin",
];

const AUTH_PAGES = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // hs_auth is a non-sensitive UX flag set on login; the backend still enforces
  // real auth via JWT on every API call.
  const isAuthed = req.cookies.get("hs_auth")?.value === "1";

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Not logged in → bounce to login, remembering where they were headed.
  if (isProtected && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in → keep them out of the auth pages.
  if (isAuthed && AUTH_PAGES.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, the API proxies, and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)"],
};
