import type { Copy } from "@/i18n/copy";
import type { MediaAsset } from "../media";

/**
 * The five studio concepts.
 *
 * These are not client projects. There is no client behind any of them, no
 * brief, no budget, no launch and no result. They exist so a business owner
 * can see, before there is a budget conversation, what a site of this kind
 * would actually do for them. Every panel below therefore describes a
 * *capability* — "the guest can see the menu and book a table" — and never a
 * result: no conversion rate, no booking count, no testimonial, no award.
 *
 * Each concept gets its own layout, its own palette and its own interface
 * panels, because a restaurant, a fashion label, a furniture showroom, a car
 * hire desk and a coffee shop do not ask the same question of a website, and
 * must not be shown the same layout.
 *
 * The photography is AUREN's own art direction: crops from one reference
 * frame per concept, chosen for light and composition. The interface around
 * it — the menu, the booking bar, the bag, the enquiry form — is built in this
 * codebase, for these fictional businesses, and borrows nothing from the
 * reference beyond the picture.
 */

export type ShowcaseId = "restaurant" | "fashion" | "showroom" | "roadtrip" | "cafe";

/**
 * A concept's own colour. Allowed to be expressive — this is the artwork, and
 * the AUREN shell around it stays obsidian. Contrast is checked per concept:
 * `ink` on `bg` clears 12:1, `soft` on `bg` clears 5:1, and `accent` is used
 * for fills and rules rather than for small type.
 */
export type ConceptPalette = {
  bg: string;
  panel: string;
  ink: string;
  soft: string;
  line: string;
  accent: string;
  accentInk: string;
};

export type Field = { label: Copy; value: Copy };
export type Row = { label: Copy; value: Copy };

/** A named block of interface, revealed on scroll or on interaction. */
export type Panel = {
  id: string;
  index: string;
  label: Copy;
  note: Copy;
  /** Panels that own a frame of photography. */
  image?: MediaAsset;
  /** Where in the frame to look. Defaults to centre. */
  position?: string;
  /** Named rows — a table, a spec list, a set of options. */
  rows?: Row[];
  /** Solid swatches, for materials and colour choices. */
  swatches?: { hex: string; name: Copy; note?: Copy }[];
};

export type Base = {
  id: ShowcaseId;
  /** Fictional business name. Latin script in every language on purpose —
   *  a brand mark is a brand mark. */
  name: string;
  /** Category in the words a business owner would use. */
  category: Copy;
  /** The one sentence that says what the site does for the business. */
  promise: Copy;
  /** The honest label. Rendered on every presentation, never optional. */
  badge: Copy;
  palette: ConceptPalette;
  /** The statement that opens the presentation. */
  statement: Copy;
  /** Panels, in the order they are revealed. */
  panels: Panel[];
  /** Short list of what a visitor could do on the site. */
  can: Copy[];
  hero: MediaAsset;
};

export type RestaurantConcept = Base & {
  id: "restaurant";
  menu: {
    image: MediaAsset;
    heading: Copy;
    items: { name: Copy; note: Copy; price: string; tag?: Copy }[];
    link: Copy;
  };
  reservation: {
    heading: Copy;
    fields: Field[];
    slots: string[];
    cta: Copy;
    note: Copy;
  };
  location: { image: MediaAsset; heading: Copy; rows: Row[] };
  dishes: MediaAsset[];
};

export type FashionConcept = Base & {
  id: "fashion";
  look: { image: MediaAsset; heading: Copy; body: Copy; price: string; cta: Copy };
  bag: {
    items: { name: Copy; price: string }[];
    total: Copy;
    cta: Copy;
    note: Copy;
  };
  strip: MediaAsset[];
  fitting: { image: MediaAsset; heading: Copy; body: Copy; points: Copy[] };
};

export type ShowroomConcept = Base & {
  id: "showroom";
  rooms: { image: MediaAsset; name: Copy; note: Copy }[];
  materials: { hex: string; name: Copy; note: Copy }[];
  pieces: { image: MediaAsset; name: Copy; price: string }[];
  inquiry: { heading: Copy; fields: Field[]; cta: Copy; note: Copy };
  gallery: MediaAsset[];
};

export type RoadtripConcept = Base & {
  id: "roadtrip";
  booking: {
    heading: Copy;
    fields: Field[];
    categories: { name: Copy; spec: Copy; price: string; note?: Copy }[];
    cta: Copy;
    note: Copy;
    whatsapp: Copy;
  };
  coverage: { image: MediaAsset; name: Copy; note: Copy }[];
  reassurance: Row[];
};

export type CafeConcept = Base & {
  id: "cafe";
  signature: { image: MediaAsset; name: Copy; note: Copy; rows: Row[] };
  /** Baked goods. The note is one line — a bakery board does not run. */
  pastries: { image: MediaAsset; name: Copy; note: Copy; price: string }[];
  /** Opening hours, one row per day grouping. */
  hours: { day: Copy; open: string }[];
  places: { name: Copy; address: Copy }[];
};

export type Concept =
  | RestaurantConcept
  | FashionConcept
  | ShowroomConcept
  | RoadtripConcept
  | CafeConcept;
