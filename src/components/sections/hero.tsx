"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Surface } from "@/components/surface/surface";
import { SignatureObject } from "@/components/signature/signature-object";
import { MobileHeroVideo } from "@/components/motion/mobile-hero-video";
import { HeroDepth } from "@/components/motion/hero-depth";
import { ButtonLink } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/use-media-query";
import { c, tr } from "@/i18n/copy";

export function Hero({ locale }: { locale: string }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 25, mass: 0.8 });
  const sculptureY = useTransform(progress, [0, 1], [0, -90]);
  const sculptureRotate = useTransform(progress, [0, 1], [0, 12]);
  const lines = [
    tr(locale, c("We build digital", "Agence digitale", "كنصاوبو تجارب")),
    tr(locale, c("experiences designed", "à Tanger, pour", "رقمية مصممة")),
    tr(locale, c("to move businesses", "les entreprises", "باش تقدّم")),
  ];
  // French leads with the search phrase people in Morocco type ("agence
  // digitale Tanger"); the studio's line moves to the lead paragraph below.
  const finalLine = tr(locale, c("forward.", "du Maroc.", "البيزنس ديالك."));

  return (
    <section ref={section} data-hero className="hero-scene relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28 md:pb-20 md:pt-28">
      <Surface className="pointer-events-none absolute inset-0 -z-10" />
      <motion.div
        aria-hidden="true"
        className="hero-signature pointer-events-none absolute -right-[24%] top-[16%] z-0 aspect-square w-[94vw] max-w-[780px] opacity-60 md:-right-[19%] md:top-[6%] md:w-[min(62vw,780px)] md:opacity-100 xl:-right-[11%]"
        style={reduced ? undefined : { y: sculptureY, rotate: sculptureRotate }}
      >
        {/* Desktop: the live shader. Phones: the same object as footage. */}
        <SignatureObject className="relative h-full w-full max-md:hidden" />
        <MobileHeroVideo className="absolute inset-0" />
      </motion.div>

      <div className="shell relative z-10">
        <HeroDepth>
          <div data-hero-out>
            {/* The arrival is CSS (`.hero-arrive*` in globals.css), not motion
                props: a motion `initial` ships the headline at opacity 0 in the
                HTML and holds it there until the bundle hydrates, which made the
                phone LCP wait on JavaScript. Keyframes start on first paint and
                still yield to reduced motion. */}
            <span aria-hidden="true" className="hero-arrive-rule mb-8 block h-px w-12 origin-left bg-lume/70 rtl:origin-right" style={{ "--d": "0.12s" } as React.CSSProperties} />
            <h1 className="hero-headline max-w-[18ch] font-display text-[length:var(--text-statement)] leading-[0.92] tracking-[-0.03em]">
              {lines.map((line, i) => (
                <span key={i} className="hero-headline__line block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <span className="hero-arrive-line block" style={{ "--d": `${0.2 + i * 0.15}s` } as React.CSSProperties}>
                    {line}
                  </span>
                </span>
              ))}
              <span className="hero-headline__line block overflow-hidden py-[0.08em] -my-[0.08em]">
                <em className="hero-forward hero-arrive-line relative inline-block italic" style={{ "--d": "0.68s" } as React.CSSProperties}>
                  {finalLine}
                  <span aria-hidden="true" className="hero-forward__stroke hero-arrive-rule" style={{ "--d": "1.24s" } as React.CSSProperties} />
                </em>
              </span>
            </h1>

            <p className="hero-arrive-fade lead mt-9 max-w-[54ch]" style={{ "--d": "0.95s", "--rise": "18px" } as React.CSSProperties}>
              {tr(locale, c(
                "Web experiences, products, creative, growth and intelligent systems — designed as one connected practice.",
                "Nous créons des expériences digitales qui font avancer les entreprises : sites internet, boutiques en ligne, identité de marque, publicité Google et Meta, et automatisation — pensés comme un seul travail.",
                "مواقع، منتجات، إبداع، نمو وأنظمة ذكية — كاملين خدامين فنفس الاتجاه.",
              ))}
            </p>
            <div className="hero-arrive-fade mt-11 flex flex-wrap gap-3" style={{ "--d": "1.12s", "--rise": "20px" } as React.CSSProperties}>
              <ButtonLink href="/work">{tr(locale, c("View work", "Voir les projets", "شوف المشاريع"))}</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">{tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}</ButtonLink>
            </div>
          </div>
        </HeroDepth>
      </div>

      <div className="hero-scroll-cue absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
        <span className="au-scroll-cue" />
      </div>
    </section>
  );
}
