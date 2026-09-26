import { z } from "zod";
import { c, type Copy } from "@/i18n/copy";

/**
 * Shared contract between the form and the endpoint.
 *
 * Validated on the server regardless of what the client did — the browser is
 * not a trusted validator, it is a convenience layer over one.
 *
 * The option sets below carry their own copy in all three languages, so the
 * questionnaire renders in the visitor's language and the WhatsApp handoff is
 * written in it too. The *values* submitted are stable English ids, so the
 * inbox record is language-independent no matter which locale the lead used.
 */

export const STAGE_OPTIONS = ["lancer", "accelerer", "cap"] as const;
export type Stage = (typeof STAGE_OPTIONS)[number];

export const CREATE_OPTIONS = [
  "vitrine",
  "landing",
  "ecommerce",
  "restaurant",
  "app",
  "refonte",
  "automation",
  "unsure",
] as const;
export type Create = (typeof CREATE_OPTIONS)[number];

export const OBJECTIVE_OPTIONS = [
  "present",
  "leads",
  "sell",
  "bookings",
  "launch",
  "modernise",
  "automate",
  "other",
] as const;
export type Objective = (typeof OBJECTIVE_OPTIONS)[number];

export const PRESENCE_OPTIONS = ["site", "social", "both", "none"] as const;
export type Presence = (typeof PRESENCE_OPTIONS)[number];

export const TIMELINE_OPTIONS = ["asap", "2-4w", "1-2m", "2-3m", "flexible"] as const;
export type Timeline = (typeof TIMELINE_OPTIONS)[number];

/**
 * Display labels + WhatsApp wording, per option, per locale. Written as
 * natural Moroccan French and Darija — never a literal translation.
 */
export const STAGE_COPY: Record<Stage, { label: Copy; sub: Copy; support: Copy }> = {
  lancer: {
    label: c("I'm starting out", "Je me lance", "غادي نبدا"),
    sub: c(
      "I have an idea, an activity or a new project, and I want to start on solid ground.",
      "J’ai une idée, une activité ou un nouveau projet et je veux partir sur de bonnes bases.",
      "عندي شي فكرة ولا شي مشروع جديد، وبغيت نبدا على أساس مزيان.",
    ),
    support: c(
      "Identity, digital presence, site and launch.",
      "Identité, présence digitale, site et lancement.",
      "الهوية، الحضور الرقمي، الموقع والإطلاق.",
    ),
  },
  accelerer: {
    label: c("I want more clients", "Je veux accélérer", "بغيت نكبر"),
    sub: c(
      "My business already works. I want a more professional presence and to turn more visitors into clients.",
      "Mon activité fonctionne déjà. Je veux une présence plus professionnelle et transformer davantage de visiteurs en clients.",
      "الخدمة ديالي خدامة. بغيت حضور أكثر احترافية ونحوّل الناس لي كيدخلو لزبائن.",
    ),
    support: c(
      "Image, conversion, acquisition and growth.",
      "Image, conversion, acquisition et croissance.",
      "الصورة، التحويل، جلب الزبائن والنمو.",
    ),
  },
  cap: {
    label: c("I want to level up", "Je veux passer un cap", "بغيت نوصل لمستوى آخر"),
    sub: c(
      "My business is established. I'm looking for better solutions to save time, structure growth and build for the long term.",
      "Mon activité est établie. Je cherche de meilleures solutions pour gagner du temps, structurer ma croissance et construire sur le long terme.",
      "النشاط ديالي مؤسس. كنقلب على حلول أحسن باش نربح الوقت، ننظم النمو ونبني على المدى الطويل.",
    ),
    support: c(
      "Strategy, automation, systems and durable growth.",
      "Stratégie, automatisation, systèmes et croissance durable.",
      "الاستراتيجية، الأتمتة، الأنظمة والنمو المستدام.",
    ),
  },
};

export const CREATE_COPY: Record<Create, Copy> = {
  vitrine: c("Showcase site", "Site vitrine", "موقع تعريفي"),
  landing: c("Landing page", "Landing page", "صفحة هبوط"),
  ecommerce: c("E-commerce", "E-commerce", "متجر إلكتروني"),
  restaurant: c("Restaurant / booking", "Restaurant / réservation", "مطعم / حجز"),
  app: c("App / platform", "Application / plateforme", "تطبيق / منصة"),
  refonte: c("Redesign of an existing site", "Refonte d’un site existant", "إعادة تصميم موقع موجود"),
  automation: c("Automation / AI", "Automatisation / IA", "أتمتة / ذكاء اصطناعي"),
  unsure: c("I don't know yet", "Je ne sais pas encore", "مازال ما عرفتش"),
};

export const OBJECTIVE_COPY: Record<Objective, Copy> = {
  present: c("Present my business", "Présenter mon entreprise", "نقدّم النشاط ديالي"),
  leads: c("Get more enquiries", "Recevoir plus de demandes", "نوصلو لي طلبات أكثر"),
  sell: c("Sell online", "Vendre en ligne", "نبيع أونلاين"),
  bookings: c("Take bookings", "Prendre des réservations", "ناخد الحجوزات"),
  launch: c("Launch a new brand / offer", "Lancer une nouvelle marque / offre", "نطلق علامة / عرض جديد"),
  modernise: c("Modernise my image", "Moderniser mon image", "نجدد الصورة ديالي"),
  automate: c("Automate part of my activity", "Automatiser une partie de mon activité", "نأتمت شي جزء من النشاط"),
  other: c("Something else", "Autre", "شي حاجة أخرى"),
};

export const PRESENCE_COPY: Record<Presence, Copy> = {
  site: c("Yes, a website", "Oui, un site", "إيه، عندي موقع"),
  social: c("Instagram / social networks", "Instagram / réseaux sociaux", "إنستغرام / الشبكات الاجتماعية"),
  both: c("Both", "Les deux", "بجوج"),
  none: c("No, starting from zero", "Non, on part de zéro", "لا، كنبداو من الصفر"),
};

export const TIMELINE_COPY: Record<Timeline, Copy> = {
  asap: c("As soon as possible", "Le plus vite possible", "فأقرب وقت"),
  "2-4w": c("2–4 weeks", "2–4 semaines", "2–4 سيمانات"),
  "1-2m": c("1–2 months", "1–2 mois", "شهر لجوج شهور"),
  "2-3m": c("2–3 months", "2–3 mois", "جوج لثلاثة شهور"),
  flexible: c("I'm flexible", "Je suis flexible", "عندي مرونة"),
};

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
  stage: z.enum(STAGE_OPTIONS),
  create: z.array(z.enum(CREATE_OPTIONS)).min(1, "Choose at least one."),
  objective: z.enum(OBJECTIVE_OPTIONS),
  presence: z.enum(PRESENCE_OPTIONS),
  /** Optional URL or @handle when the visitor already has something online. */
  presenceLink: z.string().trim().max(300).optional(),
  timeline: z.enum(TIMELINE_OPTIONS),
  project: z.string().trim().min(10, "A sentence or two is enough.").max(4000),
  name: z.string().trim().min(2, "Required.").max(200),
  company: z.string().trim().max(200).optional(),
  city: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(6, "A WhatsApp number helps us reply.").max(60),
  email: z.email("Use a valid email address.").max(320).optional().or(z.literal("")),
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
