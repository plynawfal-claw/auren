"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useMediaQuery } from "@/lib/use-media-query";
import { portfolioSpring } from "@/lib/portfolio-motion";

export type ParallaxProduct = {
  title: string;
  link: string;
  thumbnail: string;
  alt: string;
  width: number;
  height: number;
  category: string;
};

/** Aceternity's scroll / spring / opposing-track system, scaled for AUREN. */
export function HeroParallax({ products, children }: { products: readonly ParallaxProduct[]; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const desktop = useMediaQuery("(min-width: 768px)", false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, portfolioSpring);
  const x = useTransform(progress, [0, 1], [-22, 22]);
  const reverseX = useTransform(progress, [0, 1], [22, -22]);
  const y = useTransform(progress, [0, 1], [16, -16]);
  const rotateX = useTransform(progress, [0, 0.6, 1], [3, 0, -1]);
  const active = !reduced && desktop;

  return (
    <section ref={ref} className="au-parallax relative py-16 md:py-24" aria-labelledby="parallax-heading">
      <div className="shell">{children}</div>
      <div className="shell au-parallax-grid mt-12 md:mt-20">
        {products.map((product, index) => (
          <motion.article
            key={product.link}
            className="au-parallax-card"
            style={{ maxWidth: product.width / 2, x: active ? (index % 2 ? reverseX : x) : 0, y: active ? y : 0, rotateX: active ? rotateX : 0 }}
          >
            <Link href={product.link} className="au-project-link block">
              <Image src={product.thumbnail} alt={product.alt} width={product.width} height={product.height}
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 44vw, 720px"
                className="h-auto w-full bg-graphite" />
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)]">{product.title}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-grey">{product.category} <span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
