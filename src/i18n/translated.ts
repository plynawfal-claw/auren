import { defaultLocale, locales, type Locale } from "./config";
import { exclusiveRoutes as landingRoutes } from "@/content/landings";
import { guides } from "@/content/guides";

/** French-only routes: the search pages and the guides (index + each guide). */
const exclusiveRoutes: Record<string, readonly Locale[]> = {
  ...landingRoutes,
  "/guides": ["fr"],
  ...Object.fromEntries(guides.map((g) => [`/guides/${g.slug}`, ["fr"] as const])),
};

/**
 * Which routes have real copy in which language.
 *
 * Every route is *routable* in all three locales, but only some are written
 * in them: the rest render English under a `/fr` or `/ar` prefix. Announcing
 * those as French or Darija pages — hreflang, sitemap, canonical — tells a
 * search engine there are three language versions of what is one English
 * page. This registry is the one place that says what is actually translated;
 * `LocaleAlternates` and `sitemap.ts` both read it, so they cannot disagree.
 *
 * When a route gains translated copy, add its prefix here — nothing else.
 */
const TRANSLATED: Record<Exclude<Locale, "en">, readonly string[]> = {
  fr: ["/", "/contact", "/services", "/services/*"],
  ar: ["/", "/contact", "/services", "/services/*"],
};

/**
 * `pathname` is locale-free, as next-intl's `usePathname` returns it.
 *
 * Routes in `exclusiveRoutes` (the French search pages in `content/landings`)
 * exist *only* in the locales they list — there is no English page behind
 * them to fall back to, so they are checked first and English gets no
 * special pass.
 */
export function isTranslated(pathname: string, locale: Locale): boolean {
  const only = exclusiveRoutes[pathname];
  if (only) return only.includes(locale);
  if (locale === defaultLocale || locale === "en") return true;
  return TRANSLATED[locale].some((pattern: string) =>
    pattern.endsWith("/*")
      ? pathname.startsWith(pattern.slice(0, -1))
      : pathname === pattern,
  );
}

/** The locales a route is genuinely available in, English first. */
export function localesFor(pathname: string): Locale[] {
  return locales.filter((locale) => isTranslated(pathname, locale));
}

/** Where a route canonicalises in `locale`: itself, English, or its only locale. */
export function canonicalLocale(pathname: string, locale: Locale): Locale {
  if (isTranslated(pathname, locale)) return locale;
  const only = exclusiveRoutes[pathname];
  return only ? only[0] : defaultLocale;
}

/**
 * Absolute URL of a locale-free path in one locale. English is unprefixed
 * (`localePrefix: "as-needed"`); the others carry their code.
 */
export function localeUrl(origin: string, locale: Locale, path: string): string {
  const suffix = path === "/" ? "" : path;
  return `${origin}${locale === defaultLocale ? "" : `/${locale}`}${suffix}`;
}
