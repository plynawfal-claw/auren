import { c, tr } from "@/i18n/copy";
import type { CafeConcept } from "@/content/concepts/types";
import type { Locale } from "@/i18n/config";
import {
  ConceptBadge,
  ConceptCan,
  ConceptStage,
  Kicker,
  Plate,
  RowList,
} from "./concept-shell";

const copy = {
  today: c("Out of the oven this morning", "Sorti du four ce matin", "خرج من الفرن اليوم الصبح"),
  hours: c("Opening hours", "Horaires", "أوقات الخدمة"),
  places: c("The two doors", "Les deux portes", "البوابين"),
  signature: c("The signature", "La signature", "المميز"),
  mad: c("MAD", "MAD", "درهم"),
};

/**
 * 05 — Coffee shop.
 *
 * The quietest of the five and the smallest. A café has almost nothing to sell
 * online, which is exactly why the page must be effortless: one cup, one
 * signature, three pastries, the hours, the two streets. At a 390px width the
 * whole thing is one screen and a half, and the two things a regular needs —
 * are you open, where are you — are both above the fold.
 *
 * No bag, no checkout, no account. Writing one would be a lie about what this
 * business does, and the absence is the design.
 */
export function CafeShowcase({ concept, locale }: { concept: CafeConcept; locale: Locale }) {
  return (
    <ConceptStage concept={concept} locale={locale} className="c-cafe">
      <div className="shell py-20 md:py-28">
        {/* The cup, centred, with the name under it. Nothing competes. */}
        <div className="flex flex-col items-center text-center">
          <ConceptBadge concept={concept} locale={locale} />
          <div className="mt-8 w-full max-w-[420px]">
            <Plate
              image={concept.hero}
              alt="A cup of coffee on a marble counter, morning light"
              className="aspect-square w-full rounded-full"
              position="50% 50%"
              sizes="(max-width: 640px) 84vw, 420px"
              priority
            />
          </div>
          <h2 className="mt-10 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">
            {concept.name}
          </h2>
          <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-[var(--c-soft)]">
            {tr(locale, concept.category)}
          </p>
        </div>

        {/* What the visitor could do here, stated in four lines and no more. */}
        <div className="mx-auto mt-16 max-w-[720px] lg:mt-24">
          <ConceptCan concept={concept} locale={locale} />
        </div>

        {/* The signature. One cup, described properly — origin, roast, how it
            is served. This is the whole argument for the place. */}
        <div className="mx-auto mt-16 grid max-w-[1080px] items-center gap-10 lg:mt-24 lg:grid-cols-2 lg:gap-14">
          <Plate
            image={concept.signature.image}
            alt="Coffee being poured, slow, without pressure"
            className="w-full rounded-2xl"
            position="50% 50%"
            sizes="(max-width: 1024px) 92vw, 44vw"
          />
          <div>
            <Kicker>{tr(locale, copy.signature)}</Kicker>
            <h3 className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.04] text-[var(--c-ink)]">
              {tr(locale, concept.signature.name)}
            </h3>
            <p className="mt-5 max-w-[42ch] leading-relaxed text-[var(--c-soft)]">
              {tr(locale, concept.signature.note)}
            </p>
            <div className="mt-7">
              <RowList rows={concept.signature.rows} locale={locale} dense />
            </div>
          </div>
        </div>

        {/* Three pastries and a price each. A café does not need a bakery page. */}
        <div className="mx-auto mt-16 max-w-[1080px] lg:mt-24">
          <Kicker>{tr(locale, copy.today)}</Kicker>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {concept.pastries.map((pastry) => (
              <figure key={pastry.name.en} className="c-bake">
                <Plate
                  image={pastry.image}
                  alt=""
                  className="aspect-[4/5] w-full rounded-xl"
                  position="50% 50%"
                  sizes="(max-width: 640px) 92vw, 30vw"
                />
                <figcaption className="mt-3">
                  <p className="text-sm leading-snug text-[var(--c-ink)]">
                    {tr(locale, pastry.name)}
                  </p>
                  <p className="mt-1.5 flex items-baseline justify-between gap-3 text-xs text-[var(--c-soft)]">
                    <span>{tr(locale, pastry.note)}</span>
                    <span className="shrink-0 font-mono text-[0.72rem]">
                      {pastry.price} {tr(locale, copy.mad)}
                    </span>
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Hours and the two streets. On a café site these are the only two
            reasons to keep scrolling, so they are last and they are short. */}
        <div className="mx-auto mt-16 grid max-w-[1080px] gap-10 lg:mt-24 lg:grid-cols-2 lg:gap-14">
          <div>
            <Kicker>{tr(locale, copy.hours)}</Kicker>
            <ul className="c-hours mt-4">
              {concept.hours.map((slot) => (
                <li key={slot.day.en} className="c-hours__row">
                  <span className="text-[var(--c-ink)]">{tr(locale, slot.day)}</span>
                  <span className="font-mono text-[0.76rem] tracking-[0.06em] text-[var(--c-soft)]">
                    {slot.open}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Kicker>{tr(locale, copy.places)}</Kicker>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {concept.places.map((place) => (
                <li key={place.name.en} className="c-place rounded-2xl p-5">
                  <p className="text-[var(--c-ink)]">{tr(locale, place.name)}</p>
                  <p className="mt-1.5 text-sm text-[var(--c-soft)]">{tr(locale, place.address)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-[var(--c-soft)]">
              {tr(locale, concept.promise)}
            </p>
          </div>
        </div>
      </div>
    </ConceptStage>
  );
}
