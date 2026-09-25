"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll reveal.
 *
 * Ported from kutia/src/components/reveal.tsx, which is the most correct of
 * the three implementations in the workspace. Two details are load-bearing:
 *
 * 1. One module-level IntersectionObserver serves the whole page, and elements
 *    unobserve themselves once shown. Per-instance observers are the usual
 *    way a long page ends up with sixty live observers.
 * 2. The debounced sweep. IntersectionObserver misses elements that cross the
 *    viewport inside a single frame — a hash jump, or browser scroll
 *    restoration on reload. Without the sweep those sections stay invisible
 *    forever, which on this site would mean blank case studies.
 */

let observer: IntersectionObserver | null = null;
const pending = new Set<Element>();

function show(el: Element) {
  el.classList.add("is-visible");
  pending.delete(el);
  observer?.unobserve(el);
}

function sweep() {
  const h = window.innerHeight;
  pending.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < h * 0.92 && r.bottom > 0) show(el);
  });
}

function ensureObserver() {
  if (observer || typeof window === "undefined") return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) show(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
  );

  let t: number | undefined;
  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(t);
      t = window.setTimeout(sweep, 120);
    },
    { passive: true },
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds. Use for stagger within a group, not between sections. */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ensureObserver();
    pending.add(el);
    observer?.observe(el);

    // Failsafe: if neither the observer nor the sweep has fired by now,
    // something is wrong with the environment — show the content anyway.
    const failsafe = window.setTimeout(() => show(el), 1600);

    return () => {
      window.clearTimeout(failsafe);
      pending.delete(el);
      observer?.unobserve(el);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
