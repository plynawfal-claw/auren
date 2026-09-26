import { tr } from "@/i18n/copy";
import type { RestaurantConcept } from "@/content/concepts/types";
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

/**
 * 01 — Restaurant.
 *
 * The composition is a card laid over the room. The photograph is the largest
 * thing on the screen and stays there; the menu, the booking panel and the
 * address are the three things a guest actually needs, and they sit beside and
 * over it rather than pushing it away down a long scroll.
 *
 * The menu is set as a printed card — a name, a dotted leader, a price — which
 * is the format people already read in their hand, and it is the reason a
 * restaurant site can look like a menu instead of a set of tiles.
 */
export function RestaurantShowcase({ concept, locale }: { concept: RestaurantConcept; locale: Locale }) {
  return (
    <ConceptStage concept={concept} locale={locale} className="c-restaurant">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Plate
              image={concept.hero}
              alt="A restaurant table laid for dinner, low light, warm wood"
              className="w-full"
              position="50% 58%"
              sizes="(max-width: 1024px) 92vw, 56vw"
              priority
            />
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <ConceptMasthead concept={concept} locale={locale} index="01" />
            <ConceptCan concept={concept} locale={locale} />
          </div>
        </div>

        {/* The menu. Prices in dirhams, written out, never a PDF. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Plate
              image={concept.menu.image}
              alt="A plated dish photographed from above on a dark table"
              className="w-full"
              position="50% 50%"
              sizes="(max-width: 1024px) 92vw, 40vw"
            />
            <div className="mt-5 grid grid-cols-4 gap-2">
              {concept.dishes.map((dish) => (
                <Plate
                  key={dish.src}
                  image={dish}
                  alt=""
                  className="aspect-square w-full rounded-lg"
                  position="50% 50%"
                  sizes="10vw"
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Kicker>{tr(locale, concept.menu.heading)}</Kicker>
            <ul className="c-menu mt-7">
              {concept.menu.items.map((item, i) => (
                <li key={i} className="c-menu__row">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="c-menu__name">{tr(locale, item.name)}</span>
                    {item.tag && (
                      <span className="c-menu__tag font-mono text-[0.58rem] uppercase tracking-[0.14em]">
                        {tr(locale, item.tag)}
                      </span>
                    )}
                  </div>
                  <span aria-hidden="true" className="c-menu__leader" />
                  <span className="c-menu__price">{item.price}</span>
                  <p className="col-span-full mt-1 text-sm text-[var(--c-soft)]">
                    {tr(locale, item.note)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Cta variant="line">{tr(locale, concept.menu.link)}</Cta>
            </div>
          </div>
        </div>

        {/* Booking. A date, a time, a number of people — the thing a guest
            actually needs, beside the menu rather than two pages away. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Kicker>{tr(locale, concept.reservation.heading)}</Kicker>
            <p className="c-subhead mt-4 font-display leading-[1.06]">
              {tr(locale, concept.reservation.note)}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="c-panel rounded-3xl p-6 md:p-9">
              <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-3">
                {concept.reservation.fields.map((field) => (
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

              <div className="mt-7">
                <Kicker>{tr(locale, concept.reservation.fields[1].label)}</Kicker>
                <div className="mt-4 flex flex-wrap gap-2">
                  {concept.reservation.slots.map((slot, i) => (
                    <span
                      key={slot}
                      className={cn(
                        "rounded-full border px-4 py-2 font-mono text-[0.7rem] tracking-[0.08em]",
                        i === 2
                          ? "border-[var(--c-accent)] bg-[var(--c-accent)] text-[var(--c-accent-ink)]"
                          : "border-[var(--c-line)] text-[var(--c-ink)]",
                      )}
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Cta>{tr(locale, concept.reservation.cta)}</Cta>
              </div>
            </div>
          </div>
        </div>

        {/* Finding the door. Address, hours, parking — the three things people
            actually phone a restaurant to ask. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:order-2">
            <Plate
              image={concept.location.image}
              alt="The dining room of the restaurant, empty, evening light"
              className="w-full"
              position="50% 50%"
              sizes="(max-width: 1024px) 92vw, 48vw"
            />
          </div>
          <div className="lg:col-span-6 lg:order-1 lg:pt-6">
            <Kicker>{tr(locale, concept.location.heading)}</Kicker>
            <RowList rows={concept.location.rows} locale={locale} />
          </div>
        </div>
      </div>
    </ConceptStage>
  );
}
