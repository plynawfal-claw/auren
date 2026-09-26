import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrowserFrame } from "@/components/work/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
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
            Work we have shipped, and work we would like to.
          </h1>
          <p className="lead mt-8 max-w-[54ch]">
            Every business below is real and shipped. The five concepts are a
            separate page, because they are not work — they are what we would
            build. Where a number is not published here, it is because it has
            not been verified.
          </p>
        </div>
      </section>

      {/* Grouped, not mixed. The badge on each frame says the same thing, but
          the page structure should carry it too — a visitor skimming should
          never have to read a label to know which half they are looking at. */}
      {([
        { kind: "client" as const, heading: "Client work", note: "Real businesses. Shipped." },
        { kind: "concept" as const, heading: "Studio concepts", note: "Our own explorations. No client, no brief, no results." },
      ]).map((group) => {
        const items = projects.filter((p) => p.kind === group.kind);
        if (items.length === 0) {
          // Concepts are no longer case studies. When a category has none, the
          // page says so and points at the page that does have them, rather
          // than rendering an empty heading over nothing.
          return group.kind === "concept" ? (
            <section key={group.kind} className="shell pb-20">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-7">
                <h2 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-none">
                  {group.heading}
                </h2>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey">
                  {group.note}
                </p>
              </div>
              <p className="mt-6 max-w-[52ch] leading-relaxed text-silver">
                The five concepts are not case studies and are not counted as
                work. Each one is a full design — its own palette, its own
                layout, its own interface — shown in full on its own page.
              </p>
              <div className="mt-8">
                <ButtonLink href="/concepts" variant="ghost">
                  See the five concepts
                </ButtonLink>
              </div>
            </section>
          ) : null;
        }
        return (
          <section key={group.kind} className="shell pb-20" aria-labelledby={`g-${group.kind}`}>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-7">
              <h2 id={`g-${group.kind}`} className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-none">
                {group.heading}
              </h2>
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey">
                {group.note}
              </p>
            </div>

            <ul className="mt-12 grid gap-x-10 gap-y-20 md:grid-cols-2">
              {items.map((project, i) => (
                <Reveal as="li" key={project.slug} delay={(i % 2) * 90}>
                  <Link href={`/work/${project.slug}`} className="group block">
                    <BrowserFrame
                      src={project.site.desktop}
                      alt={project.site.alt}
                      domain={project.site.label}
                      badge={project.kind === "concept" ? "Studio concept" : undefined}
                      priority={i < 2 && group.kind === "client"}
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
        );
      })}

      <ContactCta />
    </>
  );
}
