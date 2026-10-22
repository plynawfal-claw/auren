import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { guideBySlug, guides, type Cite } from "@/content/guides";
import { landingBySlug } from "@/content/landings";
import { serviceBySlug } from "@/content/services";
import { localizeService } from "@/content/services.i18n";
import { siteUrl } from "@/config/site";
import { share } from "@/lib/share";

/**
 * One guide (`content/guides.ts`). French-only; any other locale or unknown
 * slug is a 404 via `notFound()` — not `dynamicParams = false`, which makes
 * the OpenNext Worker throw NoFallbackError for pages it did prerender.
 *
 * Every figure on the page sits next to its source. External sources open in
 * a new tab; case studies are internal links.
 */
export function generateStaticParams() {
  return guides.map((g) => ({ locale: "fr", slug: g.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

function find(locale: string, slug: string) {
  return locale === "fr" ? guideBySlug[slug] : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = find(locale, slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.description,
    ...share("/og/insights.png", guide.metaTitle, guide.description, {
      type: "article",
      locale: "fr_MA",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    }),
  };
}

const DATE = new Intl.DateTimeFormat("fr-MA", { day: "numeric", month: "long", year: "numeric" });

function Source({ cite }: { cite: Cite }) {
  return cite.url.startsWith("/") ? (
    <Link href={cite.url} className="underline decoration-line-strong underline-offset-4 hover:text-mineral">
      {cite.label}
    </Link>
  ) : (
    <a href={cite.url} target="_blank" rel="noopener" className="underline decoration-line-strong underline-offset-4 hover:text-mineral">
      {cite.label}
    </a>
  );
}

function Sources({ cites }: { cites: Cite[] }) {
  if (cites.length === 0) return null;
  return (
    <p className="text-xs leading-relaxed text-grey">
      {cites.length > 1 ? "Sources : " : "Source : "}
      {cites.map((c, i) => (
        <span key={c.url}>
          {i > 0 && " · "}
          <Source cite={c} />
        </span>
      ))}
    </p>
  );
}

export default async function GuidePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const guide = find(locale, slug);
  if (!guide) notFound();
  setRequestLocale(locale);

  const self = `${siteUrl}/fr/guides/${guide.slug}`;
  const service = serviceBySlug[guide.service] ? localizeService(serviceBySlug[guide.service], locale) : undefined;
  const landing = guide.landing ? landingBySlug[guide.landing] : undefined;
  // The next three guides in order, wrapping — so every guide is linked from
  // three others, not just the first three from all of them.
  const at = guides.findIndex((g) => g.slug === guide.slug);
  const others = [1, 2, 3].map((n) => guides[(at + n) % guides.length]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${self}#article`,
        headline: guide.title,
        description: guide.description,
        inLanguage: "fr-MA",
        url: self,
        mainEntityOfPage: self,
        datePublished: guide.published,
        dateModified: guide.updated,
        image: `${siteUrl}/og/insights.png`,
        author: { "@type": "Organization", name: "Équipe AUREN", url: siteUrl },
        publisher: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${siteUrl}/#website` },
        citation: [...new Set(guide.sections.flatMap((s) => s.cite).filter((c) => !c.url.startsWith("/")).map((c) => c.url))],
      },
      {
        "@type": "FAQPage",
        "@id": `${self}#faq`,
        mainEntity: guide.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/fr` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${siteUrl}/fr/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: self },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="pt-36">
        <div className="shell">
          <nav aria-label="Fil d’Ariane" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-grey">
            <Link href="/" className="hover:text-mineral">Accueil</Link>
            <span aria-hidden="true" className="px-2 text-grey-deep">/</span>
            <Link href="/guides" className="hover:text-mineral">Guides</Link>
          </nav>
          <h1 className="mt-8 max-w-[22ch] text-[length:var(--text-display)]">{guide.title}</h1>
          <p className="mt-6 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-grey">
            Par l’équipe AUREN · Mis à jour le <time dateTime={guide.updated}>{DATE.format(new Date(guide.updated))}</time>
          </p>
          {/* The answer, on its own: the paragraph most likely to be quoted. */}
          <p className="lead mt-8 max-w-[62ch]">{guide.answer}</p>
        </div>
      </header>

      {guide.sections.map((sec) => (
        <section key={sec.q} className="shell py-14">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">{sec.q}</h2>
            </div>
            <div className="space-y-5 md:col-span-8">
              {sec.body.map((para, i) => (
                <p key={i} className="max-w-[62ch] leading-relaxed text-silver">{para}</p>
              ))}
              <Sources cites={sec.cite} />
            </div>
          </div>
        </section>
      ))}

      <section className="shell border-t border-line py-14" aria-labelledby="comparatif">
        <h2 id="comparatif" className="eyebrow">Comparatif</h2>
        {/* The caption is shown outside the scroll box so a narrow screen never
            clips it; the table keeps a real <caption> for screen readers. */}
        <p aria-hidden="true" className="mt-6 max-w-[62ch] text-silver">{guide.table.caption}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <caption className="sr-only">{guide.table.caption}</caption>
            <thead>
              <tr>
                {guide.table.head.map((h) => (
                  <th key={h} scope="col" className="border-b border-line-strong py-3 pe-6 font-mono text-[0.66rem] font-normal uppercase tracking-[0.14em] text-grey">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.table.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, i) => (
                    <td key={i} className={i === 0 ? "border-b border-line py-3 pe-6 text-mineral" : "border-b border-line py-3 pe-6 text-silver"}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {guide.table.cite && <div className="mt-4"><Sources cites={guide.table.cite} /></div>}
      </section>

      <section className="shell py-14">
        <figure className="max-w-[46ch] border-s border-lume/50 ps-7">
          <blockquote className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug text-mineral">« {guide.quote.text} »</blockquote>
          <figcaption className="mt-5 text-sm text-grey">
            — {guide.quote.who}
            {guide.quote.note && guide.quote.note !== guide.quote.who && <span>, {guide.quote.note}</span>}
            {guide.quote.cite && (
              <>
                {" · "}
                <Source cite={guide.quote.cite} />
              </>
            )}
          </figcaption>
        </figure>
      </section>

      <section className="shell border-t border-line py-14" aria-labelledby="faq">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="faq" className="eyebrow">Questions fréquentes</h2>
          </div>
          <dl className="md:col-span-8">
            {guide.faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 60} className="border-t border-line py-7">
                <dt className="font-sans text-lg font-medium text-mineral">{f.q}</dt>
                <dd className="mt-3 max-w-[62ch] leading-relaxed text-grey">{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell border-t border-line py-14" aria-labelledby="pour-aller-plus-loin">
        <h2 id="pour-aller-plus-loin" className="eyebrow">Pour aller plus loin</h2>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {service && (
            <li className="border-t border-line">
              <Link href={`/services/${service.slug}`} className="block py-4 text-silver transition-colors hover:text-mineral">{service.title} →</Link>
            </li>
          )}
          {landing && (
            <li className="border-t border-line">
              <Link href={`/${landing.slug}`} className="block py-4 text-silver transition-colors hover:text-mineral">{landing.h1} →</Link>
            </li>
          )}
          {others.map((g) => (
            <li key={g.slug} className="border-t border-line">
              <Link href={`/guides/${g.slug}`} className="block py-4 text-silver transition-colors hover:text-mineral">{g.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta locale={locale} />
    </article>
  );
}
