"use client";

import { useEffect } from "react";

/**
 * A one-pixel readout of how far through the document you are.
 *
 * Writes a CSS custom property that drives `scaleX` on a compositor layer —
 * no layout, no paint, one rAF at most per frame.
 */
export function ScrollProgress() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = document.createElement("div");
    el.className = "scroll-progress";
    document.body.appendChild(el);

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      el.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.remove();
    };
  }, []);

  return null;
}
