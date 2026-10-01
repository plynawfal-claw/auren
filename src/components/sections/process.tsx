"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { TextReveal } from "@/components/motion/text-reveal";
import { EditorialImageSlot } from "@/components/motion/editorial-image-slot";
import { ProcessMotion } from "@/components/sections/process-motion";
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

/** Rendered loops, in phase order — see remotion/src/process.tsx. */
const CLIPS = ["01-understand", "02-shape", "03-build", "04-grow"];

export function Process({ locale }: { locale: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  // `current`: the phase nearest the middle of the screen. `furthest`: the
  // deepest phase reached — the line and dots only ever move forward.
  const [current, setCurrent] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  // Under reduced motion every stage is lit from the start — derived, not set
  // in an effect, so there is no frame where the journey renders unlit. The
  // current phase is still tracked: which card is being read is content.
  const reached = reduced ? STAGES.length - 1 : furthest;

  // Follows the scroll, never drives it: no snapping, no locking. Geometry is
  // read fresh each frame it runs, and the visual viewport is watched too, so
  // an iOS toolbar resize cannot leave a stale measurement behind.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best = -1;
      let bestDistance = Infinity;
      Array.from(list.children).forEach((item, i) => {
        const r = item.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDistance) { best = i; bestDistance = d; }
      });
      if (best < 0) return;
      setCurrent(best);
      // A phase counts as reached once its card has come up past the lower
      // third, matching the old observer band.
      const r = list.children[best].getBoundingClientRect();
      if (r.top < window.innerHeight * 0.65) setFurthest((f) => (best > f ? best : f));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const viewport = window.visualViewport;
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    viewport?.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("resize", schedule);
    };
  }, []);

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
              const isCurrent = i === current;
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
                      // The phase being read is fully present; ones already
                      // passed stay readable but calmer; ones ahead wait.
                      !on ? "translate-y-3 opacity-45" : isCurrent ? "translate-y-0 opacity-100" : "translate-y-0 opacity-[0.86]",
                    )}
                  >
                    <div
                      className={cn(
                        "spatial-object process-stage relative p-6 md:p-8",
                        // Text keeps to the timeline side; the visual takes the outer side.
                        i % 2 === 1 ? "md:pe-[42%]" : "md:ps-[42%]",
                      )}
                      data-current={isCurrent}
                    >
                      {/* Phone: the visual shares the top row with the number.
                          Wider: it takes the right of the card, text stays left. */}
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-[0.68rem] tracking-[0.18em] text-grey">
                          {s.n}
                        </span>
                        <ProcessMotion
                          clip={CLIPS[i]}
                          active={isCurrent && on}
                          className={cn(
                            "relative h-[72px] w-24 shrink-0 md:absolute md:top-1/2 md:h-auto md:w-[36%] md:-translate-y-1/2 md:aspect-[4/3]",
                            i % 2 === 1 ? "md:end-6" : "md:start-6",
                          )}
                        />
                      </div>
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
