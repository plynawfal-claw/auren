"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { projectBySlug } from "@/content/projects";
import { conceptById } from "@/content/concepts";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

/**
 * Range.
 *
 * A quick band showing the kinds of business this studio designs for. Not a
 * second portfolio and not a logo grid — each card is a real frame from work
 * already on this site, so nothing here is illustrative filler.
 *
 * Every category is backed by an actual project. A category we have no work
 * for does not appear, invented to round the row out.
 */
const CATEGORIES = [
  { label: "Apps", slug: "docteur-plante" },
  { label: "Online shops", slug: "tagpet" },
  { label: "Local trades", slug: "promostore-alu" },
] as const;

/**
 * A second, lighter band: the three concepts that are not shipped work.
 *
 * The band above is only allowed to carry real projects, so a category with no
 * client work behind it cannot be padded in to round the row out. The concepts
 * are the honest answer to "what about restaurants, fashion, furniture and car
 * hire" — so they get their own band, drawn from `content/concepts`, and
 * labelled as concepts rather than presented as work.
 */
const CONCEPT_CATEGORIES = [
  { label: "Restaurants", id: "restaurant" },
  { label: "Fashion", id: "fashion" },
  { label: "Furniture & interiors", id: "showroom" },
  { label: "Car hire", id: "roadtrip" },
  { label: "Cafés", id: "cafe" },
] as const;

export function Range() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  // Duplicated once so the marquee can loop seamlessly. The copy is hidden
  // from assistive tech so the list is not announced twice.
  const track = reduced ? [CATEGORIES] : [CATEGORIES, CATEGORIES];

  return (
    <section className="overflow-hidden py-20 md:py-24" aria-labelledby="range-heading">
      <div className="shell">
        <p className="eyebrow" id="range-heading">
          Who we build for
        </p>
        <p className="mt-6 max-w-[24ch] font-display text-[length:var(--text-title)] leading-[1.04]">
          Different businesses. The same care.
        </p>
      </div>

      <div
        className={cn(
          "mt-12 flex gap-5",
          reduced
            ? "overflow-x-auto px-[var(--page-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "au-marquee w-max",
        )}
      >
        {track.map((group, g) => (
          <div key={g} className="flex shrink-0 gap-5" aria-hidden={g > 0}>
            {group.map((c) => {
              const p = projectBySlug[c.slug];
              if (!p) return null;
              return (
                <Link
                  key={`${g}-${c.slug}`}
                  href={`/work/${p.slug}`}
                  tabIndex={g > 0 ? -1 : 0}
                  className="group w-[260px] shrink-0 sm:w-[320px]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-graphite">
                    <Image
                      src={p.site.desktop}
                      alt=""
                      fill
                      sizes="320px"
                      className="object-cover object-top transition-transform duration-[var(--dur-editorial)] ease-[var(--ease)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="font-display text-xl leading-none">{c.label}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-grey-deep">
                      Client
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* The second band. Real photographs, real concepts, and the label that
          says which is which — the same distinction the work page draws with
          two headings, made at the same glance as the images. */}
      <div className="mt-20 md:mt-24">
        <div className="shell">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-grey">
            And five categories we have designed for, with no client behind them
          </p>
        </div>

        <div
          className={cn(
            "mt-8 flex gap-5",
            reduced
              ? "overflow-x-auto px-[var(--page-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "au-marquee w-max",
          )}
        >
          {(reduced ? [CONCEPT_CATEGORIES] : [CONCEPT_CATEGORIES, CONCEPT_CATEGORIES]).map(
            (group, g) => (
              <div key={g} className="flex shrink-0 gap-5" aria-hidden={g > 0}>
                {group.map((c) => {
                  const concept = conceptById[c.id];
                  if (!concept) return null;
                  return (
                    <a
                      key={`${g}-${c.id}`}
                      href={`#concept-${c.id}`}
                      tabIndex={g > 0 ? -1 : 0}
                      className="group w-[260px] shrink-0 sm:w-[320px]"
                    >
                      <div
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border"
                        style={{
                          background: concept.palette.bg,
                          borderColor: concept.palette.line,
                        }}
                      >
                        <Image
                          src={concept.hero.src}
                          alt=""
                          fill
                          sizes="320px"
                          className="object-cover transition-transform duration-[var(--dur-editorial)] ease-[var(--ease)] group-hover:scale-[1.04]"
                          style={{ objectPosition: "50% 50%" }}
                        />
                      </div>
                      <p className="mt-3 flex items-baseline justify-between gap-3">
                        <span className="font-display text-xl leading-none">{c.label}</span>
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-grey-deep">
                          Concept
                        </span>
                      </p>
                    </a>
                  );
                })}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
