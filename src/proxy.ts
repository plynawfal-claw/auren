import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/navigation";
import { defaultLocale, locales } from "@/i18n/config";
import { siteConfig } from "@/config/siteConfig";

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

  // One hostname. `www.` is attached only so it can be sent to the apex, with
  // a permanent redirect that keeps the path and query — otherwise the site
  // exists twice and the two copies compete.
  const host = request.headers.get("host") ?? "";
  if (host === `www.${siteConfig.domain}`) {
    return NextResponse.redirect(`https://${siteConfig.domain}${pathname}${request.nextUrl.search}`, 308);
  }

  // API routes and files (sitemap.xml, robots.txt, llms.txt, images) are not
  // localised: they are served exactly where crawlers expect them.
  if (pathname.startsWith("/api") || /\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // The default-locale rewrite from next-intl currently loops back to the
  // same URL in Next 16. Resolve default-locale paths directly while keeping
  // their public URLs unprefixed. The internal `/en` route must pass through: a
  // rewrite can invoke the proxy again before the page renders.
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    // An explicit English selection must replace an earlier FR/AR choice;
    // otherwise the next unprefixed project link redirects back to it.
    return rememberLocale(NextResponse.next(), defaultLocale);
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
  // Everything except Next internals reaches the proxy, so the www redirect
  // also covers sitemap.xml, robots.txt and the API. (A host-conditional
  // `has` matcher would be tidier, but the Cloudflare adapter does not honour
  // it and ran the locale rewrite on sitemap.xml.) The function itself lets
  // API routes and anything with a file extension straight through.
  matcher: ["/((?!_next|_vercel).*)"],
};
