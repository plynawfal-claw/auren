/**
 * Single source of truth for identity, URLs and contact.
 *
 * Nothing else in the codebase hardcodes the studio name, domain, email or
 * phone number. Swapping any of them is a one-file change.
 */
import { siteConfig } from "./siteConfig";

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

  return siteConfig.url;
}

export const siteUrl = resolveSiteUrl();

/**
 * Contact channels.
 *
 * The environment supplies real values when set; `siteConfig` supplies the
 * studio's own placeholders otherwise, so every deploy has a live channel
 * rather than a dead link or a blank state.
 */
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || siteConfig.email,
  /** Digits only, international format, no `+` or spaces. e.g. 212600000000 */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsapp,
  /** Human-readable form used in copy, never in links. */
  whatsappDisplay: siteConfig.whatsappDisplay,
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
    "AUREN is a digital studio based in Tangier, Morocco, that builds the experience, the creative, the acquisition and the automation as one connected practice.",
  locale: "en",
  country: "MA",
  region: "Morocco",
  /** Where the studio is based. A service-area business: no public street
   *  address is published, so nothing anywhere states one. */
  city: "Tangier",
  cityFr: "Tanger",
  /** Administrative region, as Google and schema.org expect it. */
  adminRegion: "Tanger-Tétouan-Al Hoceïma",
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Capabilities" },
  { href: "/studio", label: "Studio" },
  { href: "/insights", label: "Insights" },
] as const;
