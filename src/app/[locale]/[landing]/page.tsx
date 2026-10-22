import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { landingBySlug, landings } from "@/content/landings";
import { serviceBySlug } from "@/content/services";
import { localizeService } from "@/content/services.i18n";
import { projectBySlug } from "@/content/projects";
import { contact, siteUrl } from "@/config/site";
import { asLocale } from "@/i18n/copy";
import { localeUrl } from "@/i18n/translated";
import { share } from "@/lib/share";

/**
 * French search pages (`content/landings.ts`).
 *
 * Same visual grammar as a capability page — definitional opening, three
 * takeaways, question-led sections, FAQ — so they read as part of the site,
 * not as bolted-on SEO pages. Each one is generated only for the locales it is
 * written in; any other locale, and any unknown slug, is a 404 (`find`).
 *
 * Not `dynamicParams = false`: on Cloudflare (OpenNext, no incremental cache)
 * pages are rendered by the Worker on request, and with fallback disabled the
 * router throws NoFallbackError for paths it did prerender. `notFound()` from
 * `find` gives the same 404 for anything that is not a real page.
 */

export function generateStaticParams() {
  return landings.flatMap((l) => l.locales.map((locale) => ({ locale, landing: l.slug })));
}

type Params = Promise<{ locale: string; landing: string }>;

function find(locale: string, slug: string) {
  const page = landingBySlug[slug];
  return page && page.locales.includes(asLocale(locale)) ? page : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, landing } = await params;
  const page = find(locale, landing);
  if (!page) return {};
  const image = page.kind === "service" ? "/og/services.png" : "/og/home.png";
  return {
    title: page.metaTitle,
    description: page.description,
    ...share(image, page.metaTitle, page.description, { type: "website", locale: "fr_MA" }),
  };
}

const UPDATED = new Intl.DateTimeFormat("fr-MA", { day: "numeric", month: "long", year: "numeric" });

export default async function LandingPage({ params }: { params: Params }) {
  const { locale, landing } = await params;
  setRequestLocale(locale);
  const page = find(locale, landing);
  if (!page) notFound();

  const lang = asLocale(locale);
  const url = (path: string) => localeUrl(siteUrl, lang, path);
  const self = url(`/${page.slug}`);
  const services = page.services.map((s) => serviceBySlug[s]).filter(Boolean).map((s) => localizeService(s, locale));
  const projects = page.projects.map((s) => projectBySlug[s]).filter(Boolean);
  const related = page.related.map((s) => landingBySlug[s]).filter(Boolean);

  const subject =
    page.kind === "service"
      ? {
          "@type": "Service",
          "@id": `${self}#service`,
          name: page.h1,
          serviceType: page.serviceType ?? page.h1,
          description: page.answer,
          url: self,
          inLanguage: "fr-MA",
          provider: { "@id": `${siteUrl}/#service` },
          areaServed: { "@type": "Country", name: "Maroc" },
        }
      : {
          "@type": "WebPage",
          "@id": `${self}#webpage`,
          name: page.h1,
          description: page.answer,
          url: self,
          inLanguage: "fr-MA",
          isPartOf: { "@id": `${siteUrl}/#website` },
          about: { "@id": `${siteUrl}/#service` },
          dateModified: page.updated,
          ...(page.areas
            ? { spatialCoverage: page.areas.map((name) => ({ "@type": "City", name })) }
            : {}),
        };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      subject,
      {
        "@type": "FAQPage",
        "@id": `${self}#faq`,
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: url("/") },
          { "@type": "ListItem", position: 2, name: page.h1, item: self },
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
            <span className="text-silver">{page.eyebrow}</span>
          </nav>

          <h1 className="mt-8 max-w-[18ch] text-[length:var(--text-display)]">{page.h1}</h1>

          {/* The answer to the search, on its own — the sentence most likely
              to be quoted by a search engine or an assistant. */}
          <p className="lead mt-7 max-w-[62ch]">{page.answer}</p>

          <p className="mt-6 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-grey">
            Mis à jour le <time dateTime={page.updated}>{UPDATED.format(new Date(page.updated))}</time>
          </p>
        </div>
      </header>

      <section className="shell mt-16" aria-labelledby="essentiel">
        <h2 id="essentiel" className="eyebrow">L’essentiel</h2>
        <ul className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
          {page.takeaways.map((t, i) => (
            <li key={i} className="spatial-object bg-ink p-7">
              <span className="font-mono text-[0.66rem] tracking-[0.16em] text-grey">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-sm leading-relaxed text-silver">{t}</p>
            </li>
          ))}
        </ul>
      </section>

      {page.sections.map((sec) => (
        <section key={sec.heading} className="shell py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">{sec.heading}</h2>
            </div>
            <div className="space-y-6 md:col-span-8">
              {sec.body.map((para, i) => (
                <p key={i} className="max-w-[62ch] leading-relaxed text-silver">{para}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {page.areas && (
        <section className="shell border-t border-line py-16" aria-labelledby="villes">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="villes" className="eyebrow">Villes où nous intervenons</h2>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-grey">
                Rendez-vous en personne depuis Tanger, suivi à distance entre deux visites.
              </p>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2 md:col-span-8">
              {page.areas.map((city) => (
                <li key={city} className="border-t border-line py-3 text-sm text-silver">{city}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="shell border-t border-line py-16" aria-labelledby="expertises">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="expertises" className="eyebrow">Nos expertises</h2>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2 md:col-span-8">
              {services.map((s) => (
                <li key={s.slug} className="border-t border-line">
                  <Link href={`/services/${s.slug}`} className="group flex items-baseline justify-between gap-4 py-3 text-sm text-silver transition-colors hover:text-mineral">
                    {s.title}
                    <span aria-hidden="true" className="text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="shell border-t border-line py-16" aria-labelledby="questions">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="questions" className="eyebrow">Questions fréquentes</h2>
          </div>
          <dl className="md:col-span-8">
            {page.faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 60} className="border-t border-line py-7">
                <dt className="font-sans text-lg font-medium text-mineral">{f.q}</dt>
                <dd className="mt-3 max-w-[62ch] leading-relaxed text-grey">{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="shell border-t border-line py-16">
          <h2 className="eyebrow">Réalisations</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="group flex items-center gap-4 border border-line px-6 py-5 transition-colors hover:border-line-strong">
                  <span className="font-display text-xl">{p.title}</span>
                  <span className="text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="shell border-t border-line py-16" aria-labelledby="voir-aussi">
          <h2 id="voir-aussi" className="eyebrow">Voir aussi</h2>
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug} className="border-t border-line">
                <Link href={`/${r.slug}`} className="block py-4 text-silver transition-colors hover:text-mineral">
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="shell border-t border-line py-12">
        <p className="max-w-[62ch] text-sm leading-relaxed text-grey">
          AUREN · Tanger, Maroc · WhatsApp <span className="text-silver">{contact.whatsappDisplay}</span> ·{" "}
          <span className="text-silver">{contact.email}</span>
        </p>
      </section>

      <ContactCta locale={locale} />
    </article>
  );
}
