import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ConceptsShowcase } from "@/components/sections/concepts-showcase";
import { ContactCta } from "@/components/sections/contact-cta";
import { concepts } from "@/content/concepts";
import { tr, asLocale } from "@/i18n/copy";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The concepts page exists as a route of its own for one reason: these are not
 * client work, and they should not be reachable only by scrolling the homepage
 * past the three projects that are. A visitor who arrives from a search for
 * "restaurant website" needs a URL that says "here is the restaurant one", and
 * the sitemap needs five anchors to hand over.
 */
export const metadata: Metadata = {
  title: "Concepts",
  description:
    "Five studio concepts — a restaurant, a fashion label, a furniture showroom, a car hire desk and a coffee shop. AUREN's own designs, with no client and no results.",
};

export default async function ConceptsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typed = asLocale(locale);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AUREN studio concepts",
    itemListElement: concepts.map((concept, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: concept.name,
      description: tr(typed, concept.promise),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <section className="pt-32 pb-12 md:pt-36">
        <div className="shell">
          <p className="eyebrow">Concepts</p>
          <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-display)] leading-[0.94]">
            Five businesses, and the site each one would get.
          </h1>
          <p className="lead mt-8 max-w-[58ch]">
            These are our own designs, written and built to show what a site of
            this kind does for a business like yours — the menu a guest reads,
            the table they book, the bag they pay from, the car they collect.
            There is no client behind any of them, no brief, no budget, no
            launch, and no results to report.
          </p>
        </div>
      </section>

      <ConceptsShowcase locale={typed} showHeading={false} />

      <ContactCta />
    </>
  );
}
