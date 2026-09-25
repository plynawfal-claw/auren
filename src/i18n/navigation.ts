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

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
