import type { PracticeId } from "./practices";

/**
 * The portfolio.
 *
 * Every entry is shipped work for a real business: kind: "client".
 *
 * `outcome` is null on every entry. No revenue, conversion rate, testimonial
 * or award has been verified, so none is shown.
 *
 * Client previews are real captures of the running products.
 */

export type ProjectKind = "client";

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
