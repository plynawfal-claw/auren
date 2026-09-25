/**
 * Single source of truth for identity, URLs and contact.
 *
 * Nothing else in the codebase hardcodes the studio name, domain, email or
 * phone number. Swapping any of them is a one-file change.
 */

/**
 * Resolve the canonical origin, most-explicit first.
 *
 * Canonical tags, OG URLs, the sitemap and every JSON-LD @id are built from
 * this. Getting it wrong splits the entity across two hostnames, which is the
 * single most expensive SEO mistake available on a new domain — so the
 * production value comes from an env var you set deliberately, never inferred.
 */
export function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/**
 * Contact channels.
 *
 * `email` and `whatsapp` are intentionally empty until real ones are supplied.
 * Every CTA reads these and degrades to the project brief form when blank —
 * the site never renders a dead `mailto:` or a `wa.me` link to nowhere.
 */
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  /** Digits only, international format, no `+` or spaces. e.g. 212600000000 */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;

export const hasEmail = contact.email.length > 0;
export const hasWhatsApp = /^\d{8,15}$/.test(contact.whatsapp);

export const site = {
  name: "AUREN",
  /** Rendered with the registered mark in the wordmark only, never in copy. */
  legalName: "AUREN",
  tagline: "Digital experiences, creative, growth and intelligent systems",
  /**
   * The one-breath description. This exact sentence is reused verbatim as the
   * meta description, the OG description, the JSON-LD `description` and the
   * opening line of llms.txt — one canonical self-definition for both search
   * engines and generative retrievers to converge on.
   */
  description:
    "AUREN is a digital studio that builds the experience, the creative, the acquisition and the automation as one connected practice.",
  locale: "en",
  country: "MA",
  region: "Morocco",
} as const;

export const founder = {
  name: "Naoufal El Absi",
  role: "Founder and creative director",
  /**
   * Verified profile URLs only. These feed JSON-LD `sameAs`, which is how a
   * person becomes a resolvable entity rather than a string — the difference
   * between being quoted and being cited. Add real profiles; never invent one.
   */
  sameAs: [] as string[],
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Capabilities" },
  { href: "/studio", label: "Studio" },
  { href: "/insights", label: "Insights" },
] as const;
