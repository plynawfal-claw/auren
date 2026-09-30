"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";
import { TextReveal } from "@/components/motion/text-reveal";
import { motion } from "motion/react";
import { c, tr, type Copy } from "@/i18n/copy";

/**
 * What we build.
 *
 * One stage, eight cells, six arrangements. The same eight elements move
 * between a web page, a set of touchpoints, an acquisition spread, an
 * operational system, a storefront and a network — so it reads as one system
 * changing form rather than six unrelated illustrations.
 *
 * Movement uses CSS transitions rather than JS springs on purpose. Thirty-two
 * animated values driven from rAF would cost far more than this earns, and a
 * CSS transition already re-targets from its current computed value, so
 * switching capability mid-flight is continuous rather than a jump.
 */

type Cell = { x: number; y: number; w: number; h: number; o?: number; r?: number };

type Capability = {
  id: string;
  title: Copy;
  body: Copy;
  glyph: string;
  /** Eight cells. Index is stable across states — that is what makes it morph. */
  cells: Cell[];
};

const CAPABILITIES: Capability[] = [
  {
    id: "websites",
    title: c("Websites that sell", "Des sites qui vendent", "مواقع كاتبيع"),
    body: c("Shops, landing pages and company websites that people actually buy from.", "Boutiques, pages et sites d’entreprise qui transforment les visites en clients.", "متاجر وصفحات ومواقع ديال الشركات اللي كتحوّل الزوّار لزبناء."),
    glyph: "M12 22h56v44H12z M12 32h56 M19 27h2 M26 27h2 M33 27h2 M18 40h26v19H18z M50 40h12v7H50z M50 52h12v7H50z",
    cells: [
      { x: 3, y: 5, w: 94, h: 7, r: 3 },
      { x: 3, y: 17, w: 55, h: 34, r: 4 },
      { x: 61, y: 17, w: 36, h: 34, r: 4 },
      { x: 3, y: 56, w: 29, h: 22, r: 4 },
      { x: 36, y: 56, w: 28, h: 22, r: 4 },
      { x: 68, y: 56, w: 29, h: 22, r: 4 },
      { x: 3, y: 83, w: 94, h: 11, r: 3 },
      { x: 80, y: 5, w: 17, h: 7, o: 1, r: 20 },
    ],
  },
  {
    id: "brand",
    title: c("Brands people remember", "Des marques qu’on retient", "ماركات كتبقى فالبال"),
    body: c("A name, a look and the campaigns that carry them.", "Un nom, une identité et des campagnes qui leur donnent vie.", "سمية، شكل وحملات اللي كتعطيهم الحياة."),
    glyph: "M40 8l8 23 24 1-19 14 7 23-20-14-20 14 7-23-19-14 24-1z",
    cells: [
      { x: 3, y: 5, w: 45, h: 57, r: 4 },
      { x: 52, y: 5, w: 21, h: 21, r: 20 },
      { x: 77, y: 5, w: 20, h: 21, r: 4 },
      { x: 52, y: 30, w: 45, h: 14, r: 4 },
      { x: 52, y: 48, w: 45, h: 14, r: 4 },
      { x: 3, y: 66, w: 45, h: 9, r: 3 },
      { x: 52, y: 66, w: 45, h: 9, r: 3 },
      { x: 3, y: 80, w: 94, h: 4, o: 0.6, r: 2 },
    ],
  },
  {
    id: "growth",
    title: c("Growth that brings people in", "Une croissance qui attire", "نمو كيجيب الزبناء"),
    body: c("Google, social and search — then steady improvement on what works.", "Google, réseaux et recherche — puis une amélioration continue de ce qui marche.", "گوگل، السوشيال والبحث — ومن بعد كنحسّنو اللي خدام."),
    glyph: "M10 62l18-18 12 9 24-27 M53 26h11v11 M10 69h56 M16 56v13 M29 49v20 M42 42v27 M55 33v36",
    cells: [
      { x: 34, y: 38, w: 32, h: 24, r: 6 },
      { x: 3, y: 8, w: 21, h: 13, r: 20 },
      { x: 76, y: 8, w: 21, h: 13, r: 20 },
      { x: 3, y: 72, w: 21, h: 13, r: 20 },
      { x: 76, y: 72, w: 21, h: 13, r: 20 },
      { x: 38, y: 6, w: 24, h: 11, r: 20 },
      { x: 38, y: 78, w: 24, h: 11, r: 20 },
      { x: 3, y: 92, w: 94, h: 3, o: 0.5, r: 2 },
    ],
  },
  {
    id: "systems",
    title: c("Systems that save time", "Des systèmes qui libèrent du temps", "أنظمة كتوفّر الوقت"),
    body: c("Follow-up, customer records and the repetitive work handled for you.", "Le suivi, les dossiers clients et les tâches répétitives pris en charge.", "المتابعة، معلومات الزبناء والخدمة اللي كتعاود كتخدم بوحدها."),
    glyph: "M13 15h54v50H13z M13 28h54 M23 39h20 M23 48h32 M23 57h15 M55 40l6 6-6 6",
    cells: [
      { x: 5, y: 5, w: 90, h: 13, r: 4 },
      { x: 5, y: 22, w: 90, h: 11, r: 3 },
      { x: 5, y: 36, w: 90, h: 11, r: 3 },
      { x: 5, y: 50, w: 90, h: 11, r: 3 },
      { x: 5, y: 64, w: 42, h: 11, r: 3 },
      { x: 53, y: 64, w: 42, h: 11, r: 3 },
      { x: 5, y: 78, w: 90, h: 11, r: 3 },
      { x: 5, y: 92, w: 32, h: 4, o: 1, r: 20 },
    ],
  },
  {
    id: "ecommerce",
    title: c("Shops that take orders", "Des boutiques qui reçoivent des commandes", "متاجر كتاخد الطلبيات"),
    body: c("Product pages, baskets and a checkout that works on a phone.", "Fiches produits, paniers et paiement qui fonctionnent sur téléphone.", "صفحات المنتجات، السلّة والخلاص خدامين مزيان فالتلفون."),
    glyph: "M24 31h37l-4 28H28z M31 31v-7a9 9 0 0 1 18 0v7 M32 48h18 M36 66h1 M52 66h1",
    cells: [
      { x: 3, y: 5, w: 94, h: 8, r: 3 },
      { x: 3, y: 17, w: 46, h: 46, r: 5 },
      { x: 53, y: 17, w: 44, h: 21, r: 5 },
      { x: 53, y: 42, w: 44, h: 21, r: 5 },
      { x: 3, y: 67, w: 29, h: 10, r: 3 },
      { x: 36, y: 67, w: 28, h: 10, r: 3 },
      { x: 68, y: 67, w: 29, h: 10, r: 3 },
      { x: 3, y: 82, w: 94, h: 12, o: 1, r: 4 },
    ],
  },
  {
    id: "ai",
    title: c("Systems that think", "Des systèmes qui réfléchissent", "أنظمة كتفكّر"),
    body: c("Automation, assistants and follow-up that handles itself.", "Automatisations, assistants et suivi qui se font tout seuls.", "أتمتة، مساعدين ومتابعة كيدبّرو راسهم."),
    glyph: "M40 40l-22-19 M40 40l22-19 M40 40l-22 19 M40 40l22 19 M40 40V11 M40 40v29 M31 40h18 M14 21h8 M58 21h8 M14 59h8 M58 59h8",
    cells: [
      { x: 33, y: 34, w: 34, h: 26, r: 9 },
      { x: 4, y: 8, w: 20, h: 12, r: 20 },
      { x: 40, y: 4, w: 20, h: 12, r: 20 },
      { x: 76, y: 8, w: 20, h: 12, r: 20 },
      { x: 4, y: 44, w: 20, h: 12, r: 20 },
      { x: 76, y: 44, w: 20, h: 12, r: 20 },
      { x: 40, y: 78, w: 20, h: 12, r: 20 },
      { x: 4, y: 78, w: 26, h: 5, o: 1, r: 20 },
    ],
  },
];

export function WhatWeBuild({ locale }: { locale: string }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const narrow = useMediaQuery("(max-width: 1023px)", true);

  // On narrow screens there is no hover to respond to, so whichever row is
  // nearest the middle of the viewport takes the stage.
  useEffect(() => {
    if (!narrow || reduced) return;
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = items.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [narrow, reduced]);

  const cells = CAPABILITIES[active].cells;

  return (
    <section className="py-24 md:py-32" aria-labelledby="build-heading">
      <div className="shell">
        <p className="eyebrow">{tr(locale, c("Capabilities", "Expertises", "شنو كنصاوبو"))}</p>
        <TextReveal
          id="build-heading"
          as="h2"
          text={tr(locale, c("What we build", "Ce que nous créons", "شنو كنصاوبو"))}
          className="mt-6 max-w-[12ch] text-[length:var(--text-display)] leading-[0.92]"
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* The stage. Sticky on desktop so it stays beside whichever row is
              being read. */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              <div className="spatial-object capability-stage relative aspect-[4/3] w-full rounded-2xl border border-line [perspective:850px] [transform-style:preserve-3d]">
                {cells.map((c, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      "capability-cell absolute border border-mineral/20 bg-mineral/[0.035]",
                      !reduced &&
                        "transition-[left,top,width,height,opacity,border-radius,transform] duration-[700ms] ease-[var(--ease)]",
                      i === 7 && "bg-lume/30",
                    )}
                    style={{
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      width: `${c.w}%`,
                      height: `${c.h}%`,
                      opacity: c.o ?? 0.85,
                      borderRadius: `${c.r ?? 4}px`,
                      transform: `translateZ(${[32, 68, 88, 24, 52, 72, 18, 110][i]}px)`,
                      transitionDelay: reduced ? undefined : `${i * 42}ms`,
                    }}
                  />
                ))}
                <motion.svg
                  key={CAPABILITIES[active].id}
                  className="capability-glyph pointer-events-none absolute bottom-7 right-7 z-20 h-[29%] w-[29%] text-mineral/85 md:bottom-10 md:right-10"
                  viewBox="0 0 80 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  initial={reduced ? false : { opacity: 0, rotate: -8, scale: 0.85 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 145, damping: 22 }}
                >
                  <motion.path d={CAPABILITIES[active].glyph} initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
                </motion.svg>
                <div className="capability-stage__footer absolute bottom-5 start-5 z-20 font-display text-[clamp(1.1rem,2.2vw,2rem)] italic text-mineral/80 md:bottom-8 md:start-8">
                  {tr(locale, CAPABILITIES[active].title)}
                </div>
              </div>
            </div>
          </div>

          <ul ref={listRef} className="order-1 lg:order-2 lg:col-span-6">
            {CAPABILITIES.map((c, i) => {
              const on = i === active;
              return (
                <li key={c.id} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    onMouseEnter={() => !narrow && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="block w-full py-8 text-start md:py-10"
                  >
                    <h3
                      className={cn(
                        "font-display text-[clamp(1.6rem,3.4vw,2.7rem)] leading-[1.02] transition-all duration-[var(--dur)] ease-[var(--ease)]",
                        on ? "ltr:translate-x-2 rtl:-translate-x-2 text-mineral" : "text-silver",
                      )}
                    >
                      {tr(locale, c.title)}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 max-w-[42ch] transition-all duration-[var(--dur)] ease-[var(--ease)]",
                        on ? "ltr:translate-x-2 rtl:-translate-x-2 text-grey" : "text-grey-deep",
                      )}
                    >
                      {tr(locale, c.body)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </section>
  );
}
