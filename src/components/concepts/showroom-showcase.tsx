import { c, tr } from "@/i18n/copy";
import type { ShowroomConcept } from "@/content/concepts/types";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import {
  ConceptCan,
  ConceptMasthead,
  ConceptStage,
  Cta,
  Kicker,
  Plate,
} from "./concept-shell";

/** Headings that belong to this composition rather than to any data field. */
const copy = {
  rooms: c("By the room", "Par pièce", "من الغرفة"),
  pieces: c("The pieces", "Les pièces", "القطع"),
  gallery: c("The gallery", "La galerie", "الغاليري"),
  enquiry: c("Ask about a piece", "Poser une question", "سول على قطعة"),
  materials: c("Materials", "Matières", "الخامات"),
};

/**
 * 03 — Showroom.
 *
 * A furniture showroom is a room you walk into, so the page is a room you
 * scroll through rather than a grid of thumbnails. One space fills the frame,
 * the collections are entered by the room they belong to, and the materials sit
 * in a swatch table because swatching is the conversation that actually
 * happens on a showroom floor.
 *
 * The enquiry is the closing argument and it is deliberately the smallest
 * object on the page: one question, answered by the person who knows the
 * piece, instead of a contact form with eleven fields.
 */
export function ShowroomShowcase({ concept, locale }: { concept: ShowroomConcept; locale: Locale }) {
  return (
    <ConceptStage concept={concept} locale={locale} className="c-showroom">
      {/* The room. Full-bleed, and the only thing on the first screen. */}
      <div className="relative">
        <Plate
          image={concept.hero}
          alt="A furniture showroom interior, daylight through tall windows"
          className="aspect-[16/9] w-full rounded-none lg:aspect-[21/9]"
          position="50% 55%"
          sizes="100vw"
          priority
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="shell w-full pb-10 lg:pb-14">
            <ConceptMasthead concept={concept} locale={locale} index="03" />
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

        {/* By the room, not by the product number. Nobody redecorates a
            "collection"; they redo the living room. */}
        <div className="mt-16 lg:mt-24">
          <Kicker>{tr(locale, copy.rooms)}</Kicker>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {concept.rooms.map((room, i) => (
              <figure key={room.name.en} className="c-room">
                <Plate
                  image={room.image}
                  alt=""
                  className={cn(
                    "w-full rounded-xl",
                    i === 0 ? "aspect-[3/4]" : "aspect-[4/5]",
                  )}
                  position="50% 50%"
                  sizes="(max-width: 640px) 92vw, 20vw"
                />
                <figcaption className="mt-3">
                  <p className="font-display text-lg leading-none text-[var(--c-ink)]">
                    {tr(locale, room.name)}
                  </p>
                  <p className="mt-1.5 text-sm text-[var(--c-soft)]">{tr(locale, room.note)}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Materials. Named, swatched, and described in one line each — the
            row a salesperson would actually walk you along. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:pt-4">
            <Kicker>{tr(locale, copy.materials)}</Kicker>
            <p className="c-subhead mt-4 font-display leading-[1.08]">
              {tr(locale, concept.panels[1].note)}
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="c-materials">
              {concept.materials.map((material) => (
                <li key={material.hex} className="c-materials__row">
                  <span
                    aria-hidden="true"
                    className="c-swatch"
                    style={{ background: material.hex }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[var(--c-ink)]">{tr(locale, material.name)}</span>
                    <span className="mt-0.5 block font-mono text-[0.7rem] tracking-[0.06em] text-[var(--c-soft)]">
                      {material.hex.toUpperCase()}
                    </span>
                  </span>
                  <span className="text-sm text-[var(--c-soft)]">{tr(locale, material.note)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The pieces themselves. Five objects, priced, because a showroom
            that hides its prices just sends the visitor to a phone call. */}
        <div className="mt-20 lg:mt-28">
          <Kicker>{tr(locale, copy.pieces)}</Kicker>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {concept.pieces.map((piece) => (
              <figure key={piece.name.en} className="c-piece">
                <Plate
                  image={piece.image}
                  alt=""
                  className="aspect-square w-full rounded-xl"
                  position="50% 50%"
                  sizes="(max-width: 640px) 46vw, 20vw"
                />
                <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="text-sm leading-snug text-[var(--c-ink)]">
                    {tr(locale, piece.name)}
                  </span>
                  <span className="shrink-0 font-mono text-[0.72rem] text-[var(--c-soft)]">
                    {piece.price}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* The gallery. Five frames from the showroom itself, so a visitor can
            walk the space before they drive over. */}
        <div className="mt-20 lg:mt-28">
          <Kicker>{tr(locale, copy.gallery)}</Kicker>
          <div className="c-gallery mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {concept.gallery.map((frame, i) => (
              <Plate
                key={frame.src}
                image={frame}
                alt=""
                className={cn("w-full rounded-xl", i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]")}
                position="50% 50%"
                sizes="(max-width: 640px) 46vw, 20vw"
              />
            ))}
          </div>
        </div>

        {/* The enquiry. The smallest object on the page, and the only one that
            has to work. */}
        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Kicker>{tr(locale, copy.enquiry)}</Kicker>
            <p className="mt-5 max-w-[44ch] leading-relaxed text-[var(--c-soft)]">
              {tr(locale, concept.inquiry.note)}
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="c-panel rounded-3xl p-6 md:p-9">
              <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2">
                {concept.inquiry.fields.map((field) => (
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
              <div className="mt-8">
                <Cta>{tr(locale, concept.inquiry.cta)}</Cta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConceptStage>
  );
}
