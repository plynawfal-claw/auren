"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

type EditorialImageSlotProps = {
  id: string;
  src?: string;
  nextSrc?: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  children: ReactNode;
  overlay?: ReactNode;
};

/** A finished composition now; the same frame accepts a supplied image later. */
export function EditorialImageSlot({ id, src, nextSrc, alt = "", width, height, className, children, overlay }: EditorialImageSlotProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 26 });
  const imageY = useTransform(progress, [0, 1], ["3%", "-3%"]);
  const imageRotate = useTransform(progress, [0, 1], [1.5, -1.5]);

  useEffect(() => {
    if (!inView || !nextSrc) return;
    const image = new window.Image();
    image.src = nextSrc;
  }, [inView, nextSrc]);

  return (
    <motion.figure
      ref={ref}
      data-image-slot={id}
      className={cn("editorial-image-slot relative isolate overflow-hidden rounded-[1.5rem] border border-line", className)}
      style={{ aspectRatio: `${width} / ${height}`, perspective: 1000 }}
      initial={reduced ? false : { clipPath: "inset(8% 4% 8% 4% round 24px)", scale: 0.96, opacity: 0.75 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="absolute inset-[-4%]" style={reduced ? undefined : { y: imageY, rotateX: imageRotate }}>
        <AnimatePresence initial={false}>
          {src ? (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.995 }}
              transition={{ duration: reduced ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={src} alt={alt} fill sizes="(max-width: 767px) 92vw, 46vw" className="object-cover" unoptimized />
            </motion.div>
          ) : children}
        </AnimatePresence>
      </motion.div>
      {overlay && <div className="pointer-events-none absolute inset-0">{overlay}</div>}
    </motion.figure>
  );
}
