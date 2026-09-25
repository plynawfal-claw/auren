"use client";

import { useEffect } from "react";

/**
 * Smooth scroll and scroll choreography, sharing one rAF loop.
 *
 * Ported from tagpet/src/components/providers.tsx — the pattern is already
 * proven in production there. The single loop matters: running Lenis on its
 * own rAF and letting ScrollTrigger drive its own is the standard way these
 * two libraries end up a frame apart and jitter.
 *
 * GSAP and Lenis are imported dynamically so neither lands in the initial
 * bundle. Under reduced motion they are never fetched at all.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Marks the document as interactive. Every `.reveal` hides itself only
    // under `.js`, so without this class the page renders fully visible —
    // which is exactly what crawlers and no-JS readers get.
    document.documentElement.classList.add("js");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.15,
      });

      let raf = 0;
      const loop = (time: number) => {
        lenis.raf(time);
        ScrollTrigger.update();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
