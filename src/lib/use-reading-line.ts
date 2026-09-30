"use client";

import { useCallback, useEffect, useEffectEvent, useRef, type RefObject } from "react";
import { dbgMark } from "@/lib/debug";

/** How far a visitor has to scroll after a tap before scroll takes over again. */
const TAP_HOLD_PX = 160;

/**
 * Which list item is being read, for sections whose visual is pinned above
 * the list on a phone.
 *
 * On desktop these sections pin the visual beside the list and respond to
 * hover. On a phone the visual sat below (or above) the list and scrolled
 * away, so every state change happened off-screen — the section's one motion
 * idea was never seen, and a tap looked like it did nothing. With the visual
 * pinned, the item sitting just under it is the one it should show.
 *
 * Deliberately NOT switched off under reduced motion. Which item is showing is
 * content, not motion — the transitions between states already honour the
 * preference on their own. Gating this on it froze both sections on the first
 * item for every iPhone with Reduce Motion on, which is what the physical
 * device reported while the emulator (preference off) looked fine.
 *
 * A scroll listener rather than an IntersectionObserver: the edge that matters
 * is the pinned visual's bottom, which moves with its height, and an
 * observer's rootMargin would have to be rebuilt on every iOS toolbar resize
 * to follow it. Geometry is read fresh on every frame it runs, so an address
 * bar collapsing mid-scroll can never leave a stale measurement behind.
 *
 * Returns `hold`: call it when a tap picks an item explicitly. The tap wins
 * until the visitor has scrolled `TAP_HOLD_PX` from where they tapped, then
 * scroll drives again — a tap never switches the section off for good.
 */
export function useReadingLine(
  enabled: boolean,
  stageRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLElement | null>,
  onActive: (index: number) => void,
) {
  const emit = useEffectEvent(onActive);
  const heldAt = useRef<number | null>(null);

  useEffect(() => {
    const tag = listRef.current?.className.split(" ")[0] || "list";
    dbgMark("reading-line:enabled", { tag, enabled });
    if (!enabled) return;
    let frame = 0;
    let scrolls = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      if (heldAt.current !== null) {
        if (Math.abs(window.scrollY - heldAt.current) < TAP_HOLD_PX) return;
        heldAt.current = null;
      }
      const stage = stageRef.current;
      const list = listRef.current;
      if (!stage || !list) return;
      const listBox = list.getBoundingClientRect();
      if (listBox.bottom < 0 || listBox.top > window.innerHeight) return;

      // The first item whose heading is fully clear of the pinned visual —
      // the one sitting right under it. Once all have passed, the last.
      const stageBottom = stage.getBoundingClientRect().bottom;
      const items = Array.from(list.children);
      const next = items.findIndex((item) => item.getBoundingClientRect().top >= stageBottom - 4);
      const index = next === -1 ? items.length - 1 : next;
      if (index !== last) {
        dbgMark("reading-line:index", { tag, index, scrolls, stageBottom: Math.round(stageBottom), firstTop: Math.round(items[0]?.getBoundingClientRect().top ?? 0) });
        last = index;
      }
      emit(index);
    };

    const schedule = () => {
      scrolls++;
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const viewport = window.visualViewport;
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    viewport?.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("resize", schedule);
    };
  }, [enabled, stageRef, listRef]);

  return useCallback(() => {
    heldAt.current = window.scrollY;
  }, []);
}
