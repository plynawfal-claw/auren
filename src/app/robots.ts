import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

/**
 * Preview and development deployments refuse indexing outright.
 *
 * Without this, every preview URL becomes a full duplicate of the site
 * competing with the real domain. It is one of the cheapest mistakes to make
 * and one of the most expensive to unpick afterwards.
 */
export default function robots(): MetadataRoute.Robots {
  const env = process.env.VERCEL_ENV;
  const isProduction = !env || env === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
