"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  applyPalette,
  getPalette,
  getServerPalette,
  resolveInitialPalette,
  setPalette,
  subscribePalette,
} from "@/lib/palette-store";
import { cn } from "@/lib/cn";

/**
 * The light / dark control, in the header.
 *
 * Exactly two states. Dark is a charcoal track with a slow orbiting highlight
 * and a raised graphite thumb carrying a crescent; light is a warm off-white
 * track with a drifting sun-glow and a white thumb carrying the sun. The
 * motion lives in `globals.css` (`.theme-toggle*`): a spring glide for the
 * thumb, a crossfade-and-turn between the two icons, and one light sweep
 * across the track at the moment of switching.
 *
 * Switching also adds `theme-switching` to <html> for a few hundred ms, which
 * lets every colour on the page crossfade instead of cutting from black to
 * white. Nothing waits on it — the palette changes immediately and the page
 * stays fully interactive while the colours settle.
 *
 * The choice lives in `lib/palette-store.ts` (URL + localStorage +
 * `data-palette`); the server renders dark and a stored choice arrives after
 * mount without a hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const palette = useSyncExternalStore(subscribePalette, getPalette, getServerPalette);
  const isLight = palette === "light";
  // Bumped on each deliberate switch so the sweep replays exactly once.
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    const resolved = resolveInitialPalette();
    applyPalette(resolved);
    if (resolved !== getPalette()) setPalette(resolved);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm) {
      root.classList.add("theme-switching");
      window.setTimeout(() => root.classList.remove("theme-switching"), 420);
    }
    setSweep((n) => n + 1);
    setPalette(isLight ? "obsidian" : "light", true);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggle}
      data-state={isLight ? "light" : "dark"}
      className={cn("theme-toggle", className)}
    >
      <span aria-hidden="true" className="theme-toggle__ambient" />
      {sweep > 0 && <span key={sweep} aria-hidden="true" className="theme-toggle__sweep" />}
      <span aria-hidden="true" className="theme-toggle__thumb">
        <svg viewBox="0 0 24 24" className="theme-toggle__icon theme-toggle__moon">
          <path d="M19.5 14.2A7.6 7.6 0 0 1 9.8 4.5a7 7 0 1 0 9.7 9.7Z" />
        </svg>
        <svg viewBox="0 0 24 24" className="theme-toggle__icon theme-toggle__sun">
          <circle cx="12" cy="12" r="3.6" />
          <path d="M12 3.5v1.8M12 18.7v1.8M20.5 12h-1.8M5.3 12H3.5M18 6l-1.3 1.3M7.3 16.7 6 18M18 18l-1.3-1.3M7.3 7.3 6 6" />
        </svg>
      </span>
    </button>
  );
}
