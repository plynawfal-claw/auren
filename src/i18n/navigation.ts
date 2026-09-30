import { createElement, type ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  // English lives at `/`, not `/en`. The ranking pages are the English ones,
  // so they get the clean canonical URLs and never carry a locale segment.
  localePrefix: "as-needed",
  // Never sniff Accept-Language. A French-browser visitor landing on `/` must
  // see `/` — a 307 to `/fr` on every cold crawl would split the entity and
  // confuse both crawlers and generative retrievers.
  localeDetection: false,
});

const navigation = createNavigation(routing);

// Next 16's segment prefetch can request an unprefixed English RSC segment
// after switching from a prefixed locale. The page itself navigates correctly,
// but that speculative request returns a 404 and wastes a network round trip.
// Keep navigation client-side while fetching only the route the visitor chooses.
export function Link(props: ComponentProps<typeof navigation.Link>) {
  return createElement(navigation.Link, { prefetch: false, ...props });
}

export const { redirect, usePathname, useRouter, getPathname } = navigation;
