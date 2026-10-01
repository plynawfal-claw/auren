import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Bodoni_Moda, IBM_Plex_Sans_Arabic, Inter_Tight, JetBrains_Mono } from "next/font/google";

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { SpatialStage } from "@/components/motion/spatial-stage";
import { Atmosphere } from "@/components/motion/atmosphere";
import { MagneticButtons } from "@/components/motion/magnetic-buttons";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { BackToTop } from "@/components/motion/back-to-top";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { EntityGraph } from "@/components/seo/entity-graph";
import { Analytics } from "@/components/seo/analytics";
import { LocaleAlternates } from "@/components/seo/locale-alternates";
import { locales, localeHtmlLang, localeDir, type Locale } from "@/i18n/config";
import { routing } from "@/i18n/navigation";
import { site, siteUrl } from "@/config/site";
import { asLocale, c, tr } from "@/i18n/copy";
import { share } from "@/lib/share";
import "lenis/dist/lenis.css";
import "../globals.css";

/**
 * Bodoni Moda carries the display voice. Its thick-thin contrast only reads as
 * precision optics above about 64px, which is exactly the register this site
 * sets headlines at. `display: swap` plus explicit fallback metrics keeps the
 * swap from shifting layout.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

/** The UI's precise voice: labels, metadata, counters, form steps. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * Arabic, for Darija.
 *
 * The three Latin faces above have no Arabic glyphs, so on `/ar` the browser
 * would fall back per character and a single paragraph could come out set in
 * two different families. This is loaded once and swapped in for all three
 * custom properties when the document language is Arabic — see the
 * `html[lang^="ar"]` block in `globals.css`.
 *
 * Plex Sans Arabic rather than a Kufi or Naskh revival: Darija here is working
 * copy — prices, hours, an address, a button — and a text face designed for
 * interface strings holds up at 12px in a way a display Naskh does not.
 */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The site-wide defaults, per locale. The homepage takes these as its own
 * title and description, so French and Darija visitors — and the search
 * results that show them — read the site in their language. `og:url` and the
 * canonical come from `LocaleAlternates`, not from here.
 */
const TAGLINE = c(
  site.tagline,
  "Sites web, création, croissance et systèmes intelligents",
  "مواقع، إبداع، نمو وأنظمة ذكية",
);
const DESCRIPTION = c(
  site.description,
  "AUREN est un studio digital au Maroc qui crée le site, la marque, l’acquisition et l’automatisation comme un seul travail cohérent.",
  "AUREN ستوديو رقمي فالمغرب كيصاوب الموقع، الماركة، جلب الكليان والأتمتة كخدمة وحدة مترابطة.",
);
const OG_LOCALE: Record<Locale, string> = { en: "en_US", fr: "fr_MA", ar: "ar_MA" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const title = `${site.name} — ${tr(locale, TAGLINE)}`;
  const description = tr(locale, DESCRIPTION);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${site.name}` },
    description,
    applicationName: site.name,
    ...share("/og/home.png", title, description, { type: "website", locale: OG_LOCALE[locale] }),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport = {
  // Both palettes are dark-first; the browser chrome and the media query stay
  // in sync with whichever is active via the two themeColor entries.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06070A" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f6" },
  ],
  colorScheme: "dark light",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  setRequestLocale(locale);
  const typed = locale as Locale;

  return (
    <html
      lang={localeHtmlLang[typed]}
      data-scroll-behavior="smooth"
      // Arabic reads right-to-left. This was hardcoded to "ltr" while `ar` was
      // already a declared locale, so the Darija pages were marked as an
      // Arabic document and then laid out as an English one — which breaks
      // text direction, punctuation placement and the meaning of the CSS
      // logical properties the layout depends on.
      dir={localeDir[typed]}
      className={`${bodoni.variable} ${interTight.variable} ${jetbrains.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <body>
        <EntityGraph />
        <Analytics />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-mineral focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink"
        >
          Skip to content
        </a>
        <NextIntlClientProvider>
          <SmoothScrollProvider>
            {/* Inside the intl provider, not beside it: this uses
                `usePathname` from next-intl, which throws without the provider
                above it in the tree. It owns `canonical` + `hreflang` for every
                route, because a relative canonical in a page's `metadata`
                resolves against `metadataBase` and comes out English on every
                locale. */}
            <LocaleAlternates locale={typed} />
            <SpatialStage />
            <Atmosphere />
            <ScrollProgress />
            <MagneticButtons />
            <SiteHeader locale={typed} />
            <main id="main">{children}</main>
            <SiteFooter locale={typed} />
            <BackToTop />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
