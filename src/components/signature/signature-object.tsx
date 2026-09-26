"use client";

import { useEffect, useRef, useState } from "react";
import { createSignature, type SignatureHandle } from "./signature-shader";
import { addTicker, createSpring } from "@/lib/spring";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

/**
 * The signature object, in the hero.
 *
 * The CPU side holds exactly two springs and one ticker:
 *
 *   - the pointer, mapped to -1..1 across the viewport, pulls the light and
 *     rotates the camera. Pointer values go straight into GL uniforms, never
 *     into React state — a pointermove handler calling setState would
 *     re-render this subtree sixty times a second.
 *   - the scroll, mapped to `u_unfold`. The section's offset and height are
 *     measured on mount and on resize rather than read from
 *     getBoundingClientRect every frame, so scrolling never forces a synchronous
 *     layout inside the animation loop.
 *
 * Nothing here runs on a phone, under reduced motion, or without WebGL. In all
 * three cases the component renders the CSS sculpture instead — a real
 * composition rather than an empty box, because over half the traffic will see
 * it.
 */
export function SignatureObject({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  // Conservative server snapshots: assume reduced motion and a narrow screen,
  // so the HTML that ships carries the static composition.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const wide = useMediaQuery("(min-width: 768px)", false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || reduced || !wide) return;

    const handle: SignatureHandle | null = createSignature(canvas);
    if (!handle) return;
    setLive(true);

    const onPalette = () => {
      const styles = getComputedStyle(canvas);
      handle.setColors(
        styles.getPropertyValue("--color-ink").trim() || "#0a0b0d",
        styles.getPropertyValue("--color-lume").trim() || "#dce6f5",
      );
    };
    window.addEventListener("auren:palette-change", onPalette);

    const sx = createSpring(0, { damping: 1, response: 1.1 });
    const sy = createSpring(0, { damping: 1, response: 1.1 });
    const unfold = createSpring(0, { damping: 1, response: 0.75 });

    // Measured on mount and on resize, never read per frame: a
    // getBoundingClientRect inside the animation loop forces a synchronous
    // layout on every frame of every scroll.
    let sectionTop = 0;
    let sectionSpan = 1;
    const measure = () => {
      const section = wrap.closest("section");
      if (!section) return;
      sectionTop = section.offsetTop;
      // The transformation completes across the last part of the hero, so the
      // sculpture is still whole while the headline is being read.
      sectionSpan = Math.max(1, section.offsetHeight * 0.86);
    };
    measure();

    let stopTicker: (() => void) | null = null;
    const ensureTicking = () => {
      if (stopTicker) return;
      stopTicker = addTicker((dt) => {
        const a = sx.step(dt);
        const b = sy.step(dt);
        const c = unfold.step(dt);
        handle.setPointer(sx.get(), sy.get());
        handle.setUnfold(unfold.get());
        if (!a && !b && !c) {
          stopTicker = null;
          return false;
        }
        return true;
      });
    };

    const apply = () => {
      handle.setPointer(sx.get(), sy.get());
      handle.setUnfold(unfold.get());
    };

    const onScroll = () => {
      const p = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / sectionSpan));
      unfold.set(p);
      ensureTicking();
    };

    const onMove = (e: PointerEvent) => {
      sx.set((e.clientX / window.innerWidth - 0.5) * 2);
      // GL's Y axis runs upward; the DOM's runs down.
      sy.set(-(e.clientY / window.innerHeight - 0.5) * 2);
      ensureTicking();
    };

    const onLeave = () => {
      sx.set(0);
      sy.set(0);
      ensureTicking();
    };

    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    onScroll();
    apply();

    return () => {
      if (fine) {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("auren:palette-change", onPalette);
      stopTicker?.();
      stopTicker = null;
      handle.destroy();
      setLive(false);
    };
  }, [reduced, wide, fine]);

  return (
    <div ref={wrapRef} className={cn("pointer-events-none", className)} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="h-full w-full transition-opacity duration-1000 ease-[var(--ease)]"
        style={{ opacity: live ? 1 : 0 }}
      />
      {/* Present in the server HTML and on every path the shader does not run:
          reduced motion, no WebGL, and every viewport under 768px. */}
      <div
        className="au-signature-static absolute inset-0 transition-opacity duration-1000 ease-[var(--ease)]"
        style={{ opacity: live ? 0 : 1 }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <span key={`b${i}`} className={`au-blade au-blade--${i + 1}`} />
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <span key={`c${i}`} className={`au-cross au-cross--${i + 1}`} />
        ))}
        <span className="au-signature-halo" />
      </div>
    </div>
  );
}
