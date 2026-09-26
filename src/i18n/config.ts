/** The three shipped reading experiences. Darija is written in Arabic script. */
export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const enabledLocales: readonly Locale[] = locales;

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  fr: "fr-MA",
  ar: "ar-MA",
};

export const localeLabel: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "دارجة",
};

export const localeShortLabel: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

