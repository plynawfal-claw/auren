/**
 * The site's palette store.
 *
 * Two palettes — dark and light. Every component keeps the same contrast
 * hierarchy; the material and the light change, not the content. The interface
 * itself never gains a hue — these are two versions of the same envelope.
 *
 * The choice lives outside React, in three places a component does not own:
 * the URL, localStorage, and `data-palette` on <html>. That is what makes it
 * an external store rather than state — reading it during render is wrong
 * (the server has no URL and no storage) and calling setState from an effect
 * to fetch it is a cascading render for a value React never held.
 *
 * So the store is a module with one mutable object, a listener set, and a
 * `useSyncExternalStore`-shaped read. The server snapshot is always the
 * default, so hydration can never mismatch: the stored choice is applied after
 * mount, once.
 */

export const PALETTES = [
  { id: "obsidian", name: "Dark" },
  { id: "light", name: "Light" },
] as const;

export type Palette = (typeof PALETTES)[number]["id"];

export const DEFAULT_PALETTE: Palette = "obsidian";

const STORAGE_KEY = "auren-palette";

function isPalette(value: string | null): value is Palette {
  return PALETTES.some((palette) => palette.id === value);
}

const listeners = new Set<() => void>();
const state: { current: Palette } = { current: DEFAULT_PALETTE };

export function subscribePalette(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export const getPalette = () => state.current;
export const getServerPalette = () => DEFAULT_PALETTE;

/**
 * Writes the choice onto <html>, which is what the stylesheets read, and tells
 * anything that cannot read CSS — the two WebGL surfaces — to re-read their
 * colours.
 */
export function applyPalette(value: Palette) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.palette = value;
  window.dispatchEvent(new Event("auren:palette-change"));
}

/**
 * Set the palette. `persist` is only true for a deliberate choice: the initial
 * resolution must not write to storage or touch the URL.
 */
export function setPalette(value: Palette, persist = false) {
  state.current = value;
  applyPalette(value);

  if (persist && typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, value);
    const url = new URL(window.location.href);
    url.searchParams.set("palette", value);
    window.history.replaceState(window.history.state, "", url);
  }

  listeners.forEach((listener) => listener());
}

/** The reader's choice: a shared link beats whatever this browser stored. */
export function resolveInitialPalette(): Palette {
  if (typeof window === "undefined") return DEFAULT_PALETTE;

  const fromUrl = new URLSearchParams(window.location.search).get("palette");
  if (isPalette(fromUrl)) return fromUrl;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isPalette(stored) ? stored : DEFAULT_PALETTE;
}
