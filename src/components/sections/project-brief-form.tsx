"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  CREATE_COPY,
  CREATE_OPTIONS,
  OBJECTIVE_COPY,
  OBJECTIVE_OPTIONS,
  PRESENCE_COPY,
  PRESENCE_OPTIONS,
  STAGE_COPY,
  STAGE_OPTIONS,
  TIMELINE_COPY,
  TIMELINE_OPTIONS,
  type Create,
  type Objective,
  type Presence,
  type Stage,
  type Timeline,
} from "@/lib/brief-schema";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { contact } from "@/config/site";
import { tr } from "@/i18n/copy";
import { cn } from "@/lib/cn";

/**
 * The project brief, rebuilt around business stage rather than budget.
 *
 * Seven screens, one decision each. It opens by asking where the visitor's
 * business is — starting out, wanting more clients, or levelling up — because
 * that is the question a studio can actually act on, and asking a Moroccan
 * prospect how much money they have is a worse first move than asking what
 * they are trying to build. No MAD amounts appear anywhere.
 *
 * Every step is a real fieldset in the DOM. Steps are hidden, not unmounted,
 * so answers survive navigating backwards and the browser can restore them.
 *
 * On completion the brief is saved to the configured inbox exactly as before,
 * then the visitor is offered a prefilled WhatsApp message — they press send
 * themselves, in their own app. Nothing is ever sent automatically.
 */
const STEP_COUNT = 7;

type Errors = Record<string, string>;

export function ProjectBriefForm() {
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage | "">("");
  const [create, setCreate] = useState<Create[]>([]);
  const [objective, setObjective] = useState<Objective | "">("");
  const [presence, setPresence] = useState<Presence | "">("");
  const [presenceLink, setPresenceLink] = useState("");
  const [timeline, setTimeline] = useState<Timeline | "">("");
  const [project, setProject] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const mountedAt = useRef(0);
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
    captureAttribution();
    track("start_project", { step: 1 }, true);
  }, []);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const L = (en: string, fr: string, ar: string) => tr(locale, { en, fr, ar });

  function validateStep(i: number): Errors {
    const e: Errors = {};
    if (i === 0 && !stage) e.stage = L("Choose the closest one.", "Choisissez la plus proche.", "اختر الأقرب ليك.");
    if (i === 1 && create.length === 0)
      e.create = L("Choose at least one.", "Choisissez au moins une option.", "اختر واحدة على الأقل.");
    if (i === 2 && !objective)
      e.objective = L("Pick the closest one.", "Choisissez la plus proche.", "اختر الأقرب ليك.");
    if (i === 3 && !presence)
      e.presence = L("Pick one.", "Choisissez une option.", "اختر واحدة.");
    if (i === 4 && !timeline)
      e.timeline = L("Pick the closest option.", "Choisissez la plus proche.", "اختر الأقرب ليك.");
    if (i === 5 && project.trim().length < 10)
      e.project = L("A sentence or two is enough.", "Quelques phrases suffisent.", "شي سطرين كافيين.");
    if (i === 6) {
      if (name.trim().length < 2) e.name = L("Required.", "Obligatoire.", "ضروري.");
      if (phone.trim().length < 6)
        e.phone = L("A WhatsApp number helps us reply.", "Un numéro WhatsApp nous aide à répondre.", "رقم واتساب كيعاونا نجاوبوك.");
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        e.email = L("Use a valid email address.", "Utilisez une adresse e-mail valide.", "استعمل بريد إلكتروني صحيح.");
    }
    return e;
  }

  function goTo(target: number) {
    setErrors({});
    setStep(target);
    track("form_step", { step: target + 1 });
  }

  function next() {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length !== 0) return;
    goTo(Math.min(STEP_COUNT - 1, step + 1));
  }

  /** Stage cards advance on their own once chosen — one tap, forward. */
  function chooseStage(value: Stage) {
    setStage(value);
    setErrors({});
    goTo(1);
  }

  function buildMessage(): string {
    const lines = [
      L("Hello Auren 👋", "Bonjour Auren 👋", "سلام Auren 👋"),
      "",
      L("I just completed my brief.", "Je viens de compléter mon brief.", "غادي كملت البريف ديالي."),
      "",
      L("PROFILE", "PROFIL", "الملف"),
      stage ? tr(locale, STAGE_COPY[stage].label) : "",
      "",
      L("PROJECT", "PROJET", "المشروع"),
      `${L("Type", "Type", "النوع")} : ${create.map((v) => tr(locale, CREATE_COPY[v])).join(", ")}`,
      `${L("Goal", "Objectif", "الهدف")} : ${objective ? tr(locale, OBJECTIVE_COPY[objective]) : ""}`,
      `${L("Current presence", "Présence actuelle", "الحضور الحالي")} : ${presence ? tr(locale, PRESENCE_COPY[presence]) : ""}${presenceLink ? ` (${presenceLink})` : ""}`,
      `${L("Timeline", "Délai", "الأجل")} : ${timeline ? tr(locale, TIMELINE_COPY[timeline]) : ""}`,
      "",
      L("MY PROJECT", "MON PROJET", "المشروع ديالي"),
      project,
      "",
      L("CONTACT", "CONTACT", "معلومات التواصل"),
      `${L("Name", "Nom", "السمية")} : ${name}`,
      company ? `${L("Company", "Entreprise", "الشركة")} : ${company}` : "",
      city ? `${L("City", "Ville", "المدينة")} : ${city}` : "",
      "",
      L("I'd like to discuss it with you.", "Je souhaite en discuter avec vous.", "بغيت نهضر عليه معاكم."),
    ];
    return lines.filter((l) => l !== "").join("\n");
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const all: Errors = {};
    for (let i = 0; i <= 6; i++) Object.assign(all, validateStep(i));
    setErrors(all);
    if (Object.keys(all).length > 0) return;

    setState("sending");
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stage,
          create,
          objective,
          presence,
          presenceLink: presenceLink || undefined,
          timeline,
          project,
          name,
          company: company || undefined,
          city: city || undefined,
          phone,
          email: email || undefined,
          website,
          elapsedMs: mountedAt.current ? Date.now() - mountedAt.current : undefined,
          attribution: readAttribution(),
        }),
      });
      setState(res.ok ? "sent" : "failed");
      if (res.ok) {
        track("form_submit", { stage, create: create.join(", "), timeline }, true);
      }
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    const waUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    return (
      <div className="border border-line bg-graphite p-8 sm:p-10" role="status">
        <p className="eyebrow">{L("Ready", "Prêt", "واجد")}</p>
        <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
          {L("Your brief is ready.", "Votre brief est prêt.", "البريف ديالك واجد.")}
        </h2>
        <p className="mt-5 max-w-[52ch] leading-relaxed text-silver">
          {L(
            "We've saved it. The fastest way to talk it through is WhatsApp — your answers are already written, you just press send.",
            "Nous l'avons enregistré. Le moyen le plus rapide d'en parler est WhatsApp — vos réponses sont déjà écrites, il ne reste qu'à envoyer.",
            "سجلناه. أسرع طريقة نهضرو بيها هي واتساب — الأجوبة ديالك مكتوبين، غير اضغط إرسال.",
          )}
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { source: "brief" }, true)}
          className="magnetic-btn mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-mineral px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-transform duration-[var(--dur)] ease-[var(--ease)] hover:bg-mineral-hi active:scale-[0.97]"
        >
          {L("Continue on WhatsApp", "Continuer sur WhatsApp", "كمل فواتساب")}
          <span aria-hidden="true">→</span>
        </a>
        <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey-deep">
          {contact.whatsappDisplay ?? contact.whatsapp}
        </p>
      </div>
    );
  }

  const field =
    "w-full border border-line bg-graphite px-4 py-3.5 text-mineral placeholder:text-grey-deep " +
    "focus:border-silver focus:outline-none";
  const chip =
    "border px-4 py-3.5 text-left text-[0.95rem] transition-all duration-[var(--dur-fast)]";

  const stepTitle = [
    L("Which situation fits you best?", "Quelle situation vous ressemble le plus ?", "شنو الحالة لي كتشبه ليك أكثر؟"),
    L("What do you want to create?", "Que souhaitez-vous créer ?", "شنو بغيتي تصاوب؟"),
    L("What is your main goal?", "Quel est votre objectif principal ?", "شنو الهدف الرئيسي ديالك؟"),
    L("Do you already have an online presence?", "Vous avez déjà une présence en ligne ?", "واش عندك شي حضور أونلاين؟"),
    L("When do you want to move forward?", "Quand souhaitez-vous avancer ?", "إمتى بغيتي تبدا؟"),
    L("Tell us briefly about your project.", "Parlez-nous rapidement de votre projet.", "هضر لينا شوية على المشروع ديالك."),
    L("How can we reach you?", "Comment peut-on vous joindre ?", "كيفاش نقدرو نتواصلو معاك؟"),
  ];

  return (
    <form onSubmit={submit} noValidate>
      {/* Progress. */}
      <div className="flex items-center gap-4" aria-label="Progress">
        <ol className="flex flex-1 gap-1.5">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <li
              key={i}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "h-px flex-1 transition-colors duration-[var(--dur)]",
                i <= step ? "bg-mineral" : "bg-line",
              )}
            />
          ))}
        </ol>
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey">
          {String(step + 1).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
        </span>
      </div>

      <p
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-8 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight outline-none"
      >
        {stepTitle[step]}
      </p>

      <div className="mt-8 min-h-[300px]">
        {/* 01 — business stage */}
        <fieldset hidden={step !== 0} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[0]}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {STAGE_OPTIONS.map((value, i) => {
              const copy = STAGE_COPY[value];
              const on = stage === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => chooseStage(value)}
                  aria-pressed={on}
                  className={cn(
                    "stage-card group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left",
                    "transition-all duration-[var(--dur)] ease-[var(--ease)] active:scale-[0.98]",
                    on
                      ? "border-mineral bg-mineral text-ink"
                      : "border-line bg-graphite text-mineral hover:border-line-strong",
                  )}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span
                    className={cn(
                      "font-mono text-[0.62rem] uppercase tracking-[0.16em]",
                      on ? "text-ink/60" : "text-grey-deep",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-6">
                    <span className="block font-display text-[1.4rem] leading-tight">
                      {tr(locale, copy.label)}
                    </span>
                    <span
                      className={cn(
                        "mt-2 block text-[0.85rem] leading-snug",
                        on ? "text-ink/80" : "text-silver",
                      )}
                    >
                      {tr(locale, copy.sub)}
                    </span>
                    <span
                      className={cn(
                        "mt-3 block font-mono text-[0.6rem] uppercase tracking-[0.14em]",
                        on ? "text-ink/55" : "text-grey",
                      )}
                    >
                      {tr(locale, copy.support)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {errors.stage && <Err id="stage">{errors.stage}</Err>}
        </fieldset>

        {/* 02 — what to create */}
        <fieldset hidden={step !== 1} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[1]}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {CREATE_OPTIONS.map((value) => {
              const on = create.includes(value);
              return (
                <label
                  key={value}
                  className={cn(
                    chip,
                    "cursor-pointer",
                    on
                      ? "border-mineral bg-mineral text-ink"
                      : "border-line text-silver hover:border-line-strong",
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() =>
                      setCreate((prev) =>
                        on ? prev.filter((x) => x !== value) : [...prev, value],
                      )
                    }
                  />
                  {tr(locale, CREATE_COPY[value])}
                </label>
              );
            })}
          </div>
          {errors.create && <Err id="create">{errors.create}</Err>}
        </fieldset>

        {/* 03 — objective */}
        <fieldset hidden={step !== 2} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[2]}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {OBJECTIVE_OPTIONS.map((value) => (
              <label
                key={value}
                className={cn(
                  chip,
                  "cursor-pointer",
                  objective === value
                    ? "border-mineral bg-mineral text-ink"
                    : "border-line text-silver hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="objective"
                  className="sr-only"
                  checked={objective === value}
                  onChange={() => setObjective(value)}
                />
                {tr(locale, OBJECTIVE_COPY[value])}
              </label>
            ))}
          </div>
          {errors.objective && <Err id="objective">{errors.objective}</Err>}
        </fieldset>

        {/* 04 — presence */}
        <fieldset hidden={step !== 3} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[3]}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRESENCE_OPTIONS.map((value) => (
              <label
                key={value}
                className={cn(
                  chip,
                  "cursor-pointer",
                  presence === value
                    ? "border-mineral bg-mineral text-ink"
                    : "border-line text-silver hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="presence"
                  className="sr-only"
                  checked={presence === value}
                  onChange={() => setPresence(value)}
                />
                {tr(locale, PRESENCE_COPY[value])}
              </label>
            ))}
          </div>
          {presence && presence !== "none" && (
            <div className="mt-4">
              <label htmlFor="presenceLink" className="eyebrow">
                {L("Link or @handle (optional)", "Lien ou @pseudo (optionnel)", "الرابط ولا @الحساب (اختياري)")}
              </label>
              <input
                id="presenceLink"
                className={cn(field, "mt-3")}
                placeholder={L("yoursite.ma or @yourhandle", "votresite.ma ou @votrepseudo", "الموقع ديالك ولا @الحساب")}
                value={presenceLink}
                onChange={(e) => setPresenceLink(e.target.value)}
              />
            </div>
          )}
          {errors.presence && <Err id="presence">{errors.presence}</Err>}
        </fieldset>

        {/* 05 — timeline */}
        <fieldset hidden={step !== 4} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[4]}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {TIMELINE_OPTIONS.map((value) => (
              <label
                key={value}
                className={cn(
                  chip,
                  "cursor-pointer",
                  timeline === value
                    ? "border-mineral bg-mineral text-ink"
                    : "border-line text-silver hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="timeline"
                  className="sr-only"
                  checked={timeline === value}
                  onChange={() => setTimeline(value)}
                />
                {tr(locale, TIMELINE_COPY[value])}
              </label>
            ))}
          </div>
          {errors.timeline && <Err id="timeline">{errors.timeline}</Err>}
        </fieldset>

        {/* 06 — project detail */}
        <fieldset hidden={step !== 5} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[5]}</legend>
          <label htmlFor="project" className="eyebrow">
            {L(
              "A few sentences are enough — activity, idea, problem to solve, important features…",
              "Quelques phrases suffisent — activité, idée, problème à résoudre, fonctionnalités importantes…",
              "شي سطرين كافيين — النشاط، الفكرة، المشكل لي بغيتي تحلو، الحوايج المهمين…",
            )}
          </label>
          <textarea
            id="project"
            rows={6}
            className={cn(field, "mt-3")}
            value={project}
            onChange={(e) => setProject(e.target.value)}
            aria-invalid={!!errors.project}
          />
          {errors.project && <Err id="project">{errors.project}</Err>}
        </fieldset>

        {/* 07 — contact */}
        <fieldset hidden={step !== 6} className="border-0 p-0">
          <legend className="sr-only">{stepTitle[6]}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="eyebrow">{L("Name", "Nom", "السمية")}</label>
              <input
                id="name"
                className={cn(field, "mt-3")}
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && <Err id="name">{errors.name}</Err>}
            </div>
            <div>
              <label htmlFor="phone" className="eyebrow">
                {L("Phone / WhatsApp", "Téléphone / WhatsApp", "التيليفون / واتساب")}
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                className={cn(field, "mt-3")}
                value={phone}
                autoComplete="tel"
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <Err id="phone">{errors.phone}</Err>}
            </div>
            <div>
              <label htmlFor="company" className="eyebrow">
                {L("Company (optional)", "Entreprise (optionnel)", "الشركة (اختياري)")}
              </label>
              <input
                id="company"
                className={cn(field, "mt-3")}
                value={company}
                autoComplete="organization"
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="city" className="eyebrow">
                {L("City (optional)", "Ville (optionnel)", "المدينة (اختياري)")}
              </label>
              <input
                id="city"
                className={cn(field, "mt-3")}
                value={city}
                autoComplete="address-level2"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="eyebrow">
                {L("Email (optional)", "E-mail (optionnel)", "البريد الإلكتروني (اختياري)")}
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                className={cn(field, "mt-3")}
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <Err id="email">{errors.email}</Err>}
            </div>
          </div>
        </fieldset>

        {/* Honeypot. Hidden from people, irresistible to bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-7">
        {step > 0 && (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="border border-line px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-silver hover:border-line-strong"
          >
            {L("Back", "Retour", "رجوع")}
          </button>
        )}

        {step < STEP_COUNT - 1 ? (
          step !== 0 && (
            <button
              type="button"
              onClick={next}
              className="magnetic-btn bg-mineral px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink hover:bg-mineral-hi"
            >
              {L("Continue", "Continuer", "كمل")}
            </button>
          )
        ) : (
          <button
            type="submit"
            disabled={state === "sending"}
            className="magnetic-btn bg-mineral px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink hover:bg-mineral-hi disabled:opacity-60"
          >
            {state === "sending"
              ? L("Sending…", "Envoi…", "كيتصيفط…")
              : L("Prepare my brief", "Préparer mon brief", "وجّد البريف ديالي")}
          </button>
        )}
      </div>

      {state === "failed" && (
        <p role="alert" className="mt-5 border border-line-strong px-4 py-3 text-sm text-mineral">
          {L(
            "That did not save. Your answers are still here; please try again in a moment.",
            "Cela n'a pas été enregistré. Vos réponses sont toujours là ; réessayez dans un instant.",
            "ما تسجلش. الأجوبة ديالك مازال كاينين؛ عاود المحاولة من بعد.",
          )}
        </p>
      )}
    </form>
  );
}

function Err({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={`${id}-error`} role="alert" className="mt-3 font-mono text-[0.68rem] tracking-[0.1em] text-mineral">
      {children}
    </p>
  );
}
