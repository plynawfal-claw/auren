import { z } from "zod";

/**
 * Shared contract between the form and the endpoint.
 *
 * Validated on the server regardless of what the client did — the browser is
 * not a trusted validator, it is a convenience layer over one.
 */
export const SERVICE_OPTIONS = [
  "Website / E-commerce",
  "App / Product",
  "Brand / Creative",
  "SEO",
  "Google Ads",
  "Meta Ads",
  "AI Automation / CRM",
  "Multiple / Full growth system",
] as const;

export const BUDGET_OPTIONS = [
  "Under 25k MAD",
  "25–60k MAD",
  "60–150k MAD",
  "150k+ MAD",
  "Not sure yet",
] as const;

export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Planning ahead",
] as const;

export const attributionSchema = z.object({
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  landingPage: z.string().max(2000).optional(),
  referrer: z.string().max(2000).optional(),
  firstSeen: z.string().max(40).optional(),
});

export const briefSchema = z.object({
  services: z.array(z.enum(SERVICE_OPTIONS)).min(1, "Choose at least one."),
  project: z.string().trim().min(10, "A sentence or two is enough.").max(4000),
  budget: z.enum(BUDGET_OPTIONS),
  timeline: z.enum(TIMELINE_OPTIONS),
  name: z.string().trim().min(2, "Required.").max(200),
  company: z.string().trim().max(200).optional(),
  email: z.email("Use a valid email address.").max(320),
  phone: z.string().trim().max(60).optional(),
  detail: z.string().trim().max(8000).optional(),
  attribution: attributionSchema.optional(),

  /**
   * Honeypot. Must stay empty, but it is NOT constrained here on purpose.
   *
   * Validating it to max(0) makes zod reject the submission with an error
   * naming this exact field, which tells a bot precisely which input to leave
   * alone next time. The check belongs in the handler, where a filled trap can
   * be answered with a perfectly ordinary success response.
   */
  website: z.string().max(500).optional(),
  /** Milliseconds between form mount and submit. */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type BriefInput = z.infer<typeof briefSchema>;
