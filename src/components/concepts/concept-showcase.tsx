import type { Concept, ShowcaseId } from "@/content/concepts/types";
import type { Locale } from "@/i18n/config";
import { CafeShowcase } from "./cafe-showcase";
import { FashionShowcase } from "./fashion-showcase";
import { RestaurantShowcase } from "./restaurant-showcase";
import { RoadtripShowcase } from "./roadtrip-showcase";
import { ShowroomShowcase } from "./showroom-showcase";

/**
 * The switch.
 *
 * Five concepts, five compositions, one entry point. The union type in
 * `content/concepts/types.ts` is what makes this exhaustive at compile time:
 * add a sixth concept and this function stops type-checking until it has been
 * given a layout, which is the moment to decide what that layout is — rather
 * than discovering afterwards that it was poured into the restaurant's.
 */
export function ConceptShowcase({
  concept,
  locale,
}: {
  concept: Concept;
  locale: Locale;
}) {
  switch (concept.id) {
    case "restaurant":
      return <RestaurantShowcase concept={concept} locale={locale} />;
    case "fashion":
      return <FashionShowcase concept={concept} locale={locale} />;
    case "showroom":
      return <ShowroomShowcase concept={concept} locale={locale} />;
    case "roadtrip":
      return <RoadtripShowcase concept={concept} locale={locale} />;
    case "cafe":
      return <CafeShowcase concept={concept} locale={locale} />;
  }
}

export type { ShowcaseId };
