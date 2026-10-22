"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { locales, localeLabel, localeShortLabel, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { localesFor } from "@/i18n/translated";

/**
 * Language switcher.
 *
 * Three locales ship, and the choice is remembered.
 *
 * Persistence is a first-party cookie rather than `localStorage`, and that is
 * not a detail. The locale has to be known on the *server*, because the HTML
 * element's `lang` and `dir` are rendered from it — an Arabic visitor served
 * `dir="ltr"` for one paint, then flipped by a script, gets a full-screen
 * reflow of a page they are already reading. A cookie is the only storage the
 * proxy can read before it renders, so it is the only one that can avoid that.
 *
 * The active locale arrives as a prop from the server layout rather than being
 * read from `document.documentElement.lang` during render. That distinction is
 * the whole component: reading the document in render produces a different tree
 * on the server and the client, which React reports as a hydration mismatch and
 * which leaves the "you are here" marker on the wrong code.
 *
 * Three more details that are easy to undo by accident:
 *   - `usePathname` returns the path with the locale prefix already stripped, so
 *     switching keeps the visitor on the page they were reading. A language
 *     control that dumps everyone on the homepage is not a language control.
 *   - the codes are Latin (`EN` / `FR` / `AR`) even for Arabic. A switcher has to
 *     stay readable in the reading direction it is being used *from*; a mirrored
 *     code nobody can identify is not a control.
 *   - the switcher is itself `dir="ltr"`. In an Arabic layout the three codes
 *     must stay in the order a person reads a list of codes, and the `/`
 *     separators must not jump to the other side.
 */
export function LocaleSwitcher({
  locale,
  className,
}: {
  /** The locale being displayed, threaded down from the server layout. */
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  // A French-only search page has no English or Darija twin; switching from
  // it leads to that language's homepage instead of a 404.
  const available = localesFor(pathname);

  return (
    <nav
      aria-label="Language"
      dir="ltr"
      className={cn("flex items-center", className)}
    >
      {locales.map((option, i) => (
        <span key={option} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5 text-line-strong">
              /
            </span>
          )}
          <Link
            href={available.includes(option) ? pathname : "/"}
            locale={option}
            hrefLang={option}
            // The active locale is marked semantically, not by colour alone.
            aria-current={option === locale ? "true" : undefined}
            title={localeLabel[option]}
            // The cookie is written on the server, in the proxy, whenever a
            // request arrives for a prefixed locale. A click here is a
            // navigation, so the redirect it causes is the moment the choice
            // is recorded — no client script, no effect, nothing to run late.
            className={cn(
              "px-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors duration-[var(--dur)]",
              option === locale ? "text-mineral" : "text-grey-deep hover:text-silver",
            )}
          >
            {localeShortLabel[option]}
            <span className="sr-only"> — {localeLabel[option]}</span>
          </Link>
        </span>
      ))}
    </nav>
  );
}
