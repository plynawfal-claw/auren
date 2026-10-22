import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactCta } from "@/components/sections/contact-cta";
import { guides } from "@/content/guides";
import { siteUrl } from "@/config/site";
import { share } from "@/lib/share";

/**
 * The French guides index. French-only (see `i18n/translated`): any other
 * locale is a 404 rather than an English page under a French prefix.
 */
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

const TITLE = "Guides : sites internet, e-commerce, SEO et publicité au Maroc";
const DESCRIPTION =
  "Des guides pratiques pour les entreprises au Maroc : prix publiés, délais, critères de choix et questions à poser, avec leurs sources.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...share("/og/insights.png", TITLE, DESCRIPTION, { type: "website", locale: "fr_MA" }),
};

export default async function GuidesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/fr/guides#page`,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "fr-MA",
    isPartOf: { "@id": `${siteUrl}/#website` },
    hasPart: guides.map((g) => ({ "@type": "Article", headline: g.title, url: `${siteUrl}/fr/guides/${g.slug}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-36 pb-12">
        <div className="shell">
          <p className="eyebrow">Guides</p>
          <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-display)]">Guides pour les entreprises au Maroc</h1>
          <p className="lead mt-7 max-w-[62ch]">
            Des réponses directes aux questions qu’on nous pose le plus : combien ça coûte, combien de temps ça prend, et comment choisir. Chaque chiffre est sourcé.
          </p>
        </div>
      </section>
      <section className="shell pb-20">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug} className="bg-ink">
              <Link href={`/guides/${g.slug}`} className="group block h-full p-7 transition-colors hover:bg-graphite">
                <h2 className="font-display text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight text-mineral">{g.title}</h2>
                <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-grey">{g.description}</p>
                <span aria-hidden="true" className="mt-5 inline-block text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ContactCta locale={locale} />
    </>
  );
}
