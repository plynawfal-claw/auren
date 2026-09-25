import type { PracticeId } from "./practices";

/**
 * The portfolio.
 *
 * Two kinds of entry, and the distinction is never blurred:
 *
 *   kind: "client"  — shipped work for a real business.
 *   kind: "concept" — a studio exploration. No client, no brief, no results.
 *                     Labelled as a concept everywhere it appears.
 *
 * `outcome` is null on every entry. No revenue, conversion rate, testimonial
 * or award has been verified, so none is shown — on either kind.
 *
 * Client previews are real captures of the running products. Concept previews
 * are captures of pages this studio designed and built for the purpose.
 */

export type ProjectKind = "client" | "concept";

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  year: number;
  /** Plain-language category a business owner would recognise. */
  industry: string;
  practices: PracticeId[];
  /** Shown on the homepage orbit. */
  featured: boolean;
  /** One sentence, no jargon. Opens the case study and is the meta description. */
  tagline: string;
  site: {
    desktop: string;
    mobile: string;
    /** Shown in the browser frame. Concepts get a plain name, never a fake URL. */
    label: string;
    alt: string;
  };
  /** Each project's own motion language in the orbit. */
  motion: "scan" | "scroll" | "panels" | "menu" | "crop" | "spatial";
  challenge: string;
  experience: string[];
  system: string[];
  delivered: string[];
  stack: string[];
  languages?: string[];
  outcome: null;
  links: { live?: string };
};

export const projects: readonly Project[] = [
  {
    slug: "docteur-plante",
    title: "Docteur Plante",
    kind: "client",
    year: 2026,
    industry: "Mobile app",
    practices: ["experiences", "systems"],
    featured: true,
    tagline:
      "An app that tells you what your plant needs — photograph it, and it answers. In four languages, and it still works with no signal.",
    site: {
      desktop: "/work/docteur-plante/site-desktop.jpg",
      mobile: "/work/docteur-plante/site-mobile.jpg",
      label: "docteur plante",
      alt: "Docteur Plante showing its kitchen-garden guides, one card per crop",
    },
    motion: "scan",
    challenge:
      "Almost every plant guide online is written for cold northern gardens. It is also written in languages a lot of people here do not read easily, and it assumes you have signal — which a rooftop terrace often does not.",
    experience: [
      "Point your phone at a plant and it tells you what it is. That is the whole first step, and nothing stands in front of it.",
      "Your garden, your watering calendar and your notes are all there without making an account. Signing in only saves a copy so you can pick it up on another phone.",
      "French, Darija, Arabic and Spanish from day one — not a translation bolted on later.",
    ],
    system: [
      "Everything keeps working with no connection. The app is not a website in a costume.",
      "The plant assistant is optional and has a hard daily limit, so the running cost can never run away.",
      "Nothing sensitive is stored in the phone. It all stays on our side.",
    ],
    delivered: [
      "Mobile app you can install from the browser",
      "Plant identification from a photo",
      "Care journal and watering calendar",
      "Kitchen-garden guides",
      "Optional assistant with a spending ceiling",
      "Four languages",
      "Optional account to sync",
    ],
    stack: ["Vite", "React", "Node.js", "PlantNet", "OpenRouter"],
    languages: ["French", "Moroccan Darija", "Arabic", "Spanish"],
    outcome: null,
    links: {},
  },
  {
    slug: "tagpet",
    title: "TagPet",
    kind: "client",
    year: 2026,
    industry: "Online shop",
    practices: ["experiences", "creative", "growth", "systems"],
    featured: true,
    tagline:
      "A Moroccan pet brand rebuilt from scratch — the shop, the look, and every advert in it, made in-house.",
    site: {
      desktop: "/work/tagpet/site-desktop.jpg",
      mobile: "/work/tagpet/site-mobile.jpg",
      label: "tagpet.ma",
      alt: "TagPet product page for engraved pet bowls with its size and portrait chooser",
    },
    motion: "scroll",
    challenge:
      "Selling an 89-dirham object online, to someone paying the courier at the door, means the page has to do the job a good shop assistant would — in Arabic, on a phone, in about a second. The old version looked like a marketplace listing.",
    experience: [
      "A darker, quieter look, so the product photography carries the page instead of fighting it.",
      "Arabic first, properly — right down to which way the page reads and which way things move.",
      "You choose the shape, the metal and the size by looking at them. The price never changes.",
    ],
    system: [
      "We wrote the look down before making anything: materials, finishes, lighting, and what we would never shoot. Every advert was measured against it.",
      "The films are made from the same design as the shop, so an advert and the page it leads to always look like the same company.",
      "We kept a record of every image made — what it cost, and why anything rejected was rejected.",
      "The shop knows which advert brought each order, and the total is confirmed on our side rather than trusted from the browser.",
    ],
    delivered: [
      "Online shop in three languages",
      "Pay-on-delivery checkout",
      "Admin area and product catalogue",
      "Written look-and-feel guide",
      "Full advert library — film, posters, stills",
      "Logo and engraved lockups",
      "Advert tracking across the whole funnel",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Supabase", "Remotion"],
    languages: ["Arabic", "French"],
    outcome: null,
    links: { live: "https://tagpet.ma" },
  },
  {
    slug: "promostore-alu",
    title: "PromoStore Alu",
    kind: "client",
    year: 2026,
    industry: "Local trade business",
    practices: ["experiences", "creative", "growth"],
    featured: true,
    tagline:
      "A Rabat aluminium workshop given a name people remember and a website that finally turns up in search.",
    site: {
      desktop: "/work/promostore-alu/site-desktop.jpg",
      mobile: "/work/promostore-alu/site-mobile.jpg",
      label: "promostore-alu",
      alt: "PromoStore Alu homepage showing custom aluminium glazing on a contemporary villa",
    },
    motion: "panels",
    challenge:
      "Custom joinery sells on trust and on being nearby. The workshop had no mark and nothing findable online, so every enquiry depended on somebody already knowing them.",
    experience: [
      "The logo came out of the product itself — the profile of a window frame, the cut of a corner joint — rather than a generic builder look.",
      "Big architectural photography and a short, calm page, so the work does the talking.",
      "A quote request that goes straight to WhatsApp, because that is where this audience actually replies.",
    ],
    system: [
      "Built light on purpose. Everything moves smoothly without loading a heavy site, which matters on a phone on mobile data.",
      "Set up so Google understands exactly what the business is, where it is and what it does.",
      "Every colour checked for readability before it went near the page.",
    ],
    delivered: [
      "Logo and identity — eleven marks, light and dark",
      "Identity presentation page",
      "Website with service pages",
      "Search setup for the local area",
      "Photography direction",
      "Quote request flow",
    ],
    stack: ["Next.js 15", "React 19", "Tailwind CSS 4"],
    languages: ["French"],
    outcome: null,
    links: {},
  },
  {
    slug: "restaurant-meridian",
    title: "Meridián",
    kind: "concept",
    year: 2026,
    industry: "Restaurant",
    practices: ["experiences", "creative"],
    featured: true,
    tagline:
      "A studio concept for a Mediterranean restaurant in Valencia — a short menu, a warm room, and a table booked in two taps.",
    site: {
      desktop: "/work/restaurant-meridian/site-desktop.jpg",
      mobile: "/work/restaurant-meridian/site-mobile.jpg",
      label: "concept · restaurant",
      alt: "Meridián restaurant concept: a grilled fish on a warm sunlit table beside the booking panel",
    },
    motion: "menu",
    challenge:
      "Most restaurant websites are a PDF menu and a phone number. The room, the cooking and the reason to come are nowhere on the page, and booking a table is the hardest thing on it.",
    experience: [
      "The food is the first thing you see, photographed the way the room actually looks at that hour.",
      "The menu is written as a short story about the market rather than printed as a list.",
      "Booking sits in the header, in the hero and at the end. On a phone it is never more than one tap away.",
      "Opening hours are on the first screen, because that is the single most looked-for thing on a restaurant site.",
    ],
    system: [
      "Built to open fast on a phone outside the restaurant, on whatever signal is available.",
      "Written in Spanish first.",
      "Ready to connect to whichever booking service the restaurant already uses.",
    ],
    delivered: [
      "Art direction and identity",
      "Homepage and menu design",
      "Booking flow",
      "Mobile design",
      "Editorial photography direction",
    ],
    stack: ["Concept", "HTML", "CSS"],
    languages: ["Spanish"],
    outcome: null,
    links: {},
  },
  {
    slug: "fashion-atelier-nord",
    title: "Atelier Nord",
    kind: "concept",
    year: 2026,
    industry: "Fashion e-commerce",
    practices: ["experiences", "creative", "growth"],
    featured: true,
    tagline:
      "A studio concept for an international fashion label — a collection presented like a lookbook, not a product grid.",
    site: {
      desktop: "/work/fashion-atelier-nord/site-desktop.jpg",
      mobile: "/work/fashion-atelier-nord/site-mobile.jpg",
      label: "concept · fashion",
      alt: "Atelier Nord fashion concept: an oversized collection title above four drawn garments with prices",
    },
    motion: "crop",
    challenge:
      "Most fashion shops look like the same template with different photographs in it. The clothes arrive as a grid of thumbnails, and nothing about the page says who the label is.",
    experience: [
      "The season's name is the biggest thing on the page. The collection reads as an edition, with a date.",
      "Garments are drawn rather than photographed — an illustrated index, which is a real convention in fashion and lets a collection be presented before the shoot exists.",
      "Price sits quietly under the name. No badges, no countdowns, no discount noise.",
    ],
    system: [
      "Designed so the product page, the bag and the checkout keep the same calm as the collection page.",
      "Built to stay fast with large imagery, which is where most fashion sites lose people.",
    ],
    delivered: [
      "Art direction and identity",
      "Collection and product page design",
      "Illustrated garment index",
      "Bag and checkout direction",
      "Mobile design",
    ],
    stack: ["Concept", "HTML", "CSS"],
    outcome: null,
    links: {},
  },
  {
    slug: "showroom-obra",
    title: "Obra",
    kind: "concept",
    year: 2026,
    industry: "Interiors and showroom",
    practices: ["experiences", "creative"],
    featured: true,
    tagline:
      "A studio concept for a furniture and interiors showroom — materials you can almost feel, and a visit you can book.",
    site: {
      desktop: "/work/showroom-obra/site-desktop.jpg",
      mobile: "/work/showroom-obra/site-mobile.jpg",
      label: "concept · interiors",
      alt: "Obra interiors concept: a drawn room elevation beside a row of material samples",
    },
    motion: "spatial",
    challenge:
      "Showrooms sell things people want to touch. A website that shows them as catalogue thumbnails removes the only advantage the showroom has.",
    experience: [
      "Materials get their own row, named and swatched, because that is what the conversation in the showroom is actually about.",
      "Rooms are drawn as elevations rather than photographed, so a collection can be shown before it is built.",
      "Booking a visit is the main action on the page, not a phone number in the footer.",
    ],
    system: [
      "Built to carry large imagery of finished projects later without slowing down.",
      "Structured so collections and materials can be added by the showroom itself.",
    ],
    delivered: [
      "Art direction and identity",
      "Homepage and collection design",
      "Material library",
      "Showroom booking flow",
      "Mobile design",
    ],
    stack: ["Concept", "HTML", "CSS", "SVG"],
    outcome: null,
    links: {},
  },
  {
    slug: "kutia",
    title: "Kutia",
    kind: "client",
    year: 2026,
    industry: "Online shop",
    practices: ["experiences", "creative", "growth"],
    // Off the homepage by decision — it is real work and stays in the archive
    // at /work, but it is not one of the six the studio leads with.
    featured: false,
    tagline:
      "A one-product shop in Darija and French, built for people arriving from a social advert and paying at the door.",
    site: {
      desktop: "/work/kutia/site-desktop.jpg",
      mobile: "/work/kutia/site-mobile.jpg",
      label: "kutia",
      alt: "Kutia single-product storefront in Darija showing the stainless board and its two sizes",
    },
    motion: "scroll",
    challenge:
      "A one-product shop has a single page to explain the object, earn enough trust for a stranger to hand over their address, and load fast enough that they are still there when it finishes.",
    experience: [
      "Written in Darija first, French second — the order the audience actually reads in.",
      "The photograph is there immediately and the video only loads after, so nobody stares at a black rectangle.",
      "Choosing a size carries the price with it, and an order bar follows you down the page.",
    ],
    system: [
      "The price is confirmed on our side, never taken from the browser.",
      "The order is written down before anything else can fail.",
      "No reviews on the page. There were none, and inventing them is fraud.",
    ],
    delivered: [
      "Shop in Darija and French",
      "Pay-on-delivery ordering",
      "WhatsApp confirmation",
      "Product film and photography",
      "Logo and launch set",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Supabase"],
    languages: ["Moroccan Darija", "French"],
    outcome: null,
    links: {},
  },
] as const;

/** Homepage selection, in order. */
export const featuredProjects = projects.filter((p) => p.featured);

export const projectBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
) as Record<string, Project>;

export function nextProject(slug: string) {
  const list = projects;
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return list[(i + 1) % list.length];
}
