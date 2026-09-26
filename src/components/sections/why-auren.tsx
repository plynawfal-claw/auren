"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addTicker, createSpring } from "@/lib/spring";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

/**
 * Why AUREN — the scattered pieces connect.
 *
 * The section's one motion idea: five loose labels, drifting and overlapping,
 * pull into a single connected row as you scroll past. It is the argument
 * made physically rather than written in a paragraph.
 *
 * Scroll drives a spring rather than the transforms directly. Raw scroll is
 * 1:1 and correct for a drag, but for a scene like this it reads as twitchy —
 * a critically damped spring chasing the scroll value gives the pieces mass
 * without introducing lag you can perceive as lateness.
 *
 * Positions are percentages of the stage, so the whole scene is resolution
 * independent and needs no measurement pass.
 */

type Piece = {
  label: string;
  /** Loose state: x%, y%, rotation in degrees. */
  from: [number, number, number];
  /** Settled state on a wide stage. */
  to: [number, number];
  /** Settled state when the stage is narrow — a vertical stack. */
  toNarrow: [number, number];
};

const PIECES: Piece[] = [
  { label: "Website",   from: [13, 20, -9], to: [10, 50], toNarrow: [50, 9] },
  { label: "Ads",       from: [70, 11,  7], to: [30, 50], toNarrow: [50, 29] },
  { label: "Content",   from: [80, 63, -6], to: [50, 50], toNarrow: [50, 49] },
  { label: "Google",    from: [9,  70, 10], to: [70, 50], toNarrow: [50, 69] },
  { label: "Customers", from: [44, 86, -4], to: [90, 50], toNarrow: [50, 89] },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function WhyAuren() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<SVGPathElement>(null);
  const progressRef = useRef(createSpring(0, { damping: 1, response: 0.55 }));
  const stopRef = useRef<(() => void) | null>(null);
  const [stage, setStage] = useState(0);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const narrow = useMediaQuery("(max-width: 767px)", true);

  const paint = useCallback(() => {
    const t = progressRef.current.get();
    const settleT = Math.min(1, Math.max(0, (t - 0.18) / 0.62));
    // Ease the settle so pieces arrive rather than slide linearly.
    const e = 1 - Math.pow(1 - settleT, 3);

    PIECES.forEach((p, i) => {
      const el = pieceRefs.current[i];
      if (!el) return;
      const [fx, fy, rot] = p.from;
      const [tx, ty] = narrow ? p.toNarrow : p.to;

      // Friction stage: everything nudges toward the middle and crowds before
      // it resolves, so the problem is felt before the answer arrives.
      const crowd = Math.sin(Math.min(1, t / 0.35) * Math.PI) * 6;

      const x = lerp(fx, tx, e) + (fx < 50 ? crowd : -crowd);
      const y = lerp(fy, ty, e) + (fy < 50 ? crowd * 0.5 : -crowd * 0.5);
      const r = lerp(rot, 0, e);
      const z = lerp([-90, 75, 150, -45, 105][i], 24, e);
      const ry = lerp((i - 2) * -10, 0, e);
      const rx = lerp(i % 2 === 0 ? 11 : -11, 0, e);

      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.transform = `translate(-50%, -50%) translateZ(${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${r.toFixed(2)}deg)`;
      el.style.opacity = String(0.55 + 0.45 * e);
      el.style.zIndex = String(Math.round(z + 100));
    });

    const line = lineRef.current;
    if (line) {
      const len = line.getTotalLength?.() ?? 0;
      line.style.strokeDashoffset = String(len * (1 - e));
      line.style.opacity = String(e);
    }

    const next = t < 0.3 ? 0 : t < 0.62 ? 1 : 2;
    setStage((s) => (s === next ? s : next));
  }, [narrow]);

  const ensureTicking = useCallback(() => {
    if (stopRef.current) return;
    stopRef.current = addTicker((dt) => {
      const moving = progressRef.current.step(dt);
      paint();
      if (!moving) {
        stopRef.current = null;
        return false;
      }
      return true;
    });
  }, [paint]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / span));
      progressRef.current.set(p);
      ensureTicking();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [reduced, ensureTicking]);

  // Settle immediately when the scene cannot animate, so the connected state
  // is what a reduced-motion visitor sees.
  useEffect(() => {
    if (!reduced) return;
    progressRef.current.jump(1);
    paint();
  }, [reduced, paint]);

  const HEADLINES = [
    "Your website, your adverts, your content and your customers should not feel like four different businesses.",
    "Run apart, they pull against each other.",
    "One direction. One system. One partner.",
  ];

  return (
    <section
      ref={sectionRef}
      className={cn("relative", reduced ? "py-24" : "h-[260svh]")}
      aria-labelledby="why-heading"
    >
      <div
        className={cn(
          "flex flex-col justify-center",
          reduced ? "" : "sticky top-0 h-[100svh] overflow-hidden",
        )}
      >
        <div className="shell">
          <p className="eyebrow">Why AUREN</p>
          <h2
            id="why-heading"
            className="sr-only"
          >
            Why AUREN
          </h2>

          {/* All three lines are in the HTML; only their opacity changes. */}
          <div className="relative mt-5 min-h-[5.2em] md:min-h-[3.4em]">
            {HEADLINES.map((line, i) => (
              <p
                key={i}
                aria-hidden={!reduced && i !== stage}
                className={cn(
                  "absolute inset-x-0 top-0 max-w-[22ch] font-display text-[length:var(--text-title)] leading-[1.04] transition-opacity duration-500 ease-[var(--ease)]",
                  reduced || i === stage ? "opacity-100" : "opacity-0",
                  reduced && i !== HEADLINES.length - 1 && "hidden",
                )}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* The stage. */}
        <div
          ref={stageRef}
          // 46svh pushed the eyebrow and headline off the top of the
          // sticky frame on a phone. Everything has to fit inside one
          // viewport or the scene loses the line it is illustrating.
          className="relative mx-auto mt-7 h-[34svh] w-full max-w-[1100px] px-[var(--page-gutter)] md:mt-14 md:h-[34svh]"
        >
          <div className="relative h-full w-full [perspective:900px] [transform-style:preserve-3d]">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={lineRef}
                d={narrow ? "M50 9 L50 29 L50 49 L50 69 L50 89" : "M10 50 L30 50 L50 50 L70 50 L90 50"}
                stroke="var(--color-lume)"
                strokeWidth="0.25"
                fill="none"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 400, strokeDashoffset: 400, opacity: 0 }}
              />
            </svg>

            {PIECES.map((p, i) => (
              <div
                key={p.label}
                ref={(el) => {
                  pieceRefs.current[i] = el;
                }}
                className="absolute will-change-transform [transform-style:preserve-3d]"
                style={{ left: `${p.from[0]}%`, top: `${p.from[1]}%` }}
              >
                <span className="block whitespace-nowrap rounded-md border border-line-strong bg-graphite px-3.5 py-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-silver shadow-[0_24px_50px_-15px_rgba(0,0,0,0.9)]">
                  {p.label}
                </span>
              </div>
            ))}

            {/* The connection is live. Light now travels between the parts,
                which is the section's argument completed: they are not just
                touching, they are feeding each other. Rendered only once the
                row has resolved, so the signals read as a consequence of the
                connection rather than as decoration floating over the stage.

                Above the pieces (z-300) because those carry inline z-indexes.
                Skipped entirely under reduced motion — a travelling dot has no
                still equivalent worth showing. */}
            {!reduced && stage >= 2 && (
              <div className="pointer-events-none absolute inset-0 z-[300]" aria-hidden="true">
                <span className="au-signal" />
                <span className="au-signal au-signal--2" />
                <span className="au-signal au-signal--3" />
              </div>
            )}
          </div>
        </div>

        <div className="shell mt-7 md:mt-12">
          <p className="max-w-[46ch] text-[0.95rem] leading-relaxed text-silver md:text-base">
            We design them to work together from the beginning — so the advert,
            the page it opens and the message that follows all sound like the
            same business.
          </p>
        </div>
      </div>
    </section>
  );
}
