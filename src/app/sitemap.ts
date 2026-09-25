import type { MetadataRoute } from "next";
import { articles } from "@/content/insights";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { siteUrl } from "@/config/site";

/**
 * Only URLs that exist and are meant to be indexed.
 *
 * French routes are deliberately absent: the locale is wired but has no
 * content yet, and listing empty pages is a reliable way to earn a thin-content
 * assessment across the whole domain. They get added when `fr.json` does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const stat = ["", "/work", "/services", "/insights", "/studio", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    }),
  );

  return [
    ...stat,
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
