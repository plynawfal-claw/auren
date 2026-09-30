"use client";

import { useEffect, useSyncExternalStore } from "react";
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
 * The dark / light control — a liquid-glass toggle, not a checkbox.
 *
 * A translucent lens travels a rounded track between the two states. The lens
 * is glass: backdrop blur, a bright inner edge on the side it leans toward,
 * and a soft shadow that lifts it off the track, so it reads as a physical
 * object being slid rather than as a swatch being selected. The motion is a
 * spring, and the lens compresses slightly while it travels, the way a real
 * element would under a thumb.
 *
 * The choice itself lives in `lib/palette-store.ts` (URL + localStorage +
 * `data-palette` on <html>); this component only reads it through
 * `useSyncExternalStore`, so the server renders the default and a stored
 * choice arrives after mount with no hydration mismatch.
 */
export function PaletteSwitcher({
  variant = "page",
  className,
}: {
  /**
   * `page`: the control at the foot of every page, 768px and up.
   * `inline`: a row inside the mobile menu. On a phone the foot of the page
   * sits under Safari's bottom toolbar, so there it lives in the menu instead.
   */
  variant?: "page" | "inline";
  className?: string;
}) {
  const palette = useSyncExternalStore(subscribePalette, getPalette, getServerPalette);
  const isLight = palette === "light";

  useEffect(() => {
    const resolved = resolveInitialPalette();
    applyPalette(resolved);
    if (resolved !== getPalette()) setPalette(resolved);
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark" : "Switch to light"}
      onClick={() => setPalette(isLight ? "obsidian" : "light", true)}
      className={cn(
        variant === "page" && "group fixed bottom-4 start-4 z-50 max-md:hidden sm:bottom-6 sm:start-6",
        variant === "inline" && "group",
        "glass-track relative flex h-11 w-[86px] items-center rounded-full p-1",
        "outline-none transition-transform duration-200 ease-[var(--ease)]",
        "active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-[var(--color-lume)]",
        className,
      )}
    >
      {/* Track glyphs, dimmed — the lens is the bright element. */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[13px]">
        <Moon className={cn("h-3.5 w-3.5 transition-opacity duration-300", isLight ? "opacity-35" : "opacity-0")} />
        <Sun className={cn("h-3.5 w-3.5 transition-opacity duration-300", isLight ? "opacity-0" : "opacity-35")} />
      </span>

      {/* The travelling lens. */}
      <span
        aria-hidden="true"
        className={cn(
          "glass-lens relative z-10 flex h-9 w-9 items-center justify-center rounded-full",
          "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.5,1)]",
          "group-active:scale-x-[0.86] group-active:scale-y-[0.92]",
          // The track is laid out with logical `start`, so in Arabic the lens
          // begins on the right and has to travel left.
          isLight ? "translate-x-[42px] rtl:-translate-x-[42px]" : "translate-x-0",
        )}
      >
        <Moon
          className={cn(
            "absolute h-4 w-4 transition-all duration-300",
            isLight ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Sun
          className={cn(
            "absolute h-4 w-4 transition-all duration-300",
            isLight ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
          )}
        />
      </span>
    </button>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 13.2A8.1 8.1 0 0 1 10.8 4a7.2 7.2 0 1 0 9.2 9.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4 17 17M7 7 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
