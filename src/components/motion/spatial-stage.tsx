"use client";

import { useEffect, useRef } from "react";

/** Shared pointer camera and delegated tilt for the site's 3D surfaces. */
export function SpatialStage() {
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active: HTMLElement | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let target: HTMLElement | null = null;

    const reset = (element: HTMLElement | null) => {
      if (!element) return;
      element.classList.remove("is-spatial-active");
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    };

    const paint = () => {
      frame = 0;
      const x = pointerX / window.innerWidth - 0.5;
      const y = pointerY / window.innerHeight - 0.5;
      worldRef.current?.style.setProperty("--scene-rx", `${(y * 8).toFixed(2)}deg`);
      worldRef.current?.style.setProperty("--scene-ry", `${(x * 12).toFixed(2)}deg`);

      if (target !== active) {
        reset(active);
        active = target;
      }
      if (!active) return;

      const rect = active.getBoundingClientRect();
      const localX = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
      const localY = Math.max(0, Math.min(1, (pointerY - rect.top) / rect.height));
      active.classList.add("is-spatial-active");
      active.style.setProperty("--tilt-x", `${((0.5 - localY) * 12).toFixed(2)}deg`);
      active.style.setProperty("--tilt-y", `${((localX - 0.5) * 12).toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      target = event.target instanceof Element
        ? (event.target.closest(".spatial-object") as HTMLElement | null)
        : null;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      target = null;
      reset(active);
      active = null;
      worldRef.current?.style.setProperty("--scene-rx", "0deg");
      worldRef.current?.style.setProperty("--scene-ry", "0deg");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      onLeave();
    };
  }, []);

  return (
    <div className="spatial-backdrop" aria-hidden="true">
      <div ref={worldRef} className="spatial-backdrop__world">
        <span className="spatial-backdrop__plane" />
        <span className="spatial-backdrop__plane" />
        <span className="spatial-backdrop__plane" />
        <span className="spatial-backdrop__plane" />
      </div>
    </div>
  );
}
