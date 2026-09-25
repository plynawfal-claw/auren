"use client";

import { useEffect, useState } from "react";

const PALETTES = [
  { id: "obsidian", name: "Obsidian", color: "#dce6f5" },
  { id: "copper", name: "Copper", color: "#e8ae78" },
  { id: "teal", name: "Teal", color: "#89dfcf" },
] as const;

type Palette = (typeof PALETTES)[number]["id"];
const STORAGE_KEY = "auren-palette";

function isPalette(value: string | null): value is Palette {
  return PALETTES.some((palette) => palette.id === value);
}

function applyPalette(value: Palette) {
  document.documentElement.dataset.palette = value;
  window.dispatchEvent(new Event("auren:palette-change"));
}

/** Three real site palettes, shareable with `?palette=` on any route. */
export function PaletteSwitcher() {
  const [palette, setPalette] = useState<Palette>("obsidian");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("palette");
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const selected = isPalette(fromUrl) ? fromUrl : isPalette(stored) ? stored : "obsidian";
    setPalette(selected);
    applyPalette(selected);
  }, []);

  function select(value: Palette) {
    setPalette(value);
    applyPalette(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    const url = new URL(window.location.href);
    url.searchParams.set("palette", value);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-line-strong bg-graphite/95 px-3 py-2 shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-6 sm:left-6"
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
          onClick={() => select(option.id)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <span
            className="h-5 w-5 rounded-full border border-white/30"
            style={{
              backgroundColor: option.color,
              boxShadow: palette === option.id ? `0 0 0 3px var(--color-graphite), 0 0 0 4px ${option.color}` : undefined,
            }}
          />
        </button>
      ))}
    </div>
  );
}
