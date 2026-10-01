import type { Metadata } from "next";
import { site } from "@/config/site";

const SIZE = { width: 1200, height: 630 } as const;

/**
 * Open Graph + Twitter metadata for a page, with its share image.
 *
 * The images are static files in `public/og/` rather than `opengraph-image`
 * routes. Rendered on demand they pulled `next/og` — a 1.3 MB WASM rasteriser,
 * a layout engine and a font — into the Cloudflare Worker and pushed it over
 * the free plan's 3 MB limit, for cards whose text never changes per request.
 * (The generator that drew them is in git history: `src/lib/og-image.tsx`.)
 *
 * A page's `openGraph` replaces the layout's wholesale in Next, so this always
 * returns the complete set — never just the image — and a page that uses it
 * cannot silently lose its title or site name. The relative `image` resolves
 * against `metadataBase`, i.e. the canonical origin.
 */
export function share(
  image: string,
  title: string,
  description: string,
  extra: NonNullable<Metadata["openGraph"]> = { type: "website" },
): Pick<Metadata, "openGraph" | "twitter"> {
  const full = title.includes(site.name) ? title : `${title} · ${site.name}`;
  return {
    openGraph: { siteName: site.name, title: full, description, images: [{ url: image, ...SIZE, alt: title }], ...extra },
    twitter: { card: "summary_large_image", title: full, description, images: [image] },
  };
}
