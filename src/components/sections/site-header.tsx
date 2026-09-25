"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Wordmark } from "@/components/ui/wordmark";
import { nav } from "@/config/site";
import { cn } from "@/lib/cn";

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
 */
const HEADER_H = "h-16 md:h-20";

export function SiteHeader() {
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
        <div className={cn("shell flex items-center justify-between", HEADER_H)}>
          <Link href="/" className="text-mineral" aria-label="AUREN — home">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-mono text-[0.7rem] uppercase tracking-[0.14em] text-silver transition-colors hover:text-mineral"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-mineral transition-all duration-[var(--dur)] ease-[var(--ease)] group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="magnetic-btn rounded-full bg-mineral px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink transition-transform duration-[var(--dur)] ease-[var(--ease)] hover:bg-white active:scale-[0.97] active:duration-[120ms]"
            >
              Start a project
            </Link>
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
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
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
            actually passing underneath. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none h-6 bg-gradient-to-b from-ink/50 to-transparent transition-opacity duration-[var(--dur)]",
            scrolled && !open ? "opacity-100" : "opacity-0",
          )}
        />
      </header>

      {/* Full-surface menu. It covers rather than pushes, so nothing below can
          be overlapped or clipped by it. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-30 bg-ink md:hidden"
      >
        <nav
          className={cn("shell flex flex-col justify-center", "h-[100svh] pb-24 pt-20")}
          aria-label="Primary, mobile"
        >
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${60 + i * 45}ms` }}
              className={cn(
                "border-b border-line py-5 font-display text-[clamp(2rem,9vw,3rem)] leading-none text-mineral",
                "transition-all duration-500 ease-[var(--ease)]",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              {item.label}
            </Link>
          ))}
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
            Start a project
          </Link>
        </nav>
      </div>
    </>
  );
}
