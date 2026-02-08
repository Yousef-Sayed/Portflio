import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ar"];
const DEFAULT_LOCALE = "en";
const COOKIE_NAME = "ytech-locale";

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip Next.js internals and all static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get locale from cookie, or fallback to default
  const cookieLocale = req.cookies.get(COOKIE_NAME)?.value;
  const locale = LOCALES.includes(cookieLocale || "") ? cookieLocale! : DEFAULT_LOCALE;

  // Create response and set locale cookie
  const response = NextResponse.next();

  // Ensure cookie is set (will be updated by client-side when language changes)
  if (!req.cookies.has(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, locale, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
