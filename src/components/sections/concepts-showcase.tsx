import { tr } from "@/i18n/copy";
import { concepts } from "@/content/concepts";
import { ConceptShowcase } from "@/components/concepts/concept-showcase";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * The five concepts.
 *
 * This replaced a sticky deck of three pale cards, each holding four empty
 * cream squares with a caption underneath. It looked like a deck and told a
 * visitor nothing: no photograph of the business, no interface, no price, no
 * way to tell what the studio would actually build.
 *
 * Each concept below now renders as its own composition — a menu laid over a
 * room, a figure beside a product and a bag, a showroom you scroll through, a
 * hire desk over a mountain road, a café that is one calm screen — with its own
 * palette, in English, French and Darija, in the direction its language reads.
 *
 * The honesty rule is unchanged and enforced at the component level: the badge
 * is rendered by `ConceptBadge` inside every concept, and no panel anywhere in
 * `content/concepts/` describes a result, a client or a number.
 */
export function ConceptsShowcase({
  locale,
  showHeading = true,
}: {
  locale: Locale;
  /** The /concepts route writes its own hero above; the homepage does not. */
  showHeading?: boolean;
}) {
  return (
    <section
      className={cn(showHeading ? "border-t border-line" : "pb-24")}
      aria-labelledby={showHeading ? "concepts-heading" : undefined}
    >
      {showHeading && (
        <div className="shell pt-20 md:pt-28">
          <p className="eyebrow">Studio concepts</p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-14 gap-y-7">
            <h2
              id="concepts-heading"
              className="max-w-[20ch] text-[length:var(--text-display)] leading-[0.94]"
            >
              Five businesses, and what each one would get.
            </h2>
            <p className="max-w-[44ch] text-sm leading-relaxed text-grey md:text-base">
              These are AUREN&apos;s own designs, built to show what a site of this
              kind would do for a business like yours. There is no client behind
              any of them, no brief, and no results to report.
            </p>
          </div>
        </div>
      )}

      {/* The jump list. Five businesses, and the category each belongs to —
          this is the only place the set is summarised, so a visitor can get to
          the one they came for without scrolling through the other four. */}
      <nav aria-label="Concepts" className="shell mt-14">
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line sm:grid-cols-2 lg:grid-cols-5">
          {concepts.map((concept, i) => (
            <li key={concept.id}>
              <a
                href={`#concept-${concept.id}`}
                className="flex h-full flex-col gap-2 p-5 transition-colors duration-[var(--dur)] hover:bg-graphite"
              >
                <span className="font-mono text-[0.6rem] tracking-[0.18em] text-grey-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg leading-none">{concept.name}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-grey">
                  {tr(locale, concept.category)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
        {concepts.map((concept) => (
          <div key={concept.id} id={`concept-${concept.id}`} className="scroll-mt-24">
            <ConceptShowcase concept={concept} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  );
}
