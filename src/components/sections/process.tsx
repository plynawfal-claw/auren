"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { TextReveal } from "@/components/motion/text-reveal";
import { EditorialImageSlot } from "@/components/motion/editorial-image-slot";
import { cn } from "@/lib/cn";
import { c, tr } from "@/i18n/copy";
import { editorialImages } from "@/content/editorial-images";

/**
 * How we work.
 *
 * A journey rather than a grid: one line runs down the page and each stage
 * lights as you reach it. Four stages, because a client can hold four.
 *
 * Numbered legitimately — these genuinely happen in order, each one using what
 * the previous produced.
 */
const STAGES = [
  {
    n: "01",
    title: c("Understand", "Comprendre", "نفهمو"),
    body: c("We learn what you sell, who should be buying it, and what is getting in the way.", "Nous découvrons ce que vous vendez, à qui, et ce qui freine les ventes.", "كنفهمو شنو كتبيع، شكون خاصّو يشري، وشنو واقف فالطريق."),
    note: c("A week of questions", "Une semaine de questions", "سيمانة ديال الأسئلة"),
  },
  {
    n: "02",
    title: c("Shape", "Donner forme", "نشكّلو"),
    body: c("We decide how it should look, how it should sound, and how it should work.", "Nous définissons son apparence, sa voix et son fonctionnement.", "كنحدّدو كيفاش غادي يبان، يهضر ويخدم."),
    note: c("One direction, written down", "Une direction claire", "اتجاه واضح ومكتوب"),
  },
  {
    n: "03",
    title: c("Build", "Construire", "نبنيو"),
    body: c("We make the website, the app, the campaign — and the follow-up behind it.", "Nous créons le site, l’application, la campagne et le suivi qui les accompagne.", "كنصاوبو الموقع، التطبيق، الحملة والمتابعة اللي وراهم."),
    note: c("Shown in finished pieces", "Des réalisations concrètes", "خدمة كاملة كتشوفها"),
  },
  {
    n: "04",
    title: c("Grow", "Faire grandir", "نكبّرو"),
    body: c("We launch, watch what people actually do, and improve it from there.", "Nous lançons, observons les usages réels et améliorons ce qui compte.", "كنطلقو، كنشوفو شنو كيديرو الناس، وكنحسّنو من تما."),
    note: c("Ongoing, not a hand-off", "Un travail qui continue", "الخدمة كتبقى مستمرة"),
  },
] as const;

export function Process({ locale }: { locale: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  // Under reduced motion every stage is lit from the start — derived, not set
  // in an effect, so there is no frame where the journey renders unlit.
  const reached = reduced ? STAGES.length - 1 : scrolled;

  useEffect(() => {
    if (reduced) return;
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = items.indexOf(e.target as HTMLElement);
          // Only ever moves forward — a stage you have passed stays lit.
          if (i >= 0) setScrolled((r) => (i > r ? i : r));
        });
      },
      { rootMargin: "-35% 0px -40% 0px", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced]);

  const pct = ((reached + 1) / STAGES.length) * 100;

  return (
    <section className="py-24 md:py-32" aria-labelledby="process-heading">
      <div className="shell">
        <div className="grid items-end gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow">{tr(locale, c("How we work", "Notre méthode", "كيفاش كنخدمو"))}</p>
            <TextReveal
              id="process-heading"
              as="h2"
              text={tr(locale, c("Four steps, in this order.", "Quatre étapes, dans cet ordre.", "أربع مراحل، وحدة مور وحدة."))}
              className="mt-6 max-w-[16ch] text-[length:var(--text-display)] leading-[0.94]"
            />
          </div>
          <EditorialImageSlot
            id="process"
            src={editorialImages.process.src}
            alt={tr(locale, editorialImages.process.alt)}
            width={4}
            height={3}
            className="w-full"
            overlay={<div className="process-image-caption absolute inset-x-0 bottom-0 px-7 pb-7 pt-20 md:px-10 md:pb-10">
              <p className="max-w-[17ch] font-display text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.04] text-mineral">
                {tr(locale, c("A clear path from the first question to what comes next.", "Un chemin clair de la première question à la suite.", "طريق واضح من أول سؤال للخطوة الجاية."))}
              </p>
            </div>}
          >
            <div className="process-art absolute inset-0">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" fill="none" aria-hidden="true">
                <path d="M-20 210C60 100 110 260 180 130S295 105 430 30" stroke="var(--color-lume)" strokeWidth="1.2" opacity=".62" />
                <path d="M-20 245C80 135 105 285 190 155S310 128 430 62" stroke="var(--color-mineral)" strokeWidth=".7" opacity=".22" />
                <circle cx="70" cy="163" r="4" fill="var(--color-lume)" />
                <circle cx="181" cy="129" r="4" fill="var(--color-lume)" />
                <circle cx="300" cy="90" r="4" fill="var(--color-lume)" />
                <circle cx="385" cy="49" r="4" fill="var(--color-lume)" />
              </svg>
            </div>
          </EditorialImageSlot>
        </div>

        <div className="relative mt-20">
          {/* The line, and the part of it you have travelled. */}
          <span
            aria-hidden="true"
            className="absolute start-[7px] top-2 bottom-2 w-px bg-line md:start-1/2 md:-translate-x-1/2"
          />
          <span
            aria-hidden="true"
            className="absolute start-[7px] top-2 w-px origin-top bg-lume/70 transition-[height] duration-[900ms] ease-[var(--ease)] md:start-1/2 md:-translate-x-1/2"
            style={{ height: `calc(${pct}% - 1rem)` }}
          />

          <ol ref={listRef} className="space-y-20 md:space-y-28">
            {STAGES.map((s, i) => {
              const on = i <= reached;
              return (
                <li
                  key={s.n}
                  className={cn(
                    "relative ps-10 md:grid md:grid-cols-2 md:gap-16 md:ps-0",
                    i % 2 === 1 && "md:[&>div:first-child]:col-start-2",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                    "absolute start-0 top-2 h-3.5 w-3.5 rounded-full border transition-all duration-500 ease-[var(--ease)] md:start-1/2 md:-translate-x-1/2",
                      on
                        ? "scale-100 border-lume bg-lume"
                        : "scale-75 border-line-strong bg-graphite",
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-700 ease-[var(--ease)]",
                      i % 2 === 1 ? "md:ps-16" : "md:pe-16 md:text-end",
                      on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-45",
                    )}
                  >
                    <div className="spatial-object process-stage p-6 md:p-8">
                      <span className="font-mono text-[0.68rem] tracking-[0.18em] text-grey">
                        {s.n}
                      </span>
                      <h3 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-none">
                        {tr(locale, s.title)}
                      </h3>
                      <p className="mt-4 max-w-[38ch] leading-relaxed text-silver md:inline-block">
                        {tr(locale, s.body)}
                      </p>
                      <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">
                        {tr(locale, s.note)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
