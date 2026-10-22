"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * The AUREN identity: a folded diamond and a constructed wordmark.
 *
 * The mark is one unbroken line that turns four times inside and four times
 * outside — two nested squares, rotated 45°, joined into a single path with
 * both ends left open. Drawn unrotated on a 10-unit grid (inner square ±20,
 * outer ±30) and turned as a group, so every gap is exactly the same width and
 * the geometry survives any size; the source artwork's hand-drawn wobble and
 * its stray shading sliver are deliberately not reproduced.
 *
 * The letters are built, not typeset: a crossbar-less Λ, a U, an R with a
 * detached leg, an E reduced to its three bars, and an N. Each carries one
 * steel facet, as in the artwork. Strokes are 18 on a 100-unit cap height.
 *
 * Colours come from `--mark-*` tokens (globals.css) so both palettes get a
 * version tuned to their ground. The gradient id is per instance (`useId`):
 * a shared id resolves to the first definition in the document, and if that
 * copy sits in a hidden menu Chrome paints every other instance with nothing.
 */
const MARK_PATH = "M8 20H-20V-20H20V30H-30V-30H30V30";

export function Mark({ className, weight = 2.4 }: { className?: string; weight?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="-46 -46 92 92" className={cn("h-6 w-6", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`mk${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--mark-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-b)" }} />
        </linearGradient>
      </defs>
      <path
        d={MARK_PATH}
        transform="rotate(45)"
        fill="none"
        stroke={`url(#mk${id})`}
        strokeWidth={weight}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
    </svg>
  );
}

/** The five letters, white parts first; facets are drawn on top in steel. */
const LETTERS = [
  // Λ
  "M0 100L40 0H58L98 100H78L49 27.5L20 100Z",
  // U
  "M120 0H138V58A24 24 0 0 0 186 58V0H204V58A42 42 0 0 1 120 58Z",
  // R (bowl and stem; counter cut by even-odd)
  "M226 100V0H264A31 31 0 0 1 264 62H244V100ZM244 18V44H264A13 13 0 0 0 264 18Z",
  // E — top and bottom bars, and the light half of the middle bar
  "M322 0H400V18H322ZM322 82H400V100H322ZM322 41H362L346 59H322Z",
  // N
  "M422 100V0H441L487 68V0H506V100H487L441 32V100Z",
];
const FACETS = [
  // the inner face of Λ's right leg
  "M49 27.5L53.5 16L86 100H78Z",
  // R's leg
  "M250 62H272L302 100H280Z",
  // the steel half of E's middle bar
  "M362 41H400V59H346Z",
];

export function Letters({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 506 100" className={cn("h-3.5 w-auto", className)} aria-hidden="true" focusable="false">
      <g fill="currentColor" fillRule="evenodd">
        {LETTERS.map((d) => <path key={d} d={d} />)}
      </g>
      <g style={{ fill: "var(--mark-steel)" }}>
        {FACETS.map((d) => <path key={d} d={d} />)}
      </g>
    </svg>
  );
}

export function Wordmark({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span dir="ltr" lang="en" className={cn("inline-flex items-center gap-2.5 text-mineral", className)}>
      {showMark && <Mark />}
      <Letters />
      <span className="sr-only">AUREN — digital studio</span>
    </span>
  );
}
