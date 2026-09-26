import { cafe } from "./cafe";
import { fashion } from "./fashion";
import type { Concept, ShowcaseId } from "./types";
import { restaurant } from "./restaurant";
import { roadtrip } from "./roadtrip";
import { showroom } from "./showroom";

/**
 * The order of the showcase, and the only place it is written down.
 *
 * Restaurant first because it is the clearest example of a site with a job to
 * do. Fashion second because the label and the product are the whole pitch.
 * Showroom third, the most conventional layout of the five. Roadtrip fourth,
 * where the form is doing the selling. Café last, the smallest, and the one
 * that proves the point: less can still be more.
 */
export const concepts: Concept[] = [restaurant, fashion, showroom, roadtrip, cafe];

export const conceptById: Record<ShowcaseId, Concept> = {
  restaurant,
  fashion,
  showroom,
  roadtrip,
  cafe,
};

export function getConcept(id: string | undefined): Concept | undefined {
  if (!id) return undefined;
  return concepts.find((x) => x.id === id);
}

export type { Concept, ShowcaseId } from "./types";
