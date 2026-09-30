import { defaultLocale, locales, type Locale } from "./config";

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

/** `pathname` is locale-free, as next-intl's `usePathname` returns it. */
export function isTranslated(pathname: string, locale: Locale): boolean {
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

/**
 * Absolute URL of a locale-free path in one locale. English is unprefixed
 * (`localePrefix: "as-needed"`); the others carry their code.
 */
export function localeUrl(origin: string, locale: Locale, path: string): string {
  const suffix = path === "/" ? "" : path;
  return `${origin}${locale === defaultLocale ? "" : `/${locale}`}${suffix}`;
}
