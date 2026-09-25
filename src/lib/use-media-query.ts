"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a media query without an effect-plus-setState dance.
 *
 * `serverValue` is what the server renders and what the client renders on its
 * very first pass. Choose it so the pre-hydration output is the conservative
 * one: assume reduced motion, assume a narrow screen. That way the HTML that
 * ships — and the HTML a crawler sees — is the plain, fully-readable layout,
 * and the enhanced version only ever replaces it once the browser has said it
 * can handle it.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
