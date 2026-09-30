"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Surface } from "@/components/surface/surface";
import { SignatureObject } from "@/components/signature/signature-object";
import { HeroDepth } from "@/components/motion/hero-depth";
import { ButtonLink } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/use-media-query";
import { c, tr } from "@/i18n/copy";

const arrival = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

export function Hero({ locale }: { locale: string }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 25, mass: 0.8 });
  const sculptureY = useTransform(progress, [0, 1], [0, -90]);
  const sculptureRotate = useTransform(progress, [0, 1], [0, 12]);
  const lines = [
    tr(locale, c("We build digital", "Nous créons des", "كنصاوبو تجارب")),
    tr(locale, c("experiences designed", "expériences digitales", "رقمية مصممة")),
    tr(locale, c("to move businesses", "qui font avancer", "باش تقدّم")),
  ];
  const finalLine = tr(locale, c("forward.", "les entreprises.", "البيزنس ديالك."));

  return (
    <section ref={section} data-hero className="hero-scene relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28 md:pb-20 md:pt-28">
      <Surface className="pointer-events-none absolute inset-0 -z-10" />
      <motion.div
        aria-hidden="true"
        className="hero-signature pointer-events-none absolute -right-[24%] top-[16%] z-0 aspect-square w-[94vw] max-w-[780px] opacity-60 md:-right-[19%] md:top-[6%] md:w-[min(62vw,780px)] md:opacity-100 xl:-right-[11%]"
        style={reduced ? undefined : { y: sculptureY, rotate: sculptureRotate }}
      >
        <SignatureObject className="relative h-full w-full" />
      </motion.div>

      <div className="shell relative z-10">
        <HeroDepth>
          <div data-hero-out>
            <motion.span aria-hidden="true" className="mb-8 block h-px w-12 origin-left bg-lume/70 rtl:origin-right" initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ ...arrival, delay: 0.12 }} />
            <h1 className="hero-headline max-w-[18ch] font-display text-[length:var(--text-statement)] leading-[0.92] tracking-[-0.03em]">
              {lines.map((line, i) => (
                <span key={i} className="hero-headline__line block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <motion.span className="block" initial={reduced ? false : { y: "112%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ ...arrival, delay: 0.2 + i * 0.15 }}>
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="hero-headline__line block overflow-hidden py-[0.08em] -my-[0.08em]">
                <motion.em className="hero-forward relative inline-block italic" initial={reduced ? false : { y: "112%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ ...arrival, delay: 0.68 }}>
                  {finalLine}
                  <motion.span aria-hidden="true" className="hero-forward__stroke" initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={reduced ? { duration: 0 } : { ...arrival, delay: 1.24 }} />
                </motion.em>
              </span>
            </h1>

            <motion.p className="lead mt-9 max-w-[54ch]" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...arrival, delay: 0.95 }}>
              {tr(locale, c(
                "Web experiences, products, creative, growth and intelligent systems — designed as one connected practice.",
                "Sites, produits, création, croissance et systèmes intelligents — pensés comme une seule pratique.",
                "مواقع، منتجات، إبداع، نمو وأنظمة ذكية — كاملين خدامين فنفس الاتجاه.",
              ))}
            </motion.p>
            <motion.div className="mt-11 flex flex-wrap gap-3" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...arrival, delay: 1.12 }}>
              <ButtonLink href="/work">{tr(locale, c("View work", "Voir les projets", "شوف المشاريع"))}</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">{tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}</ButtonLink>
            </motion.div>
          </div>
        </HeroDepth>
      </div>

      <div className="hero-scroll-cue absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
        <span className="au-scroll-cue" />
      </div>
    </section>
  );
}
