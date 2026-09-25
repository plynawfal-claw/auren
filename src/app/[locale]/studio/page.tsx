import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactCta } from "@/components/sections/contact-cta";
import { practices } from "@/content/practices";
import { founder, site, siteUrl } from "@/config/site";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Studio",
  description:
    "AUREN is a digital studio in Morocco building products, creative, acquisition and automation as one connected system. Founded by Naoufal El Absi.",
  alternates: { canonical: "/studio" },
};

const PRINCIPLES = [
  {
    title: "No invented proof",
    body: "No fabricated metrics, no ghost-written testimonials, no client logos we did not earn. Where a number is not published on this site, it is because it has not been verified. A studio that will invent a statistic for its own site will invent one for yours.",
  },
  {
    title: "The budget comes before the design",
    body: "Performance targets are set at the start and designed within, rather than discovered at the end and apologised for. Luxury is not an excuse for a four-second load.",
  },
  {
    title: "Ship complete sections",
    body: "One finished thing beats four half-built experiments. Work arrives in pieces you can actually judge.",
  },
  {
    title: "Write it down",
    body: "Style guides, asset ledgers, decisions and their reasons. Work that only exists in someone's head cannot be handed over, defended, or repeated.",
  },
] as const;

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/studio#about`,
    name: `About ${site.name}`,
    description: site.description,
    mainEntity: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }}
      />

      <section className="pt-36">
        <div className="shell">
          <p className="eyebrow">Studio</p>
          <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-display)]">
            A studio built around one argument.
          </h1>
          <p className="lead mt-7 max-w-[58ch]">
            {site.description} Most businesses buy these four things from four
            suppliers and spend the difference reconciling them.
          </p>
        </div>
      </section>

      <section className="shell py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="eyebrow">Who</h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <p className="text-[length:var(--text-lead)] leading-[1.45] text-mineral">
              {site.name} is led by {founder.name}, working from {site.region}{" "}
              with clients beyond it.
            </p>
            <p className="max-w-[62ch] leading-relaxed text-silver">
              The work so far spans a pet-identification brand with its entire
              ad library produced in-house, an aluminium workshop given an
              identity and a searchable presence, a single-product
              cash-on-delivery store in Darija and French, and an offline-first
              plant-care application in four languages.
            </p>
            <p className="max-w-[62ch] leading-relaxed text-silver">
              Those four projects are the reason this studio is organised the
              way it is. Each needed a product, creative to sell it, a channel
              to sell it through, and something to handle what happened next.
              Buying those separately is how they end up contradicting each
              other.
            </p>
          </div>
        </div>
      </section>

      <section className="shell border-t border-line py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="eyebrow">How we work</h2>
          </div>
          <ul className="md:col-span-8">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="border-t border-line py-8">
                <div className="flex gap-6">
                  <span className="font-mono text-[0.68rem] tracking-[0.16em] text-grey">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-medium text-mineral">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-[60ch] leading-relaxed text-grey">
                      {p.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell border-t border-line py-20">
        <h2 className="eyebrow">The four practices</h2>
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {practices.map((d) => (
            <li key={d.id} className="bg-ink p-7">
              <h3 className="font-display text-2xl leading-none">
                {d.label}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-grey">
                {d.definition}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta />
    </>
  );
}
