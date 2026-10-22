/**
 * Deployment-facing defaults for identity and contact.
 *
 * `config/site.ts` reads real values from the environment first and falls
 * back to these placeholders, so a fresh deploy is never broken — it is
 * simply pointing at the studio's own channels. Replace a placeholder here
 * the moment a real one exists; never leave a channel pointing at a value
 * nobody reads.
 */
export const siteConfig = {
  name: "AUREN",
  /** Canonical production domain (no scheme, no trailing slash). */
  domain: "aurren.app",
  url: "https://aurren.app",
  /** Primary contact channel. */
  email: "hello@aurren.app",
  /** WhatsApp: digits only, international format, no `+` or spaces. */
  whatsapp: "212699643511",
  /** Human-readable form used in copy, never in links. */
  whatsappDisplay: "+212 699 643511",
  /**
   * Official profiles, for `sameAs` in the entity graph. Add each one the day
   * it exists — Google Business Profile, LinkedIn, Instagram, Sortlist — with
   * the identical name "AUREN" and a link back to aurren.app. Empty until then:
   * a sameAs to a profile that does not exist is worse than none.
   */
  sameAs: [] as readonly string[],
} as const;
