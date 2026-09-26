import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/navigation";
import { defaultLocale, locales } from "@/i18n/config";

// Next 16 renamed `middleware` to `proxy`. Same mechanism, same file position
// (beside `app/`), different filename — see node_modules/next/dist/docs.
const handleLocale = createMiddleware(routing);

/** The only thing this site writes to the visitor's browser. */
const LOCALE_COOKIE = "auren-locale";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Every locale that is not the default one gets a public URL prefix.
 *
 * Derived from the registry rather than hardcoded. The previous version
 * special-cased `/fr` by hand, so adding `ar` to `i18n/config.ts` published a
 * locale that 404'd on every route: the rewrite below sent `/ar/work` to
 * `/en/ar/work`, which matches no segment pair. One source of truth for the
 * locale list means a locale cannot be declared and then silently unrouted.
 */
const prefixed = locales.filter((locale) => locale !== defaultLocale);

/** True for `/fr`, `/ar`, and their subpaths, but not for `/france`. */
function hasPrefix(pathname: string) {
  return prefixed.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

/** Which locale a path is actually in, default included. */
function localeOf(pathname: string): (typeof locales)[number] {
  for (const locale of prefixed) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale;
  }
  return defaultLocale;
}

/** Records the choice. A year, root path, `SameSite=Lax`, no `Secure` so it
 *  also survives a plain-http preview deploy. */
function rememberLocale(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: ONE_YEAR,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // The default-locale rewrite from next-intl currently loops back to the
  // same URL in Next 16. Resolve default-locale paths directly while keeping
  // their public URLs unprefixed. The internal `/en` route must pass through: a
  // rewrite can invoke the proxy again before the page renders.
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    return NextResponse.next();
  }

  // Anything without a known locale prefix is English, served unprefixed.
  if (!hasPrefix(pathname)) {
    // A returning visitor who chose Arabic or French is put back on their own
    // language rather than dumped on English. This reads a cookie the visitor
    // set themselves and nothing else — Accept-Language is still ignored, so a
    // cold crawler and a first-time visitor both get the canonical URL, and
    // the redirect only ever happens to somebody who has already been here.
    const remembered = request.cookies.get(LOCALE_COOKIE)?.value as
      | (typeof locales)[number]
      | undefined;
    if (remembered && remembered !== defaultLocale && locales.includes(remembered)) {
      const destination = request.nextUrl.clone();
      destination.pathname = `/${remembered}${pathname === "/" ? "" : pathname}`;
      return rememberLocale(NextResponse.redirect(destination), remembered);
    }

    const destination = request.nextUrl.clone();
    destination.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(destination);
  }

  const response = handleLocale(request);
  return rememberLocale(response, localeOf(pathname));
}

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  // Crucially this keeps sitemap.xml / robots.txt / llms.txt off the locale
  // rewrite path, so they are served exactly where crawlers expect them.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
