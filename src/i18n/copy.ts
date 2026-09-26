/**
 * Copy, in three languages.
 *
 * The site ships English, French and Moroccan Darija. Darija is written in
 * Arabic script and is deliberately *not* Modern Standard Arabic: it is the
 * language a shopkeeper in Casablanca, a café owner in Agadir or a garage in
 * Fès actually reads in a message from AUREN. That means everyday Moroccan
 * phrasing — the verb forms, the borrowed French, the plain vocabulary — and
 * it means never translating a sentence literally and hoping it lands.
 *
 * Why a typed object per string instead of JSON message catalogues: the copy
 * lives next to the content it describes, so a project entry carries its
 * French tagline and its Darija case study in the same place as its images.
 * Adding a language is one more key on the type, and the compiler names every
 * string that is missing it. With loose JSON, a missing key renders as a raw
 * key in production and nothing complains.
 */
import { defaultLocale, type Locale } from "./config";

/** One string, written three times. */
export type Copy = { en: string; fr: string; ar: string };

/**
 * The only way to build a `Copy`. Reading three arguments side by side is
 * what keeps a translation honest — you can see at the call site whether the
 * French and the Darija are actually the same sentence.
 */
export function c(en: string, fr: string, ar: string): Copy {
  return { en, fr, ar };
}

export type CopyList = readonly Copy[];

/**
 * Resolves a string for a locale. Unknown and missing locales fall back to
 * English rather than rendering an empty gap — a missing translation is a
 * lesser failure than a blank page.
 */
export function tr(locale: string | undefined, value: Copy): string {
  if (!locale) return value[defaultLocale];
  const key = locale as Locale;
  return value[key] ?? value[defaultLocale];
}

/** Same, for a list. */
export function trList(locale: string | undefined, values: CopyList | undefined): string[] {
  return (values ?? []).map((v) => tr(locale, v));
}

/** Reads a locale off a params object without importing `next/navigation`. */
export function asLocale(value: string | undefined): Locale {
  return value === "fr" || value === "ar" ? value : defaultLocale;
}
