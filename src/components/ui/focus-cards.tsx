"use client";

import { useState } from "react";
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
  const fine = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)", false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  return (
    <div className="au-focus-grid" onPointerLeave={() => setHovered(null)}>
      {cards.map((card, index) => (
        <motion.figure
          key={card.src}
          className="au-focus-card"
          style={{ maxWidth: card.width / 2 }}
          onPointerEnter={() => fine && setHovered(index)}
          animate={{
            y: !reduced && fine && hovered === index ? -5 : 0,
            opacity: fine && hovered !== null && hovered !== index ? 0.86 : 1,
          }}
          transition={reduced ? { duration: 0 } : { ...portfolioSpring, opacity: { duration: 0.7 } }}
        >
          <motion.div
            className="au-focus-media"
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
