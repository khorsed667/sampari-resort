import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth-session";

const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only intercept /admin/* paths
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isPublicAuthRoute = PUBLIC_ADMIN_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (isPublicAuthRoute) {
    // If already logged in, redirect away from login/signup to dashboard
    if (session) {
      const redirectUrl = new URL("/admin/requests", request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Protected admin routes: requires active, valid session
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    const callbackPath = pathname + search;
    if (callbackPath && callbackPath !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", callbackPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
