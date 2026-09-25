/**
 * What AUREN builds.
 *
 * Four practices, named in plain language. There is no colour, no wavelength
 * and no index here on purpose: the previous system encoded the disciplines as
 * spectral emission lines, which was legible as a concept and illegible as a
 * navigation aid. A visitor should know what the studio does without decoding
 * anything.
 *
 * Order is editorial — the sequence a project actually moves through — not a
 * ranking, so nothing numbers these in the UI.
 */

export type PracticeId = "experiences" | "creative" | "growth" | "systems";

export type Practice = {
  id: PracticeId;
  label: string;
  /** Short line under the heading. The four together read as one sentence. */
  summary: string;
  /** Self-contained definition. Written to be quotable on its own. */
  definition: string;
  disciplines: string[];
  serviceSlugs: string[];
};

export const practices: readonly Practice[] = [
  {
    id: "experiences",
    label: "Digital experiences",
    summary: "Websites, commerce, products, applications",
    definition:
      "Websites, storefronts, landing pages and applications, engineered for speed and built to convert.",
    disciplines: [
      "Websites",
      "E-commerce",
      "Landing pages",
      "Web and mobile applications",
      "Product, UI and UX design",
      "Conversion engineering",
    ],
    serviceSlugs: ["web-design-development", "apps-digital-products"],
  },
  {
    id: "creative",
    label: "Creative systems",
    summary: "Brand, campaign, performance creative, motion",
    definition:
      "Brand systems and the campaign work that carries them — identity, art direction, motion and performance creative.",
    disciplines: [
      "Brand identity",
      "E-commerce branding",
      "Performance creative",
      "Art direction",
      "Motion and film",
      "Campaign creative",
    ],
    serviceSlugs: ["creative-branding"],
  },
  {
    id: "growth",
    label: "Growth",
    summary: "Search, paid acquisition, CRO, analytics",
    definition:
      "The acquisition layer — search visibility, paid media, funnels and the measurement that tells you which of them worked.",
    disciplines: [
      "SEO",
      "Generative search visibility",
      "Google Ads",
      "Meta Ads",
      "Conversion rate optimisation",
      "Analytics and attribution",
    ],
    serviceSlugs: ["seo", "google-ads", "meta-ads"],
  },
  {
    id: "systems",
    label: "Intelligent systems",
    summary: "AI automation, CRM, agents, workflows",
    definition:
      "What happens after the lead arrives — CRM, routing, automation and the internal tools that keep a business running without adding headcount.",
    disciplines: [
      "CRM implementation",
      "AI automation",
      "Lead routing",
      "WhatsApp workflows",
      "AI agents",
      "Internal tools and dashboards",
    ],
    serviceSlugs: ["ai-automation-crm"],
  },
] as const;

export const practiceById = Object.fromEntries(
  practices.map((p) => [p.id, p]),
) as Record<PracticeId, Practice>;

/** Short labels for the metadata line on a case study. */
export const practiceTag: Record<PracticeId, string> = {
  experiences: "Digital Product",
  creative: "Creative Direction",
  growth: "Growth",
  systems: "Intelligent Systems",
};
