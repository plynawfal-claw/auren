"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The "Websites that sell" story, played over the capability stage's cells.
 *
 * The stage's eight cells already draw the page: header, hero, side panel,
 * three cards, footer and the lume CTA pill. On its own that read as an
 * unfinished wireframe. This layer runs one 3.6s beat on top of it —
 *
 *   copy writes into the hero → products settle into the cards →
 *   a visitor's tap travels to the CTA → the CTA fills → a conversion lands
 *
 * — which is the whole argument of the row, in the time it takes to read it.
 *
 * Built from CSS keyframes on transform and opacity (plus one small stroke
 * draw), in its own `container-type: size` box so every position is written
 * in the same percentages as the cells without touching the stage itself:
 * the stage keeps its 3D context and hover tilt on desktop untouched.
 *
 * It pauses whenever the stage is off-screen, and under reduced motion the
 * CSS holds the last frame — CTA filled, conversion drawn — as a still.
 * Everything is aria-hidden: the capability is described by the row's text.
 * If a rendered clip ever replaces it, this component is the one seam.
 */
export function CapabilityLoop({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="capability-loop pointer-events-none absolute inset-0 z-10"
      data-playing={onScreen}
      data-capability={id}
    >
      {id === "websites" && (
        <>
          {/* Copy writing into the hero cell. */}
          <span className="cl-line cl-line--1" />
          <span className="cl-line cl-line--2" />
          <span className="cl-line cl-line--3" />
          {/* Products settling into the cards. The third card is left to the
              capability glyph, which sits over it. */}
          <span className="cl-module cl-module--1" />
          <span className="cl-module cl-module--2" />
          {/* The CTA: fill and ripple sit exactly over cell 7. */}
          <span className="cl-cta"><span className="cl-cta__fill" /></span>
          <span className="cl-ripple" />
          {/* A visitor's tap, travelling from the hero to the CTA. */}
          <span className="cl-tap" />
          {/* The conversion, drawn in the side panel. */}
          <svg className="cl-tick" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" className="cl-tick__ring" />
            <path d="M12.5 20.5l5 5 10-11" className="cl-tick__mark" />
          </svg>
        </>
      )}
    </div>
  );
}
