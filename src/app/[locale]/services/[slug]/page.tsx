import type { Metadata } from "next";
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

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.definition,
    openGraph: {
      type: "article",
      title: `${service.metaTitle} · AUREN`,
      description: service.definition,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = serviceBySlug[slug];
  if (!service) notFound();

  const practice = practiceById[service.discipline];
  const related = service.projects
    .map((s) => projectBySlug[s])
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/services/${service.slug}#service`,
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
          name: `${service.title} deliverables`,
          itemListElement: service.deliverables.map((d) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: d },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/services/${service.slug}#faq`,
        mainEntity: service.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Capabilities",
            item: `${siteUrl}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `${siteUrl}/services/${service.slug}`,
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
            ← Capabilities
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
          Key points
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
            <h2 className="eyebrow">What you get</h2>
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
              Questions
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
          <h2 className="eyebrow">Evidence</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex items-center gap-4 border border-line px-6 py-5 transition-colors hover:border-line-strong"
                >
                  <span className="font-display text-xl">{p.title}</span>
                                    <span className="text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactCta />
    </article>
  );
}
