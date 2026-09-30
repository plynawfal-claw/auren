"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Wordmark } from "@/components/ui/wordmark";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { nav } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { c, tr } from "@/i18n/copy";

/**
 * Site header.
 *
 * The mobile header holds exactly two things — the wordmark and the menu
 * control — and its height never changes. The previous version shrank its
 * padding on scroll, which on a phone moved the wordmark into the content
 * beneath it. A header that resizes as you read is a header that collides.
 *
 * Chrome is a translucent layer with content passing underneath, and the
 * boundary is a fading edge rather than a hard 1px rule (apple-design §12).
 *
 * The language control lives in the desktop nav beside the actions, and at the
 * foot of the mobile menu rather than in the bar itself — three codes do not
 * fit next to a wordmark on a 320px screen, and a control you have to open a
 * menu to reach is a control nobody uses. The locale arrives as a prop from
 * the server layout so the active code is correct in the first paint.
 */
const HEADER_H = "h-16 md:h-20";

/**
 * True when the current route belongs to this nav section.
 *
 * `usePathname` from next-intl returns the locale-relative path — `/work` on
 * both `/work` and `/fr/work` — so no prefix stripping is needed.
 * A section is active on its index and any sub-route (/work/tagpet → Work).
 */
function isSection(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLabel(href: string, locale: Locale, fallback: string) {
  const labels: Record<string, ReturnType<typeof c>> = {
    "/work": c("Work", "Projets", "المشاريع"),
    "/services": c("Capabilities", "Expertises", "الخدمات"),
    "/studio": c("Studio", "Studio", "الستوديو"),
    "/insights": c("Insights", "Analyses", "أفكار"),
  };
  return labels[href] ? tr(locale, labels[href]) : fallback;
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes the menu — including browser back/forward, which a
  // Link's onClick never sees. Adjusting state during render is React's own
  // recommendation here; an effect would render the stale open menu first.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("auren:menu", { detail: open }));
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Focus must come back to the control that opened the menu, or a
      // keyboard user is dropped at the top of the document.
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.dispatchEvent(new CustomEvent("auren:menu", { detail: false }));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-[var(--dur)] ease-[var(--ease)]",
          scrolled && !open && "bg-ink/70 backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div dir="ltr" className={cn("shell flex items-center justify-between", HEADER_H)}>
          <Link href="/" className="group text-mineral" aria-label="AUREN — home">
            <Wordmark />
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 block h-px transition-all duration-[var(--dur)] ease-[var(--ease)]",
                pathname === "/" ? "w-full bg-lume/50" : "w-0 group-hover:w-full bg-mineral/30",
              )}
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = isSection(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
                    active ? "text-mineral" : "text-silver hover:text-mineral",
                  )}
                >
                  {navLabel(item.href, locale, item.label)}
                  {/* Active dot replaces the hover underline when on this page. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-[var(--dur)] ease-[var(--ease)]",
                      active ? "scale-100 bg-lume opacity-100" : "scale-0 bg-mineral opacity-0",
                    )}
                  />
                  {!active && (
                    <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-mineral transition-all duration-[var(--dur)] ease-[var(--ease)] group-hover:w-full" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={cn(
                "magnetic-btn rounded-full px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-transform duration-[var(--dur)] ease-[var(--ease)] active:scale-[0.97] active:duration-[120ms]",
                isSection(pathname, "/contact")
                  ? "bg-lume text-ink hover:bg-lume/90"
                  : "bg-mineral text-ink hover:bg-mineral-hi",
              )}
            >
              {tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}
            </Link>
            <LocaleSwitcher locale={locale} />
          </nav>

          {/* Mobile: the only other thing in the header. */}
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? tr(locale, c("Close menu", "Fermer le menu", "سدّ المينيو")) : tr(locale, c("Open menu", "Ouvrir le menu", "حلّ المينيو"))}</span>
            <span className="relative block h-2.5 w-6" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-mineral transition-all duration-[var(--dur)] ease-[var(--ease)]",
                  open ? "top-1 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-mineral transition-all duration-[var(--dur)] ease-[var(--ease)]",
                  open ? "top-1 -rotate-45" : "top-2.5",
                )}
              />
            </span>
          </button>
        </div>

        {/* Fading edge instead of a hard divider, and only once content is
            actually passing underneath. Absolutely positioned so it hangs
            below the bar rather than extending the header's box — in flow it
            made a 24px invisible strip that swallowed taps on whatever was
            scrolling beneath it. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-ink/50 to-transparent transition-opacity duration-[var(--dur)]",
            scrolled && !open ? "opacity-100" : "opacity-0",
          )}
        />
      </header>

      {/* Full-surface menu. It covers rather than pushes, so nothing below can
          be overlapped or clipped by it. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        className={cn(
          "fixed inset-0 z-30 bg-ink transition-opacity duration-300 ease-[var(--ease)] md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav
          className={cn("shell flex flex-col justify-center", "h-[100svh] pb-24 pt-20")}
          aria-label="Primary, mobile"
        >
          <div className="mobile-menu-mark pointer-events-none absolute inset-x-0 top-[18%] select-none text-center font-display text-[clamp(5rem,27vw,10rem)] leading-none tracking-[-0.12em] text-mineral" aria-hidden="true">A.</div>
          {nav.map((item, i) => {
            const active = isSection(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                style={{ transitionDelay: `${60 + i * 45}ms` }}
                className={cn(
                  "relative border-b border-line py-5 font-display text-[clamp(2rem,9vw,3rem)] leading-none text-mineral",
                  "transition-all duration-500 ease-[var(--ease)]",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                {navLabel(item.href, locale, item.label)}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-6 start-0 h-px w-10 bg-lume"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: `${60 + nav.length * 45}ms` }}
            className={cn(
              "mt-10 rounded-full bg-mineral px-6 py-4 text-center font-mono text-xs uppercase tracking-[0.16em] text-ink",
              "transition-all duration-500 ease-[var(--ease)] active:scale-[0.97]",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            {tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}
          </Link>

          <LocaleSwitcher
            locale={locale}
            className="mt-12 justify-center border-t border-line pt-8 md:hidden"
          />
        </nav>
      </div>
    </>
  );
}
