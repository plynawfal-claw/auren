"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { contact } from "@/config/site";
import { c, tr, type Copy } from "@/i18n/copy";

const stages = [
  c("I’m starting or building something new", "Je lance ou construis quelque chose de nouveau", "كنبدا ولا كنبني شي حاجة جديدة"),
  c("My business works, but I want more customers", "Mon activité fonctionne, mais je veux plus de clients", "البيزنس ديالي خدام، ولكن بغيت زبناء أكثر"),
  c("My business is established and I want better systems and long-term growth", "Mon activité est établie et je veux de meilleurs systèmes et une croissance durable", "البيزنس ديالي واقف على رجليه وبغيت سيستيمات أحسن ونمو على المدى الطويل"),
];

const services = [
  c("Website / landing page", "Site web / page de destination", "موقع / صفحة استقبال"),
  c("E-commerce", "E-commerce", "متجر إلكتروني"),
  c("Branding / creative", "Identité / création", "هوية بصرية / إبداع"),
  c("Meta / social advertising", "Publicité Meta / réseaux sociaux", "إعلانات ميتا / السوشيال ميديا"),
  c("Google / search growth", "Google / visibilité sur les moteurs de recherche", "غوغل / الظهور فالبحث"),
  c("AI automation", "Automatisation par l’IA", "أتمتة بالذكاء الاصطناعي"),
  c("CRM / business systems", "CRM / systèmes métier", "CRM / سيستيمات ديال البيزنس"),
  c("Content / campaign creative", "Contenu / création de campagne", "محتوى / إبداع للحملات"),
  c("I’m not sure — help me choose", "Je ne sais pas encore — aidez-moi à choisir", "مازال ما عرفت — عاونوني نختار"),
];

const methods = [
  c("WhatsApp", "WhatsApp", "واتساب"),
  c("Email", "E-mail", "الإيميل"),
  c("Phone", "Téléphone", "التليفون"),
];

const questions = [
  c("What describes you best?", "Quelle situation vous décrit le mieux ?", "شنو كيوصف الوضع ديالك؟"),
  c("What do you need?", "De quoi avez-vous besoin ?", "شنو محتاج؟"),
  c("Tell us a little about it.", "Parlez-nous-en en quelques mots.", "قول لينا عليه بشوية."),
  c("How can we reach you?", "Comment pouvons-nous vous contacter ?", "كيفاش نقدروا نتاصلو بيك؟"),
];

const panel = "rounded-[1.5rem] border border-line bg-graphite p-6 sm:p-8 md:p-10";
const field = "w-full rounded-xl border border-line-strong bg-ink px-4 py-3.5 text-base text-mineral outline-none transition-colors focus:border-lume";
const action = "inline-flex min-h-12 items-center justify-center rounded-full bg-mineral px-7 py-3 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-[transform,opacity] duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
const backAction = "min-h-12 rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] text-mineral transition-[border-color,transform] duration-200 hover:border-lume active:scale-[0.98]";

function localizedMessage(locale: string, stage: Copy, selected: Copy[], description: string, name: string, business: string, method: Copy) {
  const lines = {
    en: [
      "Hello AUREN,",
      "I’d like to start a project.",
      `Business stage: ${tr(locale, stage)}`,
      `Looking for: ${selected.map((item) => tr(locale, item)).join(", ")}`,
      ...(description.trim() ? [`Project: ${description.trim()}`] : []),
      `Name: ${name.trim()}`,
      ...(business.trim() ? [`Business: ${business.trim()}`] : []),
      `Preferred contact: ${tr(locale, method)}`,
    ],
    fr: [
      "Bonjour AUREN,",
      "J’aimerais lancer un projet.",
      `Situation : ${tr(locale, stage)}`,
      `Besoins : ${selected.map((item) => tr(locale, item)).join(", ")}`,
      ...(description.trim() ? [`Projet : ${description.trim()}`] : []),
      `Nom : ${name.trim()}`,
      ...(business.trim() ? [`Entreprise : ${business.trim()}`] : []),
      `Contact préféré : ${tr(locale, method)}`,
    ],
    ar: [
      "سلام AUREN،",
      "بغيت نبدا مشروع.",
      `الوضع ديال البيزنس: ${tr(locale, stage)}`,
      `شنو محتاج: ${selected.map((item) => tr(locale, item)).join("، ")}`,
      ...(description.trim() ? [`المشروع: ${description.trim()}`] : []),
      `الاسم: ${name.trim()}`,
      ...(business.trim() ? [`البيزنس: ${business.trim()}`] : []),
      `طريقة التواصل المفضلة: ${tr(locale, method)}`,
    ],
  };
  return lines[locale === "fr" || locale === "ar" ? locale : "en"].join("\n\n");
}

export function StartProjectQuestionnaire({ locale }: { locale: string }) {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [method, setMethod] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const canContinue = step === 0 ? stage !== null : step === 1 ? selected.length > 0 : step === 3 ? name.trim().length > 0 : true;
  const ready = stage !== null && selected.length > 0 && name.trim().length > 0;
  const message = ready
    ? localizedMessage(locale, stages[stage], selected.map((index) => services[index]), description, name, business, methods[method])
    : "";
  const whatsappHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    if (step === 0) return;
    const timer = window.setTimeout(() => heading.current?.focus(), reduced ? 0 : 250);
    return () => window.clearTimeout(timer);
  }, [step, reduced]);

  function advance() {
    if (canContinue && step < 4) setStep(step + 1);
  }

  function toggleService(index: number) {
    setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index].sort((a, b) => a - b));
  }

  return (
    <div className={panel} data-project-questionnaire>
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{tr(locale, c("A few short answers", "Quelques réponses rapides", "غير شي أجوبة خفاف"))}</p>
        <Link href="/" className="min-h-11 shrink-0 rounded-full border border-line-strong px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-wider text-silver hover:text-mineral" aria-label={tr(locale, c("Close and return home", "Fermer et revenir à l’accueil", "سد ورجع للرئيسية"))}>
          {tr(locale, c("Close ×", "Fermer ×", "سد ×"))}
        </Link>
      </div>
      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label={tr(locale, c("Questionnaire progress", "Avancement du questionnaire", "تقدم الأسئلة"))}>
        {questions.map((question, index) => (
          <li key={question.en} aria-current={step === index ? "step" : undefined} className="relative h-1 overflow-hidden rounded-full bg-line-strong" aria-label={tr(locale, c(`Step ${index + 1}`, `Étape ${index + 1}`, `المرحلة ${index + 1}`))}>
            {/* The segment fills along the reading direction instead of
                snapping colour, so moving forward reads as progress. */}
            <span aria-hidden="true" className={`absolute inset-0 origin-left bg-lume transition-transform duration-[350ms] ease-[var(--ease)] rtl:origin-right ${index <= step ? "scale-x-100" : "scale-x-0"}`} />
          </li>
        ))}
      </ol>
      <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-grey">
        {step < 4 ? tr(locale, c(`${step + 1} / 4`, `${step + 1} / 4`, `${step + 1} / 4`)) : tr(locale, c("Ready", "Prêt", "واجد"))}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5"
        >
          <h2 ref={heading} tabIndex={-1} className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] outline-none">
            {step === 4 ? tr(locale, c("Your project starts here.", "Votre projet commence ici.", "المشروع ديالك كيبدا من هنا.")) : tr(locale, questions[step])}
          </h2>
          {step === 0 && (
            <fieldset className="mt-8 space-y-3">
              <legend className="sr-only">{tr(locale, questions[0])}</legend>
              {stages.map((item, index) => (
                <label key={item.en} className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border p-4 text-start transition-[border-color,background-color,scale] duration-200 [-webkit-tap-highlight-color:transparent] active:scale-[0.99] ${stage === index ? "border-lume bg-lume/10" : "border-line-strong hover:border-silver"}`}>
                  <input type="radio" name="stage" value={index} checked={stage === index} onChange={() => setStage(index)} className="h-5 w-5 shrink-0 accent-[#c69b63]" />
                  <span className="leading-snug text-mineral">{tr(locale, item)}</span>
                </label>
              ))}
            </fieldset>
          )}
          {step === 1 && (
            <fieldset className="mt-8">
              <legend className="mb-5 text-sm text-silver">{tr(locale, c("Choose any that fit.", "Choisissez tout ce qui correspond.", "اختار كلشي اللي كيناسبك."))}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((item, index) => (
                  <label key={item.en} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 text-start transition-[border-color,background-color,scale] duration-200 [-webkit-tap-highlight-color:transparent] active:scale-[0.99] ${selected.includes(index) ? "border-lume bg-lume/10" : "border-line-strong hover:border-silver"}`}>
                    <input type="checkbox" checked={selected.includes(index)} onChange={() => toggleService(index)} className="h-5 w-5 shrink-0 accent-[#c69b63]" />
                    <span className="text-sm leading-snug text-mineral">{tr(locale, item)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {step === 2 && (
            <div className="mt-8">
              <label htmlFor="project-description" className="mb-3 block text-sm text-silver">{tr(locale, c("A sentence or two is enough. Optional.", "Une ou deux phrases suffisent. Facultatif.", "جملة ولا جوج كافيين. اختياري."))}</label>
              <textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} maxLength={800} placeholder={tr(locale, c("What are you hoping to make or improve?", "Qu’aimeriez-vous créer ou améliorer ?", "شنو بغيتي تصاوب ولا تحسّن؟"))} className={`${field} resize-y`} dir={locale === "ar" ? "rtl" : "ltr"} />
            </div>
          )}
          {step === 3 && (
            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="project-name" className="mb-2 block text-sm text-silver">{tr(locale, c("Your name", "Votre nom", "الاسم ديالك"))} *</label>
                <input id="project-name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className={field} dir="auto" />
              </div>
              <div>
                <label htmlFor="project-business" className="mb-2 block text-sm text-silver">{tr(locale, c("Business or brand name (optional)", "Entreprise ou marque (facultatif)", "البيزنس ولا الماركة (اختياري)"))}</label>
                <input id="project-business" type="text" autoComplete="organization" value={business} onChange={(event) => setBusiness(event.target.value)} className={field} dir="auto" />
              </div>
              <fieldset>
                <legend className="mb-3 text-sm text-silver">{tr(locale, c("How would you prefer us to reply?", "Comment préférez-vous que nous répondions ?", "كيفاش بغيتي نجاوبوك؟"))}</legend>
                <div className="flex flex-wrap gap-3">
                  {methods.map((item, index) => (
                    <label key={item.en} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm ${method === index ? "border-lume bg-lume/10 text-mineral" : "border-line-strong text-silver"}`}>
                      <input type="radio" name="method" checked={method === index} onChange={() => setMethod(index)} className="accent-[#c69b63]" />
                      {tr(locale, item)}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}
          {step === 4 && (
            <div className="mt-7">
              <p className="max-w-[48ch] leading-relaxed text-silver">{tr(locale, c("Your answers are ready. The next button opens WhatsApp with your message prepared for review. Nothing is sent until you send it.", "Vos réponses sont prêtes. Le bouton ouvre WhatsApp avec votre message préparé. Rien n’est envoyé avant votre confirmation.", "الأجوبة واجدين. الزر كايحل واتساب بالرسالة واجدة للمراجعة. حتى حاجة ما كتتصيفط حتى تصيفطها نتا."))}</p>
              <div className="mt-7 rounded-2xl border border-line-strong bg-ink p-5">
                <p className="eyebrow">{tr(locale, c("Your message", "Votre message", "الرسالة ديالك"))}</p>
                <pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-silver" dir={locale === "ar" ? "rtl" : "ltr"}>{message}</pre>
              </div>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${action} mt-7`}>
                {tr(locale, c("Continue to WhatsApp ↗", "Continuer sur WhatsApp ↗", "كمّل فواتساب ↗"))}
              </a>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {step < 4 && (
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className={backAction}>{tr(locale, c("← Back", "← Retour", "رجع →"))}</button>}
          <button type="button" onClick={advance} disabled={!canContinue} className={action}>{tr(locale, c(step === 3 ? "Review answers →" : "Continue →", step === 3 ? "Vérifier les réponses →" : "Continuer →", step === 3 ? "راجع الأجوبة ←" : "كمّل ←"))}</button>
        </div>
      )}
      {step === 4 && <button type="button" onClick={() => setStep(3)} className={`${backAction} mt-5`}>{tr(locale, c("← Edit answers", "← Modifier", "بدّل الأجوبة →"))}</button>}
    </div>
  );
}
