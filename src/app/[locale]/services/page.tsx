import type { Metadata } from "next";
import { share } from "@/lib/share";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { practices } from "@/content/practices";
import { services } from "@/content/services";
import { routing } from "@/i18n/navigation";
import { localizePractice, localizeService } from "@/content/services.i18n";
import { c, tr } from "@/i18n/copy";

const COPY = {
  eyebrow: c("Capabilities", "Expertises", "الخدمات"),
  title: c("Four disciplines, one engagement.", "Quatre expertises, un seul partenaire.", "أربع خبرات، شريك واحد."),
  lead: c(
    "Sold separately, these contradict each other — the brand promises one thing, the ads promise another, and the system behind them cannot keep either. Run together, each one makes the next cheaper.",
    "Vendues séparément, elles se contredisent — la marque promet une chose, les publicités une autre, et le système derrière ne peut tenir ni l’une ni l’autre. Menées ensemble, chacune rend la suivante moins coûteuse.",
    "إلا تباعو مفروقين، كيتناقضو — الماركة كتوعد بحاجة، الإعلانات بحاجة خرا، والسيستم اللي موراهم ما يقدر يوفي حتى وحدة. إلا خدمو مع بعض، كل وحدة كترخّص اللي من بعدها.",
  ),
  metaDescription: c(
    "Digital products, creative and brand, growth, and AI systems — the four disciplines AUREN runs as one connected engagement.",
    "Sites et applications, création et marque, croissance et systèmes IA — les quatre expertises qu’AUREN mène comme un seul accompagnement, au Maroc.",
    "المواقع والتطبيقات، الإبداع والماركة، النمو والأنظمة الذكية — أربع خبرات كتخدمهم AUREN كخدمة وحدة مترابطة، فالمغرب.",
  ),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// No `alternates.canonical` here on purpose. A relative canonical resolves
// against the locale-free `metadataBase`, so it emitted the English URL on
// every locale. `LocaleAlternates` derives canonical + hreflang per route
// and per locale instead.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = tr(locale, COPY.eyebrow);
  const description = tr(locale, COPY.metaDescription);
  return { title, description, ...share("/og/services.png", title, description) };
}

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-36 pb-16">
        <div className="shell">
          <p className="eyebrow">{tr(locale, COPY.eyebrow)}</p>
          <h1 className="mt-6 max-w-[16ch] text-[length:var(--text-display)]">
            {tr(locale, COPY.title)}
          </h1>
          <p className="lead mt-7 max-w-[58ch]">
            {tr(locale, COPY.lead)}
          </p>
        </div>
      </section>

      <div className="shell pb-24">
        {practices.map((p) => {
          const d = localizePractice(p, locale);
          const group = services
            .filter((s) => d.serviceSlugs.includes(s.slug))
            .map((s) => localizeService(s, locale));
          return (
            <section
              key={d.id}
              className="border-t border-line py-14"
              aria-labelledby={`d-${d.id}`}
            >
              <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <h2
                    id={`d-${d.id}`}
                    className="font-display text-[length:var(--text-title)] leading-[0.95]"
                  >
                    {d.label}
                  </h2>
                  <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-grey">
                    {d.definition}
                  </p>
                </div>

                <ul className="md:col-span-8">
                  {group.map((s, i) => (
                    <Reveal as="li" key={s.slug} delay={i * 70}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="spatial-object group flex items-start gap-6 border-b border-line bg-graphite/40 px-5 py-7"
                      >
                        <div className="flex-1">
                          <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none">
                            {s.title}
                          </h3>
                          <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-silver">
                            {s.definition}
                          </p>
                        </div>
                        <span className="mt-2 shrink-0 text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                          →
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <ContactCta locale={locale} />
    </>
  );
}
