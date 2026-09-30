import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrowserFrame } from "@/components/work/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { practiceTag } from "@/content/practices";
import { projects } from "@/content/projects";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  // No `alternates.canonical` here on purpose. A relative canonical resolves
  // against the locale-free `metadataBase`, so it emitted the English URL on
  // every locale. `LocaleAlternates` derives canonical + hreflang per route
  // and per locale instead.
  title: "Work",
  description:
    "Four businesses built end to end — storefronts, applications, brand systems and the automation behind them. Case studies from AUREN.",
};

export default async function WorkIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Selected work",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <section className="pt-32 pb-14 md:pt-36">
        <div className="shell">
          <p className="eyebrow">Work</p>
          <h1 className="mt-6 max-w-[18ch] text-[length:var(--text-display)] leading-[0.94]">
            Work we have shipped.
          </h1>
          <p className="lead mt-8 max-w-[54ch]">
            Every business below is real and shipped. Where a number is not
            published here, it is because it has not been verified.
          </p>
        </div>
      </section>

      <section className="shell pb-20" aria-labelledby="g-client">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-7">
          <h2 id="g-client" className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-none">
            Client work
          </h2>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey">
            Real businesses. Shipped.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-10 gap-y-20 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={(i % 2) * 90}>
              <Link href={`/work/${project.slug}`} className="group block">
                <BrowserFrame
                  src={project.site.desktop}
                  alt={project.site.alt}
                  domain={project.site.label}
                  priority={i < 2}
                  sizes="(max-width: 768px) 92vw, 46vw"
                  className="transition-colors duration-[var(--dur)] ease-[var(--ease)] group-hover:border-line-strong"
                />
                <h3 className="mt-7 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
                  {project.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-silver">
                  {project.tagline}
                </p>
                <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey">
                  {project.industry} ·{" "}
                  {project.practices.map((p) => practiceTag[p]).join(" · ")}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <ContactCta locale={locale} />
    </>
  );
}
