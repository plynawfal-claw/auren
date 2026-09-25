"use client";

import { useEffect, useRef, useState } from "react";
import { createSurface, type SurfaceHandle } from "./surface-shader";
import { createSpring, addTicker } from "@/lib/spring";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * The hero surface, with the pointer on a spring.
 *
 * The light does not snap to the cursor — it is pulled toward it by a
 * critically damped spring, so the surface feels like it has mass. Raw pointer
 * tracking here reads as a cheap mouse-follow effect; the lag is the whole
 * difference.
 *
 * Pointer values go straight into GL uniforms, never into React state. A
 * pointermove handler calling setState would re-render the tree on every frame.
 */
export function Surface({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  // Conservative server snapshots: assume reduced motion and a narrow screen,
  // so the HTML that ships is the static one.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const wide = useMediaQuery("(min-width: 768px)", false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || !wide) return;

    const handle: SurfaceHandle | null = createSurface(canvas);
    if (!handle) return;
    setLive(true);

    // Resting position sits a little above centre — where the light naturally
    // falls behind the statement, before anyone touches anything.
    const sx = createSpring(0.5, { damping: 1, response: 0.9 });
    const sy = createSpring(0.42, { damping: 1, response: 0.9 });

    let stopTicker: (() => void) | null = null;
    const ensureTicking = () => {
      if (stopTicker) return;
      stopTicker = addTicker((dt) => {
        const a = sx.step(dt);
        const b = sy.step(dt);
        handle.setPointer(sx.get(), sy.get());
        if (!a && !b) {
          stopTicker = null;
          return false;
        }
        return true;
      });
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      sx.set((e.clientX - r.left) / r.width);
      // GL's Y axis runs upward; the DOM's runs down.
      sy.set(1 - (e.clientY - r.top) / r.height);
      ensureTicking();
    };

    const onLeave = () => {
      sx.set(0.5);
      sy.set(0.42);
      ensureTicking();
    };

    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    ensureTicking();

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      stopTicker?.();
      handle.destroy();
      setLive(false);
    };
  }, [reduced, wide, fine]);

  return (
    <div className={className} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="h-full w-full transition-opacity duration-700 ease-[var(--ease)]"
        style={{ opacity: live ? 1 : 0 }}
      />
      {/* The static stand-in. Present in the server HTML and on every path the
          shader does not run: reduced motion, no WebGL, narrow viewports. */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease)]"
        style={{
          opacity: live ? 0 : 1,
          background:
            "radial-gradient(60% 50% at 50% 42%, rgba(220,230,245,0.16), rgba(220,230,245,0.04) 45%, transparent 72%), linear-gradient(180deg, #141619 0%, #0a0b0d 70%)",
        }}
      />
    </div>
  );
}
