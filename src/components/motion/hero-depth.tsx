"use client";

import { useEffect, useRef } from "react";

/**
 * Hero depth.
 *
 * The hero's composition is approved and must not change — this adds only a
 * shallow camera. On a fine pointer the content block tilts at most 2.5 degrees
 * toward the cursor, smoothed with gsap.quickTo, while its layers sit at fixed
 * translateZ depths so the tilt reads as parallax rather than as a card flip.
 *
 * Touch gets the same dimensionality from scroll instead of the pointer: the
 * block drifts up a few pixels and its depth eases as the hero leaves the
 * viewport — transform and opacity only, the cheapest motion there is, so the
 * mobile hero still has a foreground and a background instead of going flat.
 *
 * It never registers under reduced motion, never fetches GSAP on a device that
 * can't use it, and the text it carries stays real server-rendered HTML —
 * children render on the server exactly as before.
 */
export function HeroDepth({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let cancelled = false;
    let frame = 0;
    let toX: ((v: number) => void) | undefined;
    let toY: ((v: number) => void) | undefined;
    let cleanupFns: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      gsap.set(el, { transformPerspective: 1200, transformStyle: "preserve-3d" });

      if (fine) {
        // Pointer camera (desktop).
        let targetX = 0;
        let targetY = 0;
        const flush = () => {
          frame = 0;
          toX?.(targetX);
          toY?.(targetY);
        };
        toX = gsap.quickTo(el, "rotationX", { duration: 1.1, ease: "power3.out" });
        toY = gsap.quickTo(el, "rotationY", { duration: 1.1, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          targetY = nx * 5;
          targetX = -ny * 5;
          if (!frame) frame = requestAnimationFrame(flush);
        };
        const onLeave = () => {
          targetX = 0;
          targetY = 0;
          if (!frame) frame = requestAnimationFrame(flush);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        cleanupFns = () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
        };
      } else {
        // Scroll camera (touch). The hero recedes as it leaves the viewport.
        const onScroll = () => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            const h = el.offsetHeight || 1;
            const p = Math.min(1, Math.max(0, window.scrollY / h));
            gsap.set(el, { y: p * 28, rotationX: p * 4, opacity: 1 - p * 0.18 });
          });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanupFns = () => window.removeEventListener("scroll", onScroll);
      }
    })();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      cleanupFns?.();
    };
  }, []);

  return (
    <div ref={ref} className="relative [transform-style:preserve-3d]">
      {children}
    </div>
  );
}
