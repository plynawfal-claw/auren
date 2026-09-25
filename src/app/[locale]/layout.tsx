import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Bodoni_Moda, Inter_Tight, JetBrains_Mono } from "next/font/google";

import { MotionProvider } from "@/components/motion/providers";
import { MagneticButtons } from "@/components/motion/magnetic-buttons";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { EntityGraph } from "@/components/seo/entity-graph";
import { Analytics } from "@/components/seo/analytics";
import { locales, localeHtmlLang, type Locale } from "@/i18n/config";
import { routing } from "@/i18n/navigation";
import { site, siteUrl } from "@/config/site";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: siteUrl,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: "#06070A",
  colorScheme: "dark",
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
      dir="ltr"
      className={`${bodoni.variable} ${interTight.variable} ${jetbrains.variable}`}
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
          <MotionProvider>
            <ScrollProgress />
            <MagneticButtons />
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
