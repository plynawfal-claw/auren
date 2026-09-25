import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    // French falls back to the English catalogue until `fr.json` exists, so an
    // early `/fr` visit renders readable English rather than raw message keys.
    messages: (
      await import(`../../messages/${locale}.json`).catch(
        () => import(`../../messages/${defaultLocale}.json`),
      )
    ).default,
  };
});
