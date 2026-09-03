import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, localeCodes } from "@/lib/i18n";

/**
 * Locale routing.
 *
 * Any path without a locale prefix is redirected to the default locale,
 * so /services becomes /en/services. This exists so that no published URL
 * ever has to change when a second language ships — a URL migration after
 * Clutch, GoodFirms and LinkedIn have linked to us would cost real SEO
 * equity and a pile of redirects.
 *
 * When a second locale is added, Accept-Language negotiation goes here.
 *
 * (Next 16 renamed the `middleware` convention to `proxy`.)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = localeCodes.some(
    (code) => pathname === `/${code}` || pathname.startsWith(`/${code}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
