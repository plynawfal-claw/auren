import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { articles } from "@/content/insights";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  // No `alternates.canonical` here on purpose. A relative canonical resolves
  // against the locale-free `metadataBase`, so it emitted the English URL on
  // every locale. `LocaleAlternates` derives canonical + hreflang per route
  // and per locale instead.
  title: "Insights",
  description:
    "Notes on search visibility, AI answer engines, performance creative and building for cash-on-delivery markets.",
};

export default async function InsightsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-36 pb-12">
        <div className="shell">
          <p className="eyebrow">Insights</p>
          <h1 className="mt-6 max-w-[18ch] text-[length:var(--text-display)]">
            Notes from the work.
          </h1>
          <p className="lead mt-7 max-w-[56ch]">
            Written from projects that shipped. No predictions, no trend
            round-ups — just what turned out to matter.
          </p>
        </div>
      </section>

      <section className="shell pb-24">
        <ul className="border-t border-line">
          {articles.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 80}>
              <Link
                href={`/insights/${a.slug}`}
                className="spatial-object group grid gap-6 border-b border-line bg-graphite/40 px-5 py-10 md:grid-cols-12"
              >
                <div className="md:col-span-3">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-grey">
                    <time dateTime={a.published}>
                      {new Date(a.published).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                  <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey-deep">
                    {a.topic} · {a.readingMinutes} min
                  </p>
                </div>
                <div className="md:col-span-9">
                  <h2 className="font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-tight transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1.5">
                    {a.title}
                  </h2>
                  <p className="mt-3 max-w-[64ch] leading-relaxed text-silver">
                    {a.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <ContactCta locale={locale} />
    </>
  );
}
