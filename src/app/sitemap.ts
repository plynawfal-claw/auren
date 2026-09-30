import type { MetadataRoute } from "next";
import { articles } from "@/content/insights";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { siteUrl } from "@/config/site";
import { localeHtmlLang } from "@/i18n/config";
import { localesFor, localeUrl } from "@/i18n/translated";

type Entry = MetadataRoute.Sitemap[number];

/**
 * Only URLs that exist, are canonical, and are meant to be indexed.
 *
 * Every route is routable in all three locales, but a locale URL is listed
 * only where that route has real copy in that language (`i18n/translated`).
 * The rest render the English text under a prefix and canonicalise to the
 * English page, so listing them would point crawlers at duplicates.
 *
 * Each listed URL carries its language alternates, mirroring the hreflang
 * that `LocaleAlternates` puts in the page head — the two read the same
 * registry, so they cannot disagree.
 */
function entries(
  path: string,
  rest: Omit<Entry, "url" | "alternates">,
): Entry[] {
  const available = localesFor(path);
  const languages =
    available.length > 1
      ? {
          ...Object.fromEntries(available.map((l) => [localeHtmlLang[l], localeUrl(siteUrl, l, path)])),
          "x-default": localeUrl(siteUrl, "en", path),
        }
      : undefined;
  return available.map((locale) => ({
    url: localeUrl(siteUrl, locale, path),
    ...rest,
    ...(languages ? { alternates: { languages } } : {}),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...["/", "/work", "/services", "/insights", "/studio", "/contact"].flatMap((path) =>
      entries(path, {
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
      }),
    ),
    ...projects.flatMap((p) =>
      entries(`/work/${p.slug}`, { lastModified: now, changeFrequency: "yearly", priority: 0.7 }),
    ),
    ...services.flatMap((s) =>
      entries(`/services/${s.slug}`, { lastModified: now, changeFrequency: "monthly", priority: 0.9 }),
    ),
    ...articles.flatMap((a) =>
      entries(`/insights/${a.slug}`, {
        lastModified: new Date(a.updated ?? a.published),
        changeFrequency: "yearly",
        priority: 0.6,
      }),
    ),
  ];
}
