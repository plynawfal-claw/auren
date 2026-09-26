import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactCta } from "@/components/sections/contact-cta";
import { articleBySlug, articles } from "@/content/insights";
import { routing } from "@/i18n/navigation";
import { founder, siteUrl } from "@/config/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    articles.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug[slug];
  if (!a) return {};

  return {
    title: a.metaTitle,
    description: a.description,
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      publishedTime: a.published,
      ...(a.updated ? { modifiedTime: a.updated } : {}),
      authors: [founder.name],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = articleBySlug[slug];
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${siteUrl}/insights/${article.slug}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.published,
        dateModified: article.updated ?? article.published,
        author: { "@id": `${siteUrl}/#founder` },
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntityOfPage: `${siteUrl}/insights/${article.slug}`,
        articleSection: article.topic,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: `${siteUrl}/insights`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${siteUrl}/insights/${article.slug}`,
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
            href="/insights"
            className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-grey hover:text-mineral"
          >
            ← Insights
          </Link>

          <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-grey">
            {article.topic} ·{" "}
            <time dateTime={article.published}>
              {new Date(article.published).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>{" "}
            · {article.readingMinutes} min read
          </p>

          <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-display)]">
            {article.title}
          </h1>
        </div>
      </header>

      {/* Extractable summary, placed before the body so a retrieval system
          hits the compressed claims first. */}
      <section className="shell mt-14" aria-labelledby="takeaways">
        <h2 id="takeaways" className="eyebrow">
          In short
        </h2>
        <ul className="mt-5 space-y-3 border-l border-line-strong pl-6">
          {article.takeaways.map((t, i) => (
            <li key={i} className="max-w-[62ch] leading-relaxed text-mineral">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <div className="shell mt-14 max-w-[70ch] space-y-7 pb-20">
        {article.blocks.map((b, i) => {
          if (b.type === "h2") {
            return (
              <h2
                key={i}
                className="pt-6 font-display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-tight"
              >
                {b.text}
              </h2>
            );
          }
          if (b.type === "list") {
            return (
              <ul key={i} className="space-y-2.5">
                {b.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-line pt-2.5 leading-relaxed text-silver"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-[1.0625rem] leading-[1.75] text-silver">
              {b.text}
            </p>
          );
        })}

        <p className="border-t border-line pt-7 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-grey">
          Written by {founder.name}
        </p>
      </div>

      <ContactCta />
    </article>
  );
}
