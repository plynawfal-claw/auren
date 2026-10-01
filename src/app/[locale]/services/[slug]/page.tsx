import type { Metadata } from "next";
import { share } from "@/lib/share";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { practiceById } from "@/content/practices";
import { serviceBySlug, services } from "@/content/services";
import { projectBySlug } from "@/content/projects";
import { routing } from "@/i18n/navigation";
import { siteUrl } from "@/config/site";
import { localizePractice, localizeService } from "@/content/services.i18n";
import { asLocale, c, tr } from "@/i18n/copy";
import { localeUrl } from "@/i18n/translated";

const LABELS = {
  back: c("← Capabilities", "← Expertises", "→ الخدمات"),
  home: c("Home", "Accueil", "الرئيسية"),
  capabilities: c("Capabilities", "Expertises", "الخدمات"),
  keyPoints: c("Key points", "L’essentiel", "الأهم"),
  deliverables: c("What you get", "Ce que vous recevez", "شنو كتاخد"),
  questions: c("Questions", "Questions fréquentes", "أسئلة"),
  evidence: c("Evidence", "Réalisations", "خدمات منجزة"),
  catalog: c("deliverables", "livrables", "الخدمات"),
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const base = serviceBySlug[slug];
  if (!base) return {};
  const service = localizeService(base, locale);

  return {
    title: service.metaTitle,
    description: service.definition,
    ...share(`/og/services/${service.slug}.png`, service.metaTitle, service.definition, { type: "article" }),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const base = serviceBySlug[slug];
  if (!base) notFound();
  const service = localizeService(base, locale);
  const lang = asLocale(locale);
  const url = (path: string) => localeUrl(siteUrl, lang, path);
  const practice = localizePractice(practiceById[service.discipline], locale);
  const related = service.projects
    .map((s) => projectBySlug[s])
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url(`/services/${service.slug}`)}#service`,
        url: url(`/services/${service.slug}`),
        inLanguage: lang,
        name: service.title,
        description: service.definition,
        serviceType: service.title,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: [
          { "@type": "Country", name: "Morocco" },
          { "@type": "Place", name: "Worldwide" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.title} — ${tr(locale, LABELS.catalog)}`,
          itemListElement: service.deliverables.map((d) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: d },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url(`/services/${service.slug}`)}#faq`,
        mainEntity: service.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tr(locale, LABELS.home), item: url("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: tr(locale, LABELS.capabilities),
            item: url("/services"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: url(`/services/${service.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="pt-36">
        <div className="shell">
          <Link
            href="/services"
            className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-grey hover:text-mineral"
          >
            {tr(locale, LABELS.back)}
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="font-mono text-[0.68rem] tracking-[0.16em] text-grey">
              {practice.label}
            </span>
          </div>

          <h1 className="mt-6 max-w-[18ch] text-[length:var(--text-display)]">
            {service.title}
          </h1>

          {/* The definitional sentence, given its own space. This is the line
              a retrieval system is most likely to lift verbatim, so it is
              written to stand completely alone. */}
          <p className="lead mt-7 max-w-[62ch]">{service.definition}</p>
        </div>
      </header>

      {/* Extractable summary — short, specific, liftable. */}
      <section className="shell mt-16" aria-labelledby="takeaways">
        <h2 id="takeaways" className="eyebrow">
          {tr(locale, LABELS.keyPoints)}
        </h2>
        <ul className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
          {service.takeaways.map((t, i) => (
            <li key={i} className="spatial-object bg-ink p-7">
              <span className="font-mono text-[0.66rem] tracking-[0.16em] text-grey">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-silver">{t}</p>
            </li>
          ))}
        </ul>
      </section>

      {service.sections.map((sec) => (
        <section key={sec.heading} className="shell py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">
                {sec.heading}
              </h2>
            </div>
            <div className="space-y-6 md:col-span-8">
              {sec.body.map((para, i) => (
                <p key={i} className="max-w-[62ch] leading-relaxed text-silver">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="shell border-t border-line py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="eyebrow">{tr(locale, LABELS.deliverables)}</h2>
          </div>
          <ul className="grid gap-x-8 md:col-span-8 sm:grid-cols-2">
            {service.deliverables.map((d) => (
              <li
                key={d}
                className="border-t border-line py-3 text-sm text-silver"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell border-t border-line py-16" aria-labelledby="faq">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="faq" className="eyebrow">
              {tr(locale, LABELS.questions)}
            </h2>
          </div>
          <dl className="md:col-span-8">
            {service.faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 60} className="border-t border-line py-7">
                <dt className="font-sans text-lg font-medium text-mineral">{f.q}</dt>
                <dd className="mt-3 max-w-[62ch] leading-relaxed text-grey">
                  {f.a}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell border-t border-line py-16">
          <h2 className="eyebrow">{tr(locale, LABELS.evidence)}</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex items-center gap-4 border border-line px-6 py-5 transition-colors hover:border-line-strong"
                >
                  <span className="font-display text-xl">{p.title}</span>
                                    <span className="text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactCta locale={locale} />
    </article>
  );
}
