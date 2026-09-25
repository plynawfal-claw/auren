"use client";

import { useEffect, useRef, useState } from "react";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/brief-schema";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * The project brief.
 *
 * Six steps rather than one long form: each screen asks one thing, so the
 * commitment grows gradually instead of arriving all at once. Contact details
 * are asked for last, after the visitor has already invested in describing the
 * work.
 *
 * Every step is a real fieldset in the DOM. Steps are hidden, not unmounted,
 * so answers survive navigating backwards and the browser can restore them.
 */
const STEPS = ["Need", "Project", "Budget", "Timeline", "You", "Detail"] as const;

type Errors = Record<string, string>;

export function ProjectBriefForm() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [detail, setDetail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  // Set on mount, not during render: Date.now() in a render body is impure
  // and React may call it more than once. 0 means 'not measured yet', which
  // the server treats as no timing signal rather than as an instant submit.
  const mountedAt = useRef(0);
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
    captureAttribution();
    // `once` guards this against Strict Mode's double effect invocation in
    // development, which would otherwise double every top-of-funnel count.
    track("start_project", { step: 1 }, true);
  }, []);

  // Moving between steps must announce itself, otherwise a screen-reader user
  // gets no feedback that anything happened.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  function validateStep(i: number): Errors {
    const e: Errors = {};
    if (i === 0 && services.length === 0) e.services = "Choose at least one.";
    if (i === 1 && project.trim().length < 10)
      e.project = "A sentence or two is enough.";
    if (i === 2 && !budget) e.budget = "Pick the closest range.";
    if (i === 3 && !timeline) e.timeline = "Pick the closest option.";
    if (i === 4) {
      if (name.trim().length < 2) e.name = "Required.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        e.email = "Use a valid email address.";
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length !== 0) return;
    const target = Math.min(STEPS.length - 1, step + 1);
    setStep(target);
    track("form_step", { step: target + 1, name: STEPS[target] });
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();

    // Re-check every step, not just the visible one.
    const all: Errors = {};
    for (let i = 0; i <= 4; i++) Object.assign(all, validateStep(i));
    setErrors(all);
    if (Object.keys(all).length > 0) return;

    setState("sending");
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          services,
          project,
          budget,
          timeline,
          name,
          company: company || undefined,
          email,
          phone: phone || undefined,
          detail: detail || undefined,
          website,
          elapsedMs: mountedAt.current ? Date.now() - mountedAt.current : undefined,
          attribution: readAttribution(),
        }),
      });
      setState(res.ok ? "sent" : "failed");
      // Fired on the response, never optimistically — a conversion counted
      // for a request that failed is worse than one not counted at all.
      if (res.ok) {
        track("form_submit", { services: services.join(", "), budget, timeline }, true);
      }
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-line bg-graphite p-10" role="status">
        <p className="eyebrow">Received</p>
        <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
          Thank you — that is enough to work with.
        </h2>
        <p className="mt-5 max-w-[52ch] leading-relaxed text-silver">
          You will get a considered reply, usually within two working days. If
          something is urgent, say so in a follow-up and it moves up the queue.
        </p>
      </div>
    );
  }

  const field =
    "w-full border border-line bg-graphite px-4 py-3.5 text-mineral placeholder:text-grey-deep " +
    "focus:border-silver focus:outline-none";
  const chip =
    "border px-4 py-3 text-left text-sm transition-colors duration-[var(--dur-fast)]";

  return (
    <form onSubmit={submit} noValidate>
      {/* Progress. Ordered, because the steps genuinely are a sequence. */}
      <ol className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "font-mono text-[0.66rem] uppercase tracking-[0.14em]",
              i === step ? "text-mineral" : i < step ? "text-grey" : "text-grey-deep",
            )}
          >
            {String(i + 1).padStart(2, "0")} {label}
          </li>
        ))}
      </ol>

      <p
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-8 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight outline-none"
      >
        {
          [
            "What do you need?",
            "What are you building or fixing?",
            "What budget are you working with?",
            "When do you want it live?",
            "Who are you?",
            "Anything else worth knowing?",
          ][step]
        }
      </p>

      <div className="mt-8 min-h-[280px]">
        {/* 01 — need */}
        <fieldset hidden={step !== 0} className="border-0 p-0">
          <legend className="sr-only">Services needed</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((s) => {
              const on = services.includes(s);
              return (
                <label
                  key={s}
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
                      setServices((prev) =>
                        on ? prev.filter((x) => x !== s) : [...prev, s],
                      )
                    }
                  />
                  {s}
                </label>
              );
            })}
          </div>
          {errors.services && <Err id="services">{errors.services}</Err>}
        </fieldset>

        {/* 02 — project */}
        <fieldset hidden={step !== 1} className="border-0 p-0">
          <legend className="sr-only">Project description</legend>
          <label htmlFor="project" className="eyebrow">
            In your own words
          </label>
          <textarea
            id="project"
            rows={6}
            className={cn(field, "mt-3")}
            placeholder="We sell handmade lamps and our site converts badly on mobile…"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            aria-invalid={!!errors.project}
          />
          {errors.project && <Err id="project">{errors.project}</Err>}
        </fieldset>

        {/* 03 — budget */}
        <fieldset hidden={step !== 2} className="border-0 p-0">
          <legend className="sr-only">Budget</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {BUDGET_OPTIONS.map((b) => (
              <label
                key={b}
                className={cn(
                  chip,
                  "cursor-pointer",
                  budget === b
                    ? "border-mineral bg-mineral text-ink"
                    : "border-line text-silver hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="budget"
                  className="sr-only"
                  checked={budget === b}
                  onChange={() => setBudget(b)}
                />
                {b}
              </label>
            ))}
          </div>
          {errors.budget && <Err id="budget">{errors.budget}</Err>}
        </fieldset>

        {/* 04 — timeline */}
        <fieldset hidden={step !== 3} className="border-0 p-0">
          <legend className="sr-only">Timeline</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {TIMELINE_OPTIONS.map((t) => (
              <label
                key={t}
                className={cn(
                  chip,
                  "cursor-pointer",
                  timeline === t
                    ? "border-mineral bg-mineral text-ink"
                    : "border-line text-silver hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="timeline"
                  className="sr-only"
                  checked={timeline === t}
                  onChange={() => setTimeline(t)}
                />
                {t}
              </label>
            ))}
          </div>
          {errors.timeline && <Err id="timeline">{errors.timeline}</Err>}
        </fieldset>

        {/* 05 — contact */}
        <fieldset hidden={step !== 4} className="border-0 p-0">
          <legend className="sr-only">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="eyebrow">Name</label>
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
              <label htmlFor="company" className="eyebrow">Company (optional)</label>
              <input
                id="company"
                className={cn(field, "mt-3")}
                value={company}
                autoComplete="organization"
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow">Email</label>
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
            <div>
              <label htmlFor="phone" className="eyebrow">Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                className={cn(field, "mt-3")}
                value={phone}
                autoComplete="tel"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* 06 — detail */}
        <fieldset hidden={step !== 5} className="border-0 p-0">
          <legend className="sr-only">Additional detail</legend>
          <label htmlFor="detail" className="eyebrow">
            Links, references, constraints — optional
          </label>
          <textarea
            id="detail"
            rows={6}
            className={cn(field, "mt-3")}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
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
            onClick={() => setStep((s) => s - 1)}
            className="border border-line px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-silver hover:border-line-strong"
          >
            Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="magnetic-btn bg-mineral px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink hover:bg-white"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={state === "sending"}
            className="magnetic-btn bg-mineral px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink hover:bg-white disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Send the brief"}
          </button>
        )}

        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey-deep">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>

      {state === "failed" && (
        <p role="alert" className="mt-5 border border-line-strong px-4 py-3 text-sm text-mineral">
          That did not send. Your answers are still here; please try again in a
          moment.
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
