"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { projectBySlug } from "@/content/projects";
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
  { label: "Restaurants", slug: "restaurant-meridian" },
  { label: "Fashion", slug: "fashion-atelier-nord" },
  { label: "Online shops", slug: "tagpet" },
  { label: "Home & interiors", slug: "showroom-obra" },
  { label: "Apps", slug: "docteur-plante" },
  { label: "Local trades", slug: "promostore-alu" },
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
                      {p.kind === "concept" ? "Concept" : "Client"}
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
