/**
 * Locale registry.
 *
 * English ships fully written; French is wired but unpopulated. Adding it is a
 * content task — drop `fr.json` beside `en.json` and flip `enabled` — not a
 * refactor, and no English URL changes when it lands.
 */
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Locales with a complete message catalogue. Drives sitemap + hreflang. */
export const enabledLocales: readonly Locale[] = ["en"];

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  fr: "fr-MA",
};

export const localeLabel: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};
