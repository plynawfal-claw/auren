"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

/**
 * How we work.
 *
 * A journey rather than a grid: one line runs down the page and each stage
 * lights as you reach it. Four stages, because a client can hold four.
 *
 * Numbered legitimately — these genuinely happen in order, each one using what
 * the previous produced.
 */
const STAGES = [
  {
    n: "01",
    title: "Understand",
    body: "We learn what you sell, who should be buying it, and what is getting in the way.",
    note: "A week of questions",
  },
  {
    n: "02",
    title: "Shape",
    body: "We decide how it should look, how it should sound, and how it should work.",
    note: "One direction, written down",
  },
  {
    n: "03",
    title: "Build",
    body: "We make the website, the app, the campaign — and the follow-up behind it.",
    note: "Shown in finished pieces",
  },
  {
    n: "04",
    title: "Grow",
    body: "We launch, watch what people actually do, and improve it from there.",
    note: "Ongoing, not a hand-off",
  },
] as const;

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  // Under reduced motion every stage is lit from the start — derived, not set
  // in an effect, so there is no frame where the journey renders unlit.
  const reached = reduced ? STAGES.length - 1 : scrolled;

  useEffect(() => {
    if (reduced) return;
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = items.indexOf(e.target as HTMLElement);
          // Only ever moves forward — a stage you have passed stays lit.
          if (i >= 0) setScrolled((r) => (i > r ? i : r));
        });
      },
      { rootMargin: "-35% 0px -40% 0px", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced]);

  const pct = ((reached + 1) / STAGES.length) * 100;

  return (
    <section className="py-24 md:py-32" aria-labelledby="process-heading">
      <div className="shell">
        <p className="eyebrow">How we work</p>
        <h2
          id="process-heading"
          className="mt-6 max-w-[16ch] text-[length:var(--text-display)] leading-[0.94]"
        >
          Four steps, in this order.
        </h2>

        <div className="relative mt-20">
          {/* The line, and the part of it you have travelled. */}
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-px bg-line md:left-1/2 md:-translate-x-1/2"
          />
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-2 w-px origin-top bg-lume/70 transition-[height] duration-[900ms] ease-[var(--ease)] md:left-1/2 md:-translate-x-1/2"
            style={{ height: `calc(${pct}% - 1rem)` }}
          />

          <ol ref={listRef} className="space-y-20 md:space-y-28">
            {STAGES.map((s, i) => {
              const on = i <= reached;
              return (
                <li
                  key={s.n}
                  className={cn(
                    "relative pl-10 md:grid md:grid-cols-2 md:gap-16 md:pl-0",
                    i % 2 === 1 && "md:[&>div:first-child]:col-start-2",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-2 h-3.5 w-3.5 rounded-full border transition-all duration-500 ease-[var(--ease)] md:left-1/2 md:-translate-x-1/2",
                      on
                        ? "scale-100 border-lume bg-lume"
                        : "scale-75 border-line-strong bg-graphite",
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-700 ease-[var(--ease)]",
                      i % 2 === 1 ? "md:pl-16" : "md:pr-16 md:text-right",
                      on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-45",
                    )}
                  >
                    <div className="spatial-object process-stage p-6 md:p-8">
                      <span className="font-mono text-[0.68rem] tracking-[0.18em] text-grey">
                        {s.n}
                      </span>
                      <h3 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-none">
                        {s.title}
                      </h3>
                      <p className="mt-4 max-w-[38ch] leading-relaxed text-silver md:inline-block">
                        {s.body}
                      </p>
                      <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">
                        {s.note}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
