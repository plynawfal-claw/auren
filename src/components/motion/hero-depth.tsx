"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";

/** A shallow pointer camera on desktop; scroll supplies the same depth on touch. */
export function HeroDepth({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-1, 1], [2.5, -2.5]), { stiffness: 90, damping: 22 });
  const ry = useSpring(useTransform(px, [-1, 1], [-2.5, 2.5]), { stiffness: 90, damping: 22 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const touchTilt = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const touchY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <motion.div
      ref={ref}
      className="relative [transform-style:preserve-3d]"
      style={reduced ? undefined : {
        rotateX: fine ? rx : touchTilt,
        rotateY: fine ? ry : 0,
        y: fine ? 0 : touchY,
        transformPerspective: 1200,
      }}
      onPointerMove={fine && !reduced ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        px.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
        py.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      } : undefined}
      onPointerLeave={() => { px.set(0); py.set(0); }}
    >
      {children}
    </motion.div>
  );
}
