import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("propvista-access-token")?.value;

  const { pathname } = req.nextUrl;

  // ==============================
  // 🔓 ALLOW PUBLIC ROUTES
  // ==============================

  // Allow login page (VERY IMPORTANT)
  if (pathname.startsWith("/x-admin/login")) {
    return NextResponse.next();
  }

  // (optional) allow API auth routes if needed
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // ==============================
  // 🔐 PROTECT ADMIN ROUTES
  // ==============================

  const isAdminRoute = pathname.startsWith("/x-admin");

  if (isAdminRoute && !token) {
    return NextResponse.redirect(
      new URL("/x-admin/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/x-admin/:path*"],
};