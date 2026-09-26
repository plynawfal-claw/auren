"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";
import { TextReveal } from "@/components/motion/text-reveal";

/**
 * What we build.
 *
 * One stage, eight cells, six arrangements. The same eight elements move
 * between a web page, a set of touchpoints, an acquisition spread, an
 * operational system, a storefront and a network — so it reads as one system
 * changing form rather than six unrelated illustrations.
 *
 * Movement uses CSS transitions rather than JS springs on purpose. Thirty-two
 * animated values driven from rAF would cost far more than this earns, and a
 * CSS transition already re-targets from its current computed value, so
 * switching capability mid-flight is continuous rather than a jump.
 */

type Cell = { x: number; y: number; w: number; h: number; o?: number; r?: number };

type Capability = {
  id: string;
  title: string;
  body: string;
  /** Eight cells. Index is stable across states — that is what makes it morph. */
  cells: Cell[];
};

const CAPABILITIES: Capability[] = [
  {
    id: "websites",
    title: "Websites that sell",
    body: "Shops, landing pages and company websites that people actually buy from.",
    cells: [
      { x: 3, y: 5, w: 94, h: 7, r: 3 },
      { x: 3, y: 17, w: 55, h: 34, r: 4 },
      { x: 61, y: 17, w: 36, h: 34, r: 4 },
      { x: 3, y: 56, w: 29, h: 22, r: 4 },
      { x: 36, y: 56, w: 28, h: 22, r: 4 },
      { x: 68, y: 56, w: 29, h: 22, r: 4 },
      { x: 3, y: 83, w: 94, h: 11, r: 3 },
      { x: 80, y: 5, w: 17, h: 7, o: 1, r: 20 },
    ],
  },
  {
    id: "brand",
    title: "Brands people remember",
    body: "A name, a look and the campaigns that carry them.",
    cells: [
      { x: 3, y: 5, w: 45, h: 57, r: 4 },
      { x: 52, y: 5, w: 21, h: 21, r: 20 },
      { x: 77, y: 5, w: 20, h: 21, r: 4 },
      { x: 52, y: 30, w: 45, h: 14, r: 4 },
      { x: 52, y: 48, w: 45, h: 14, r: 4 },
      { x: 3, y: 66, w: 45, h: 9, r: 3 },
      { x: 52, y: 66, w: 45, h: 9, r: 3 },
      { x: 3, y: 80, w: 94, h: 4, o: 0.6, r: 2 },
    ],
  },
  {
    id: "growth",
    title: "Growth that brings people in",
    body: "Google, social and search — then steady improvement on what works.",
    cells: [
      { x: 34, y: 38, w: 32, h: 24, r: 6 },
      { x: 3, y: 8, w: 21, h: 13, r: 20 },
      { x: 76, y: 8, w: 21, h: 13, r: 20 },
      { x: 3, y: 72, w: 21, h: 13, r: 20 },
      { x: 76, y: 72, w: 21, h: 13, r: 20 },
      { x: 38, y: 6, w: 24, h: 11, r: 20 },
      { x: 38, y: 78, w: 24, h: 11, r: 20 },
      { x: 3, y: 92, w: 94, h: 3, o: 0.5, r: 2 },
    ],
  },
  {
    id: "systems",
    title: "Systems that save time",
    body: "Follow-up, customer records and the repetitive work handled for you.",
    cells: [
      { x: 5, y: 5, w: 90, h: 13, r: 4 },
      { x: 5, y: 22, w: 90, h: 11, r: 3 },
      { x: 5, y: 36, w: 90, h: 11, r: 3 },
      { x: 5, y: 50, w: 90, h: 11, r: 3 },
      { x: 5, y: 64, w: 42, h: 11, r: 3 },
      { x: 53, y: 64, w: 42, h: 11, r: 3 },
      { x: 5, y: 78, w: 90, h: 11, r: 3 },
      { x: 5, y: 92, w: 32, h: 4, o: 1, r: 20 },
    ],
  },
  {
    id: "ecommerce",
    title: "Shops that take orders",
    body: "Product pages, baskets and a checkout that works on a phone.",
    cells: [
      { x: 3, y: 5, w: 94, h: 8, r: 3 },
      { x: 3, y: 17, w: 46, h: 46, r: 5 },
      { x: 53, y: 17, w: 44, h: 21, r: 5 },
      { x: 53, y: 42, w: 44, h: 21, r: 5 },
      { x: 3, y: 67, w: 29, h: 10, r: 3 },
      { x: 36, y: 67, w: 28, h: 10, r: 3 },
      { x: 68, y: 67, w: 29, h: 10, r: 3 },
      { x: 3, y: 82, w: 94, h: 12, o: 1, r: 4 },
    ],
  },
  {
    id: "ai",
    title: "Systems that think",
    body: "Automation, assistants and follow-up that handles itself.",
    cells: [
      { x: 33, y: 34, w: 34, h: 26, r: 9 },
      { x: 4, y: 8, w: 20, h: 12, r: 20 },
      { x: 40, y: 4, w: 20, h: 12, r: 20 },
      { x: 76, y: 8, w: 20, h: 12, r: 20 },
      { x: 4, y: 44, w: 20, h: 12, r: 20 },
      { x: 76, y: 44, w: 20, h: 12, r: 20 },
      { x: 40, y: 78, w: 20, h: 12, r: 20 },
      { x: 4, y: 78, w: 26, h: 5, o: 1, r: 20 },
    ],
  },
];

export function WhatWeBuild() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const narrow = useMediaQuery("(max-width: 1023px)", true);

  // On narrow screens there is no hover to respond to, so whichever row is
  // nearest the middle of the viewport takes the stage.
  useEffect(() => {
    if (!narrow || reduced) return;
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = items.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [narrow, reduced]);

  const cells = CAPABILITIES[active].cells;

  return (
    <section className="py-24 md:py-32" aria-labelledby="build-heading">
      <div className="shell">
        <p className="eyebrow">Capabilities</p>
        <TextReveal
          id="build-heading"
          as="h2"
          text="What we build"
          className="mt-6 max-w-[12ch] text-[length:var(--text-display)] leading-[0.92]"
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* The stage. Sticky on desktop so it stays beside whichever row is
              being read. */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              <div className="spatial-object capability-stage relative aspect-[4/3] w-full rounded-2xl border border-line [perspective:850px] [transform-style:preserve-3d]">
                {cells.map((c, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      "absolute border border-mineral/15 bg-mineral/[0.09] shadow-[0_18px_35px_-20px_rgba(0,0,0,0.85)]",
                      !reduced &&
                        "transition-[left,top,width,height,opacity,border-radius,transform] duration-[700ms] ease-[var(--ease)]",
                      i === 7 && "bg-lume/30",
                    )}
                    style={{
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      width: `${c.w}%`,
                      height: `${c.h}%`,
                      opacity: c.o ?? 0.85,
                      borderRadius: `${c.r ?? 4}px`,
                      transform: `translateZ(${[32, 68, 88, 24, 52, 72, 18, 110][i]}px)`,
                      transitionDelay: reduced ? undefined : `${i * 42}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-grey-deep">
                {String(active + 1).padStart(2, "0")} / {String(CAPABILITIES.length).padStart(2, "0")} ·{" "}
                {CAPABILITIES[active].title}
              </p>
            </div>
          </div>

          <ul ref={listRef} className="order-1 lg:order-2 lg:col-span-6">
            {CAPABILITIES.map((c, i) => {
              const on = i === active;
              return (
                <li key={c.id} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    onMouseEnter={() => !narrow && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="block w-full py-8 text-left md:py-10"
                  >
                    <h3
                      className={cn(
                        "font-display text-[clamp(1.6rem,3.4vw,2.7rem)] leading-[1.02] transition-all duration-[var(--dur)] ease-[var(--ease)]",
                        on ? "translate-x-2 text-mineral" : "text-silver",
                      )}
                    >
                      {c.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 max-w-[42ch] transition-all duration-[var(--dur)] ease-[var(--ease)]",
                        on ? "translate-x-2 text-grey" : "text-grey-deep",
                      )}
                    >
                      {c.body}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </section>
  );
}
