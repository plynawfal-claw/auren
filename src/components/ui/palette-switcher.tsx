"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  PALETTES,
  applyPalette,
  getPalette,
  getServerPalette,
  resolveInitialPalette,
  setPalette,
  subscribePalette,
} from "@/lib/palette-store";

/**
 * Three real site palettes, shareable with `?palette=` on any route.
 *
 * The state lives in `lib/palette-store.ts`; this component only reads it and
 * writes to it. The read goes through `useSyncExternalStore`, so the server
 * renders "obsidian" and the stored choice arrives after mount without a
 * hydration mismatch — exactly the behaviour the previous effect-based version
 * had, minus the cascading render.
 */
export function PaletteSwitcher() {
  const palette = useSyncExternalStore(subscribePalette, getPalette, getServerPalette);

  useEffect(() => {
    const resolved = resolveInitialPalette();
    applyPalette(resolved);
    if (resolved !== getPalette()) setPalette(resolved);
  }, []);

  return (
    <div
      className="fixed bottom-4 start-4 z-50 flex max-w-fit origin-bottom-start scale-90 items-center gap-1.5 rounded-full border border-line-strong bg-graphite/95 px-2.5 py-1.5 opacity-90 shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-opacity hover:opacity-100 sm:bottom-6 sm:start-6 sm:scale-100 sm:gap-2 sm:px-3 sm:py-2"
      role="group"
      aria-label="Color versions"
    >
      <span className="hidden pr-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-grey sm:inline">
        Color
      </span>
      {PALETTES.map((option) => (
        <button
          key={option.id}
          type="button"
          title={option.name}
          aria-label={`${option.name} color version`}
          aria-pressed={palette === option.id}
          onClick={() => setPalette(option.id, true)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <span
            className="h-5 w-5 rounded-full border border-white/30"
            style={{
              backgroundColor: option.color,
              boxShadow:
                palette === option.id
                  ? `0 0 0 3px var(--color-graphite), 0 0 0 4px ${option.color}`
                  : undefined,
            }}
          />
        </button>
      ))}
    </div>
  );
}

