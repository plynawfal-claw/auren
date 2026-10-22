"use client";

import { usePathname } from "@/i18n/navigation";
import { defaultLocale, localeHtmlLang, type Locale } from "@/i18n/config";
import { siteUrl } from "@/config/site";
import { canonicalLocale, localesFor } from "@/i18n/translated";

/**
 * Per-locale `canonical` and `hreflang` for the current route.
 *
 * Why this component exists rather than `alternates` in each page's `metadata`:
 * a relative canonical is resolved against `metadataBase`, which is locale-free.
 * So the nine static `metadata` objects each declared `canonical: "/work"` and
 * Next emitted `https://aurren.app/work` on the French and Arabic pages too —
 * every locale claiming the English URL as canonical, which tells a crawler the
 * other two are duplicates of the first and should be dropped from the index.
 * That was latent while only English was routable, and became a live bug the
 * moment `/fr` and `/ar` started resolving.
 *
 * Deriving it from `usePathname` fixes it once, for every route, including the
 * `[slug]` ones — the pathname already carries the segment, so no page has to
 * remember to build its own canonical correctly.
 *
 * The two server-side alternatives were both rejected:
 *   - `headers()` would opt every page out of static rendering, turning 51
 *     prerendered pages into server-rendered ones;
 *   - repeating this block in each of the nine `metadata` objects duplicates one
 *     rule nine times and silently rots on the tenth.
 *
 * It is a client component, but it renders on the server as part of the static
 * HTML — React hoists `<link>` into `<head>`, so crawlers read it from the same
 * response as everything else. Nothing is deferred to hydration, and nothing
 * about it depends on JavaScript running.
 *
 * `usePathname` from next-intl is already locale-stripped, so `/ar/work` and
 * `/work` both report `/work`; the prefix is reapplied explicitly per locale.
 */
export function LocaleAlternates({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const suffix = pathname === "/" ? "" : pathname;

  // English is served unprefixed (`localePrefix: "as-needed"`), so it is the
  // only locale whose canonical is the bare path.
  const hrefFor = (option: Locale) =>
    `${siteUrl}${option === defaultLocale ? "" : `/${option}`}${suffix}`;

  // A French or Darija URL that still renders the English copy is a duplicate
  // of the English page, so its canonical says so; only routes with real
  // copy in a language are announced in that language (see i18n/translated).
  const canonical = hrefFor(canonicalLocale(pathname, locale));
  const available = localesFor(pathname);

  return (
    <>
      <link rel="canonical" href={canonical} />
      {available.length > 1 &&
        available.map((option) => (
          <link key={option} rel="alternate" hrefLang={localeHtmlLang[option]} href={hrefFor(option)} />
        ))}
      {/* English is the only locale with written copy, so it is the correct
          fallback for a visitor whose language matches nothing here. */}
      {available.length > 1 && (
        <link rel="alternate" hrefLang="x-default" href={hrefFor(defaultLocale)} />
      )}

      {/* `og:url` and `twitter:url` follow the canonical for the same reason:
          a hardcoded value in `metadata` resolves to the English origin on
          every locale, so a French share card would have claimed to be a link
          to the English page. Emitted here so it cannot drift from canonical. */}
      <meta property="og:url" content={canonical} />
      <meta name="twitter:url" content={canonical} />
    </>
  );
}
