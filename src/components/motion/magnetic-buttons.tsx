"use client";

import { useEffect } from "react";

/**
 * Magnetic hover for every `.magnetic-btn` on the page.
 *
 * Ported from promostore-alu/src/components/magnetic-buttons.tsx. Delegated on
 * document rather than bound per button, so the listener count stays fixed no
 * matter how many buttons a route renders, and buttons that appear later are
 * covered without re-binding.
 *
 * Fine pointers only. On touch the button does not drift — a control that
 * moves under a thumb is worse than one that sits still — and the press state
 * in globals.css stands in for the hover instead.
 */
const STRENGTH = 0.26;
const MAX_OFFSET = 11;

export function MagneticButtons() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) {
      // iOS Safari only applies `:active` while some touch listener exists.
      // This one does nothing and is passive, so it can never delay a tap —
      // it just lets the touch press state in globals.css show.
      const noop = () => {};
      document.addEventListener("touchstart", noop, { passive: true });
      return () => document.removeEventListener("touchstart", noop);
    }
    if (reduced) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!active || !pending) return;
      active.style.setProperty("--mx", `${pending.x.toFixed(2)}px`);
      active.style.setProperty("--my", `${pending.y.toFixed(2)}px`);
    };

    const release = (el: HTMLElement) => {
      el.classList.remove("is-magnetic");
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };

    const onMove = (e: PointerEvent) => {
      const target =
        (e.target as Element | null)?.closest<HTMLElement>(".magnetic-btn") ?? null;

      if (target !== active) {
        if (active) release(active);
        active = target;
        if (active) active.classList.add("is-magnetic");
      }
      if (!active) return;

      const r = active.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      pending = {
        x: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx * STRENGTH)),
        y: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy * STRENGTH)),
      };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Scrolling or losing focus must let every button go home, otherwise one
    // can stay stuck mid-pull after the pointer has left the window.
    const releaseAll = () => {
      if (active) release(active);
      active = null;
      pending = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", releaseAll, { passive: true });
    window.addEventListener("blur", releaseAll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", releaseAll);
      window.removeEventListener("blur", releaseAll);
      releaseAll();
    };
  }, []);

  return null;
}
