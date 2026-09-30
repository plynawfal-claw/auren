"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";
import { portfolioSpring } from "@/lib/portfolio-motion";

export type FocusCard = {
  title: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Aceternity's sibling-focus interaction, with uncropped editorial media. */
export function FocusCards({ cards }: { cards: readonly FocusCard[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [centred, setCentred] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fine = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)", false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  // Without a hovering pointer, the card nearest the middle of the screen is
  // the one in focus — the same lift and the same softened neighbours, driven
  // by the thumb instead of the cursor.
  useEffect(() => {
    if (fine) return;
    const grid = gridRef.current;
    if (!grid) return;
    let frame = 0;
    let current: number | null = null;

    const measure = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best: number | null = null;
      let bestDistance = Infinity;
      let currentDistance = Infinity;
      Array.from(grid.children).forEach((card, i) => {
        const r = card.getBoundingClientRect();
        // Only a card actually crossing the middle band is a candidate, so
        // nothing dims while the grid is merely entering or leaving.
        if (r.bottom < window.innerHeight * 0.2 || r.top > window.innerHeight * 0.8) return;
        const distance = Math.abs(r.top + r.height / 2 - mid);
        if (distance < bestDistance) { best = i; bestDistance = distance; }
        if (i === current) currentDistance = distance;
      });
      // Hysteresis: a new card has to be clearly closer before it takes over,
      // or two cards straddling the middle would flicker on every frame.
      if (best !== null && current !== null && best !== current && currentDistance - bestDistance < 48) return;
      if (best !== current) {
        current = best;
        setCentred(best);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [fine]);

  const focus = fine ? hovered : centred;

  return (
    <div ref={gridRef} className="au-focus-grid" onPointerLeave={() => setHovered(null)}>
      {cards.map((card, index) => (
        <motion.figure
          key={card.src}
          className="au-focus-card"
          style={{ maxWidth: card.width / 2 }}
          onPointerEnter={() => fine && setHovered(index)}
          animate={{
            y: !reduced && focus === index ? -5 : 0,
            opacity: focus !== null && focus !== index ? 0.86 : 1,
          }}
          transition={reduced ? { duration: 0 } : { ...portfolioSpring, opacity: { duration: 0.7 } }}
        >
          <motion.div
            className="au-focus-media"
            // The blur stays pointer-only: re-blurring images on every scroll
            // step is exactly what makes a phone drop frames.
            data-softened={!reduced && fine && hovered !== null && hovered !== index}
            initial={reduced ? false : { clipPath: "inset(10% 0 12% 0 round 12px)" }}
            whileInView={{ clipPath: "inset(0% 0 0% 0% round 0px)" }}
            viewport={{ once: true, amount: 0.12 }}
            transition={reduced ? { duration: 0 } : { duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={card.src}
              alt={card.alt}
              width={card.width}
              height={card.height}
              sizes={`(max-width: 640px) min(calc(100vw - 40px), ${card.width / 2}px), (max-width: 1023px) 40vw, min(28vw, ${card.width / 2}px)`}
              className="h-auto w-full"
            />
          </motion.div>
          <motion.figcaption
            className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={reduced ? { duration: 0 } : { duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-display text-2xl">{card.title}</h3>
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-grey">{card.category}</span>
          </motion.figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
