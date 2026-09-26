import { c, tr } from "@/i18n/copy";
import type { RoadtripConcept } from "@/content/concepts/types";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import {
  ConceptCan,
  ConceptMasthead,
  ConceptStage,
  Cta,
  Kicker,
  Plate,
  RowList,
} from "./concept-shell";

const copy = {
  routes: c("Where people drive", "Où l'on conduit", "فين كيسوقو الناس"),
  reassurance: c("Before you sign", "Avant de signer", "قبل ما توقّع"),
  reassuranceNote: c(
    "Every amount a Moroccan hire desk is asked about, written out in dirhams before anybody is asked for a card.",
    "Chaque montant demandé à un loueur marocain, écrit en dirhams avant qu'on ne demande une carte.",
    "كل المبلغ لي كيسولو عليه الكرا فالمغرب، مكتوب بالدرهم قبل ما نطلبو الكارت.",
  ),
  asking: c("Asking a person", "Demander à quelqu'un", "سول شي واحد"),
  perDay: c("per day", "par jour", "فالنهار"),
  mad: c("MAD", "MAD", "درهم"),
};

/**
 * 04 — Car hire in Morocco.
 *
 * A booking desk laid over the landscape you are driving towards, because a
 * traveller's questions arrive in a fixed order: where am I collecting it, what
 * does it cost, what is the deposit, what does the insurance not cover, and
 * who do I call when the car stops on a mountain road at 6pm. The page answers
 * them in that order, in French and Darija, before it asks for anything.
 *
 * The category cards carry the price per day, not a "from" figure that nobody
 * ends up paying, and WhatsApp is a first-class control rather than a link in a
 * footer. For a business that rents to visitors, WhatsApp *is* the front desk.
 */
export function RoadtripShowcase({ concept, locale }: { concept: RoadtripConcept; locale: Locale }) {
  return (
    <ConceptStage concept={concept} locale={locale} className="c-roadtrip">
      <div className="relative">
        <Plate
          image={concept.hero}
          alt="A mountain road winding through the High Atlas at dusk"
          className="aspect-[16/10] w-full rounded-none lg:aspect-[21/8]"
          position="50% 60%"
          sizes="100vw"
          priority
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="shell w-full pb-10 lg:pb-14">
            <ConceptMasthead concept={concept} locale={locale} index="04" />
          </div>
        </div>
      </div>

      <div className="shell py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Kicker>{tr(locale, concept.statement)}</Kicker>
          </div>
          <div className="lg:col-span-7">
            <ConceptCan concept={concept} locale={locale} />
          </div>
        </div>

        {/* The desk. Collection, return and licence on one line, then the three
            categories with a real daily price each. */}
        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Kicker>{tr(locale, concept.booking.heading)}</Kicker>
            <p className="mt-5 max-w-[40ch] leading-relaxed text-[var(--c-soft)]">
              {tr(locale, concept.booking.note)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta>{tr(locale, concept.booking.cta)}</Cta>
              <Cta variant="ghost">{tr(locale, concept.booking.whatsapp)}</Cta>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="c-panel rounded-3xl p-6 md:p-9">
              <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-3">
                {concept.booking.fields.map((field) => (
                  <div key={field.value.en} className="c-field">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--c-soft)]">
                      {tr(locale, field.label)}
                    </span>
                    <span className="mt-2 block text-[0.95rem] text-[var(--c-ink)]">
                      {tr(locale, field.value)}
                    </span>
                  </div>
                ))}
              </div>

              <ul className="mt-7 grid gap-3 md:grid-cols-3">
                {concept.booking.categories.map((cat, i) => (
                  <li
                    key={cat.name.en}
                    className={cn("c-car", i === 1 && "c-car--picked")}
                  >
                    <span className="font-mono text-[0.6rem] tracking-[0.16em] text-[var(--c-soft)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block text-[var(--c-ink)]">{tr(locale, cat.name)}</span>
                    <span className="mt-1 block font-mono text-[0.68rem] tracking-[0.06em] text-[var(--c-soft)]">
                      {tr(locale, cat.spec)}
                    </span>
                    <span className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-display text-2xl leading-none text-[var(--c-ink)]">
                        {cat.price}
                      </span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--c-soft)]">
                        {tr(locale, copy.mad)} {tr(locale, copy.perDay)}
                      </span>
                    </span>
                    {cat.note && (
                      <span className="mt-3 block text-sm leading-snug text-[var(--c-soft)]">
                        {tr(locale, cat.note)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Deposit, insurance, mileage, help. The four questions that decide
            whether somebody trusts a rental desk they have never used. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Kicker>{tr(locale, copy.reassurance)}</Kicker>
            <p className="c-subhead mt-4 font-display leading-[1.08]">
              {tr(locale, copy.reassuranceNote)}
            </p>
          </div>
          <div className="lg:col-span-8">
            <RowList rows={concept.reassurance} locale={locale} />
          </div>
        </div>

        {/* The roads. Named, with what they are actually like — a renter
            choosing between an SUV and a city car is choosing a road. */}
        <div className="mt-20 lg:mt-28">
          <Kicker>{tr(locale, copy.routes)}</Kicker>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {concept.coverage.map((place) => (
              <figure key={place.name.en} className="c-route">
                <Plate
                  image={place.image}
                  alt=""
                  className="aspect-[4/3] w-full rounded-xl"
                  position="50% 55%"
                  sizes="(max-width: 640px) 92vw, 24vw"
                />
                <figcaption className="mt-3">
                  <p className="font-display text-lg leading-none text-[var(--c-ink)]">
                    {tr(locale, place.name)}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[var(--c-soft)]">
                    {tr(locale, place.note)}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Asking a person. WhatsApp, in Darija, answered by the depot — the
            contact a Moroccan hire business actually runs on. */}
        <div className="mt-20 lg:mt-28">
          <div className="c-panel flex flex-wrap items-center justify-between gap-6 rounded-3xl p-6 md:p-10">
            <div className="max-w-[46ch]">
              <Kicker>{tr(locale, copy.asking)}</Kicker>
              <p className="mt-4 text-lg leading-relaxed text-[var(--c-ink)]">
                {tr(locale, concept.panels[3].note)}
              </p>
            </div>
            <Cta>{tr(locale, concept.booking.whatsapp)}</Cta>
          </div>
        </div>
      </div>
    </ConceptStage>
  );
}
