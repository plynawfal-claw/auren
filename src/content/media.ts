import manifest from "./media-manifest.json";

/**
 * Media catalogue for the studio concepts.
 *
 * Every frame is a crop taken from one reference photograph or capture and
 * art-directed to the exact role it plays in a composition. Two rules
 * produced this file:
 *
 *   1. Nothing is stretched. Every `ratio` below is the real pixel ratio of
 *      the file, and every consumer declares its own box plus an
 *      `object-position` — so the crop the visitor sees is chosen in CSS,
 *      not by resampling the file twice.
 *   2. No reference branding survives. The crops are photography only: no
 *      wordmarks, no prices, no interface chrome from the source. The menus,
 *      booking bars and product cards on screen are AUREN's own interface.
 *
 * `tint` is the eight-pixel average of the frame. It is painted behind the
 * image so a slow connection sees the colour of what is arriving rather than
 * a black rectangle, and it doubles as the concept's own colour note.
 */
export type MediaAsset = {
  src: string;
  width: number;
  height: number;
  /** Real width / height. Never round — a rounding error here is a stretch. */
  ratio: number;
  /** Average colour, used as the loading background. */
  tint: string;
};

const tree = manifest as unknown as Record<string, Record<string, MediaAsset>>;

function group(slug: string) {
  return tree[slug] as Record<string, MediaAsset>;
}

export const restaurantMedia = group("restaurant-concept");
export const fashionMedia = group("fashion-concept");
export const showroomMedia = group("showroom-concept");
export const roadtripMedia = group("roadtrip-concept");
export const cafeMedia = group("cafe-concept");

export type ConceptSlug =
  | "restaurant-concept"
  | "fashion-concept"
  | "showroom-concept"
  | "roadtrip-concept"
  | "cafe-concept";

export const mediaByConcept: Record<ConceptSlug, Record<string, MediaAsset>> = {
  "restaurant-concept": restaurantMedia,
  "fashion-concept": fashionMedia,
  "showroom-concept": showroomMedia,
  "roadtrip-concept": roadtripMedia,
  "cafe-concept": cafeMedia,
};
