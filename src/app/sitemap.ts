import type { MetadataRoute } from "next";
import { articles } from "@/content/insights";
import { projects } from "@/content/projects";
import { concepts } from "@/content/concepts";
import { services } from "@/content/services";
import { siteUrl } from "@/config/site";

/**
 * Only URLs that exist and are meant to be indexed.
 *
 * Locale-prefixed routes are deliberately absent. The three locales are wired
 * and routable, and `hreflang` connects them, but English is the only one with
 * written copy — `messages/en.json` is a placeholder and the rest of the site
 * reads from components. Listing `/fr/work` and `/ar/work` today would point
 * crawlers at three copies of the same English text and earn a thin-content
 * assessment across the whole domain.
 *
 * They are added the day the translations land. The switcher and the proxy
 * already resolve them, so nothing else has to change at that point — only
 * this list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const stat = ["", "/work", "/concepts", "/services", "/insights", "/studio", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    }),
  );

  return [
    ...stat,
    // The five concepts are indexed as one page, not as five case studies:
    // they are anchored sections of /concepts, and listing them as separate
    // URLs would imply five projects that do not exist.
    ...concepts.map((concept) => ({
      url: `${siteUrl}/concepts#concept-${concept.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/insights/${a.slug}`,
      lastModified: new Date(a.updated ?? a.published),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
