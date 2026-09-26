import { tr } from "@/i18n/copy";
import type { FashionConcept } from "@/content/concepts/types";
import type { Locale } from "@/i18n/config";
import {
  ConceptCan,
  ConceptMasthead,
  ConceptStage,
  Cta,
  Kicker,
  Plate,
} from "./concept-shell";

/**
 * 02 — Fashion.
 *
 * A fashion label is a tall thing next to a small thing, and the whole page is
 * built on that asymmetry: a full-height figure holding one column, and the
 * product, the price and the bag stacked in the other. The bag is deliberately
 * small and permanently visible — in a real shop it is the corner of your eye,
 * and that is the only place a cart that has to be checked out in one minute
 * can live.
 *
 * The collection runs as a filmstrip, not a grid, because a grid makes nine
 * garments look like nine products and a lookbook makes them look like a
 * season.
 */
export function FashionShowcase({ concept, locale }: { concept: FashionConcept; locale: Locale }) {
  return (
    <ConceptStage concept={concept} locale={locale} className="c-fashion">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <ConceptMasthead concept={concept} locale={locale} index="02" />
            <ConceptCan concept={concept} locale={locale} />
          </div>

          <div className="lg:col-span-7">
            <Plate
              image={concept.hero}
              alt="A model in a wool coat, photographed full length against a plain wall"
              className="aspect-[4/5] w-full lg:aspect-[9/11]"
              position="50% 35%"
              sizes="(max-width: 1024px) 92vw, 56vw"
            />
          </div>
        </div>

        {/* The look, and the product. A figure on one side, the garment and the
            price on the other, because that is the page a label actually needs
            between "I like this" and "I want this". */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Plate
              image={concept.look.image}
              alt="A full-length look: wool coat over a knit, bag in hand"
              className="aspect-[3/4] w-full"
              position="50% 30%"
              sizes="(max-width: 1024px) 92vw, 48vw"
            />
          </div>

          <div className="flex flex-col justify-center lg:col-span-6">
            <Kicker>{tr(locale, concept.look.heading)}</Kicker>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-[var(--c-ink)]">
              {tr(locale, concept.look.body)}
            </p>
            <div className="mt-10 flex items-end gap-5 border-t border-[var(--c-line)] pt-7">
              <span className="font-display text-[2.75rem] leading-none">{concept.look.price}</span>
              <span className="pb-1.5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-[var(--c-soft)]">
                MAD
              </span>
            </div>
            <div className="mt-8">
              <Cta>{tr(locale, concept.look.cta)}</Cta>
            </div>
          </div>
        </div>

        {/* The bag, at the size a bag occupies. A shop that hides its basket
            behind an icon loses the sale it was about to make. */}
        <div className="mt-20 lg:mt-28">
          <div className="c-bag rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Kicker>{tr(locale, concept.bag.total)}</Kicker>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--c-soft)]">
                {String(concept.bag.items.length).padStart(2, "0")} · MAD
              </span>
            </div>
            <ul className="mt-6">
              {concept.bag.items.map((item, i) => (
                <li key={item.name.en} className="c-bag__row">
                  <span className="font-mono text-[0.6rem] tracking-[0.16em] text-[var(--c-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[var(--c-ink)]">{tr(locale, item.name)}</span>
                  <span className="font-mono text-[0.78rem] text-[var(--c-ink)]">{item.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta>{tr(locale, concept.bag.cta)}</Cta>
              <p className="max-w-[34ch] text-sm leading-relaxed text-[var(--c-soft)]">
                {tr(locale, concept.bag.note)}
              </p>
            </div>
          </div>
        </div>

        {/* The collection, as a strip. Six frames at one height, so the season
            reads as a sequence rather than as a catalogue with prices on it. */}
        <div className="mt-20 lg:mt-28">
          <Kicker>{tr(locale, concept.category)}</Kicker>
          <div className="c-strip mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {concept.strip.map((frame) => (
              <Plate
                key={frame.src}
                image={frame}
                alt=""
                className="aspect-[3/4] w-[38vw] max-w-[190px] shrink-0 rounded-lg"
                position="50% 30%"
                sizes="190px"
              />
            ))}
          </div>
        </div>

        {/* Trying it on. A fitting room in the browser, described as the
            convenience it is — not sold as magic. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Plate
              image={concept.fitting.image}
              alt="A screen showing a garment being tried on over a photograph"
              className="aspect-[16/10] w-full"
              position="50% 45%"
              sizes="(max-width: 1024px) 92vw, 56vw"
            />
          </div>
          <div className="flex flex-col justify-center lg:col-span-5">
            <Kicker>{tr(locale, concept.fitting.heading)}</Kicker>
            <p className="mt-6 max-w-[46ch] leading-relaxed text-[var(--c-ink)]">
              {tr(locale, concept.fitting.body)}
            </p>
            <ul className="mt-8">
              {concept.fitting.points.map((point, i) => (
                <li key={i} className="c-fit__row">
                  <span aria-hidden="true" className="text-[var(--c-accent)]">
                    —
                  </span>
                  <span className="text-[var(--c-ink)]">{tr(locale, point)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ConceptStage>
  );
}
