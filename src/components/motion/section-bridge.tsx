"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";
import { c, tr } from "@/i18n/copy";

/** A typographic handoff from the systems diagram into the portfolio concepts. */
export function SectionBridge({ locale }: { locale: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const narrow = useMediaQuery("(max-width: 767px)", true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 24 });
  const x = useTransform(progress, [0, 1], ["8%", "-8%"]);
  const y = useTransform(progress, [0, 1], [18, -18]);
  const scaleX = useTransform(progress, [0, 0.7], [0.05, 1]);

  return (
    <section ref={ref} className="section-bridge relative overflow-hidden py-16 md:py-24" aria-label={tr(locale, c("From systems to possibilities", "Des systèmes aux possibilités", "من الأنظمة للإمكانيات"))}>
      <div className="overflow-hidden border-y border-line py-7 md:py-10">
        <motion.p
          className="mx-auto max-w-[18ch] px-[var(--page-gutter)] text-center font-display text-[clamp(2.2rem,8vw,11rem)] italic leading-[0.98] tracking-[-0.05em] text-mineral/85 md:max-w-none md:whitespace-nowrap md:leading-[0.85]"
          style={reduced ? undefined : narrow ? { y } : { x }}
        >
          {tr(locale, c("One system. Many worlds.", "Un système. Mille univers.", "نظام واحد. عوالم كثيرة."))}
        </motion.p>
      </div>
      <div className="shell pt-5"><motion.span aria-hidden="true" className="block h-px origin-left bg-lume/60" style={reduced ? undefined : { scaleX }} /></div>
    </section>
  );
}
