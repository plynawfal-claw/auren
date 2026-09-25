import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { practices } from "@/content/practices";
import { services } from "@/content/services";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Digital products, creative and brand, growth, and AI systems — the four disciplines AUREN runs as one connected engagement.",
  alternates: { canonical: "/services" },
};

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
          <p className="eyebrow">Capabilities</p>
          <h1 className="mt-6 max-w-[16ch] text-[length:var(--text-display)]">
            Four disciplines, one engagement.
          </h1>
          <p className="lead mt-7 max-w-[58ch]">
            Sold separately, these contradict each other — the brand promises
            one thing, the ads promise another, and the system behind them
            cannot keep either. Run together, each one makes the next cheaper.
          </p>
        </div>
      </section>

      <div className="shell pb-24">
        {practices.map((d) => {
          const group = services.filter((s) => d.serviceSlugs.includes(s.slug));
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
                        <span className="mt-2 shrink-0 text-grey transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">
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

      <ContactCta />
    </>
  );
}
