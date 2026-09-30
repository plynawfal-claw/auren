"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { EditorialImageSlot } from "@/components/motion/editorial-image-slot";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReadingLine } from "@/lib/use-reading-line";
import { c, tr, type Copy } from "@/i18n/copy";
import { editorialImages } from "@/content/editorial-images";

type Step = { id: string; title: Copy; detail: Copy; signal: Copy };

const steps: Step[] = [
  {
    id: "input",
    title: c("Customer / input", "Client / demande", "الزبون / الطلب"),
    detail: c("A question, an order or a new lead arrives.", "Une question, une commande ou un nouveau contact arrive.", "كيجي سؤال، طلبية ولا زبون جديد."),
    signal: c("I’m interested. What happens next?", "Je suis intéressé. Quelle est la suite ?", "مهتم. شنو الخطوة الجاية؟"),
  },
  {
    id: "understand",
    title: c("AI understands", "L’IA comprend", "الذكاء كيفهم"),
    detail: c("The need and context become clear, without another form.", "Le besoin et le contexte deviennent clairs, sans autre formulaire.", "كيفهم شنو بغا الزبون والسياق بلا فورمولير آخر."),
    signal: c("Intent · context · timing", "Intention · contexte · moment", "النية · السياق · الوقت"),
  },
  {
    id: "decide",
    title: c("The system decides", "Le système décide", "السيستم كيقرّر"),
    detail: c("The right next step is chosen and routed to the right place.", "La bonne suite est choisie et envoyée au bon endroit.", "كيختار الخطوة المناسبة ويوجّهها للبلاصة الصحيحة."),
    signal: c("Qualify → route", "Qualifier → orienter", "يفهم ← يوجّه"),
  },
  {
    id: "action",
    title: c("Action / automation", "Action / automatisation", "التنفيذ / الأتمتة"),
    detail: c("A reply, task or hand-off happens while the moment is fresh.", "Une réponse, une tâche ou un relais part au bon moment.", "الجواب ولا المهمة كتدار فالوقت المناسب."),
    signal: c("Reply sent · task created", "Réponse envoyée · tâche créée", "الجواب تصيفط · المهمة تسجلات"),
  },
  {
    id: "followup",
    title: c("Follow-up", "Suivi", "المتابعة"),
    detail: c("Nothing disappears when the first exchange ends.", "Rien ne se perd après le premier échange.", "حتى حاجة ما كتضيع من بعد أول تواصل."),
    signal: c("Next conversation, already in motion", "La suite est déjà en route", "المتابعة راه بدات"),
  },
  {
    id: "result",
    title: c("Business result", "Résultat concret", "نتيجة للبيزنس"),
    detail: c("More of the right opportunities reach a real outcome.", "Plus d’occasions utiles aboutissent à un vrai résultat.", "فرص أكثر كتوصل لنتيجة حقيقية."),
    signal: c("Every lead has a next step", "Chaque contact a une suite", "كل زبون عندو الخطوة الجاية"),
  },
];

export function IntelligentSystems({ locale }: { locale: string }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const narrow = useMediaQuery("(max-width: 767px)", true);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 75, damping: 25 });
  const sweep = useTransform(progress, [0.08, 0.78], [0, 1]);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Phones pin the image above the steps; the step passing just under it is
  // the one it shows. A tap picks a step and holds it for a short scroll,
  // then scroll drives again.
  const hold = useReadingLine(narrow, stageRef, listRef, setActive);

  return (
    <section ref={section} className="systems-section relative overflow-clip border-y border-line py-24 md:py-36" aria-labelledby="systems-heading">
      <div className="shell">
        <div className="grid items-end gap-7 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
          <h2 id="systems-heading" className="max-w-[12ch] font-display text-[length:var(--text-display)] leading-[0.98]">
            {tr(locale, c("Systems that think.", "Des systèmes qui réfléchissent.", "أنظمة كتفكّر."))}
          </h2>
          <p className="max-w-[42ch] leading-relaxed text-silver">
            {tr(locale, c(
              "From the first customer message to the result it creates — every useful part of your business works together.",
              "Du premier message du client au résultat qu’il produit — chaque partie utile de votre activité travaille ensemble.",
              "من أول رسالة ديال الزبون حتى للنتيجة — كل جزء مهم فالبيزنس ديالك كيخدم مع الباقي.",
            ))}
          </p>
        </div>

        <div className="mt-12 grid items-start gap-10 md:mt-20 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-14">
          {/* Sticky at every width. `overflow-clip` on the section rather than
              `overflow-hidden`: hidden makes the section a scroll container,
              which silently disabled this sticky on desktop too. */}
          <div ref={stageRef} className="systems-pin sticky top-16 z-10 pb-8 pt-3 md:top-28 md:z-auto md:p-0">
            <EditorialImageSlot
              id="systems"
              src={editorialImages.systems[active].src}
              nextSrc={editorialImages.systems[(active + 1) % editorialImages.systems.length].src}
              alt={tr(locale, editorialImages.systems[active].alt)}
              width={4}
              height={5}
              className="systems-image mx-auto w-full max-w-[580px]"
              overlay={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={steps[active].id}
                    className="systems-art__message absolute inset-x-[9%] bottom-[9%] rounded-2xl p-5 md:p-7"
                    initial={reduced ? false : { opacity: 0, y: 18, rotateX: -8 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block font-display text-[clamp(1.4rem,3vw,2.6rem)] leading-[1.05] text-mineral">{tr(locale, steps[active].title)}</span>
                    <span className="mt-3 block text-sm leading-relaxed text-silver">{tr(locale, steps[active].signal)}</span>
                  </motion.div>
                </AnimatePresence>
              }
            >
              <div className="systems-art absolute inset-0 overflow-hidden">
                <motion.svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500" fill="none" aria-hidden="true">
                  <motion.path d="M-30 320C90 340 70 120 195 150S330 360 440 140" stroke="var(--color-lume)" strokeWidth="1.2" opacity=".42" style={reduced ? undefined : { pathLength: sweep }} />
                  <motion.path d="M-30 360C100 380 105 205 200 215S355 425 440 230" stroke="var(--color-mineral)" strokeWidth=".8" opacity=".22" style={reduced ? undefined : { pathLength: sweep }} />
                  <circle cx="198" cy="224" r="95" stroke="var(--color-lume)" opacity=".17" />
                  <circle cx="198" cy="224" r="135" stroke="var(--color-lume)" opacity=".08" />
                  <circle cx="198" cy="224" r="5" fill="var(--color-lume)" />
                </motion.svg>
                <div className="systems-art__orb absolute left-1/2 top-[45%] flex aspect-square w-[45%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
                  <svg className="h-[55%] w-[55%]" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                    <path d="M50 4C61 26 74 39 96 50C74 61 61 74 50 96C39 74 26 61 4 50C26 39 39 26 50 4Z" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M50 17v17M50 66v17M17 50h17M66 50h17" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                <span className="systems-art__spark absolute end-[12%] top-[13%] h-2 w-2 rounded-full bg-lume" aria-hidden="true" />
                <span className="systems-art__spark systems-art__spark--late absolute start-[13%] top-[27%] h-1.5 w-1.5 rounded-full bg-lume" aria-hidden="true" />
              </div>
            </EditorialImageSlot>
          </div>

          <ol ref={listRef} className="systems-steps border-t border-line">
            {steps.map((step, index) => (
              <motion.li
                key={step.id}
                className="border-b border-line"
                initial={reduced ? false : { opacity: 0.4, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  className="systems-step group flex w-full items-start gap-5 py-6 text-start md:py-8"
                  data-active={active === index}
                  aria-pressed={active === index}
                  onClick={() => { setActive(index); hold(); }}
                  onFocus={() => setActive(index)}
                  onMouseEnter={() => { if (!narrow) setActive(index); }}
                >
                  <span className="systems-step__pulse relative mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full border border-lume/70" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[clamp(1.35rem,2.4vw,2.25rem)] leading-[1.08] text-mineral">{tr(locale, step.title)}</span>
                    <span className="mt-2 block max-w-[38ch] text-sm leading-relaxed text-grey md:text-base">{tr(locale, step.detail)}</span>
                    <span className="systems-step__signal mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[0.6rem] text-silver md:text-[0.66rem]">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-lume" aria-hidden="true" />
                      <span className="truncate">{tr(locale, step.signal)}</span>
                    </span>
                  </span>
                  <span className="mt-1 text-xl text-grey transition-transform group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1" aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                </button>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
