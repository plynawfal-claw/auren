"use client";

import { useEffect, useRef } from "react";

/**
 * Hero depth.
 *
 * The hero's composition is approved and must not change — this adds only a
 * shallow camera: the content block tilts at most 2.5 degrees toward a fine
 * pointer (1.5 under 768px), smoothed with gsap.quickTo, while its layers sit
 * at fixed translateZ depths so the tilt reads as parallax rather than as a
 * card flip.
 *
 * It never registers on touch, never fetches GSAP under reduced motion, and
 * the text it carries stays real server-rendered HTML — children render on
 * the server exactly as before.
 */
export function HeroDepth({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let toX: ((v: number) => void) | undefined;
    let toY: ((v: number) => void) | undefined;
    let cleanupFns: (() => void) | undefined;

    const flush = () => {
      frame = 0;
      toX?.(targetX);
      toY?.(targetY);
    };

    (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      gsap.set(el, { transformPerspective: 1200, transformStyle: "preserve-3d" });
      toX = gsap.quickTo(el, "rotationX", { duration: 1.1, ease: "power3.out" });
      toY = gsap.quickTo(el, "rotationY", { duration: 1.1, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        const max = window.innerWidth < 768 ? 1.5 : 2.5;
        targetY = nx * max * 2;
        targetX = -ny * max * 2;
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
