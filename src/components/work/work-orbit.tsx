"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { BrowserFrame } from "./browser-frame";
import { featuredProjects } from "@/content/projects";
import { practiceTag } from "@/content/practices";
import { addTicker, createSpring, projectMomentum, VelocityTracker } from "@/lib/spring";
import { useMediaQuery } from "@/lib/use-media-query";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const PROJECTS = featuredProjects;
const N = PROJECTS.length;
const STEP = (Math.PI * 2) / N;

/**
 * Deceleration for the flick projection.
 *
 * Apple's 0.998 is calibrated for scroll surfaces, where a flick is meant to
 * travel a long way through a long list. Its effective multiplier is
 * 0.998 / (1 - 0.998) ≈ 500, so a gentle 1700px/s flick projects ~870px —
 * nearly two whole positions past the intended one on a four-item carousel.
 *
 * 0.975 gives a multiplier of ~39: a gentle flick advances one project, a hard
 * one advances two, and neither overshoots into a spin.
 */
const CAROUSEL_DECELERATION = 0.975;

/** Normalise to (-π, π] so the carousel always turns the short way round. */
function shortest(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/**
 * The selected-work orbit.
 *
 * Projects sit on an ellipse and rotate under drag, swipe, wheel or arrow key.
 * This is the showreel — the interaction itself demonstrates the work rather
 * than a video of it.
 *
 * Built to the apple-design rules:
 *
 *  - 1:1 tracking. While dragging, the orbit follows the pointer exactly;
 *    it never waits for release to animate.
 *  - Interruptible. Grabbing mid-spring picks up the live angle and velocity,
 *    so a reversal is continuous rather than a jump.
 *  - Momentum projection. Release projects where the flick is *going* with
 *    Apple's exponential-decay function, then snaps to the nearest project
 *    from that projected point — not from the release point.
 *  - Velocity handoff. The spring inherits the release velocity, so there is
 *    no seam between dragging and settling.
 *  - No scroll hijack. Vertical wheel and vertical touch always belong to the
 *    page; only horizontal intent reaches the orbit.
 *
 * Every project's title, tagline and link is in the server HTML regardless of
 * the interaction — the orbit only positions them.
 */
export function WorkOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const springRef = useRef(createSpring(0, { damping: 1, response: 0.55 }));
  const stopRef = useRef<(() => void) | null>(null);
  const draggingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  /** Paint the current spring value onto the cards. Never touches React state. */
  const paint = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const angle = springRef.current.get();
    const w = stage.clientWidth;
    // With six on the ellipse the neighbours crowd the front card, so the
    // radius widens and the depth falloff steepens to keep one clear subject.
    const radius = w * (w < 720 ? 0.46 : 0.40);

    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const theta = shortest(i * STEP - angle);
      const depth = Math.cos(theta);
      const t = (depth + 1) / 2;

      const x = Math.sin(theta) * radius;
      const scale = 0.52 + 0.48 * Math.pow(t, 1.25);
      const lift = (1 - t) * 30;
      const opacity = 0.10 + 0.90 * Math.pow(t, 2.1);
      const z = -220 + 300 * t;
      const turn = -Math.sin(theta) * (w < 720 ? 14 : 24);

      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${lift.toFixed(2)}px), ${z.toFixed(2)}px) rotateY(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(Math.round(t * 100));
      // Only the front card may be clicked or focused; the others are scenery
      // until they come round.
      el.style.pointerEvents = depth > 0.86 ? "auto" : "none";
    }
  }, []);

  const ensureTicking = useCallback(() => {
    if (stopRef.current) return;
    stopRef.current = addTicker((dt) => {
      const moving = springRef.current.step(dt);
      paint();
      if (!moving && !draggingRef.current) {
        stopRef.current = null;
        return false;
      }
      return true;
    });
  }, [paint]);

  /** Snap to a specific project, taking the short way round. */
  const goTo = useCallback(
    (index: number, velocity = 0) => {
      const s = springRef.current;
      const current = s.get();
      const targetAngle = index * STEP;
      const delta = shortest(targetAngle - current);
      s.set(current + delta);
      if (velocity) s.addVelocity(velocity);
      const normalised = ((index % N) + N) % N;
      setActive(normalised);
      ensureTicking();
    },
    [ensureTicking],
  );

  const step = useCallback(
    (dir: 1 | -1) => goTo(Math.round(springRef.current.target() / STEP) + dir),
    [goTo],
  );

  // ---- drag ---------------------------------------------------------------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    const tracker = new VelocityTracker();
    let pointerId: number | null = null;
    let startX = 0;
    let startAngle = 0;
    let span = 1;
    let committed = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      pointerId = e.pointerId;
      startX = e.clientX;
      // Interruption: take the angle the spring is actually showing right now,
      // not the value it was heading toward.
      startAngle = springRef.current.get();
      springRef.current.jump(startAngle);
      // How far you drag to advance one project. 460px was far too much — a
      // natural 170px flick landed on 0.51 of a step and rounded arbitrarily
      // either way, so the same gesture sometimes moved and sometimes did not.
      // At 260px a comfortable flick is unambiguously one project, a small
      // nudge is unambiguously none.
      span = Math.min(stage.clientWidth * 0.28, 260);
      committed = false;
      draggingRef.current = true;
      tracker.reset();
      tracker.add(0);
      setGrabbing(true);
      ensureTicking();
    };

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId || !draggingRef.current) return;
      const dx = e.clientX - startX;

      // ~10px of hysteresis before committing, so a tap on a card is never
      // swallowed by an accidental one-pixel drag.
      if (!committed) {
        if (Math.abs(dx) < 10) return;
        committed = true;
        // Capture can throw if the pointer has already been released; losing
        // capture is survivable, losing the rest of this handler is not.
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          /* continue tracking on the window listeners */
        }
      }

      springRef.current.jump(startAngle - (dx / span) * STEP);
      // Velocity is tracked in PIXELS, not radians — see onUp.
      tracker.add(dx);
      paint();
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      draggingRef.current = false;
      setGrabbing(false);
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
      if (!committed) return;

      // Momentum is projected in pixel space and only then converted to an
      // angle. Apple's deceleration constant is calibrated for pixels-per-
      // second; feeding radians-per-second through it projects roughly a
      // hundred times too far, and a gentle flick spins three cards past its
      // target.
      const vpx = tracker.velocity();
      const projectedPx = projectMomentum(vpx, CAROUSEL_DECELERATION);
      const currentAngle = springRef.current.get();
      const projectedAngle = currentAngle - (projectedPx / span) * STEP;

      // A flick throws at most two projects. Beyond that the carousel stops
      // reading as a thrown object and starts reading as a slot machine.
      const from = Math.round(currentAngle / STEP);
      const raw = Math.round(projectedAngle / STEP);
      const index = Math.max(from - 2, Math.min(from + 2, raw));

      // Hand the spring the release velocity, in radians, so there is no seam
      // between dragging and settling.
      goTo(index, -(vpx / span) * STEP);
    };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [reduced, ensureTicking, goTo, paint]);

  // ---- wheel --------------------------------------------------------------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    let idle: number | undefined;
    const onWheel = (e: WheelEvent) => {
      // Vertical intent belongs to the page. Only a clearly horizontal
      // trackpad gesture drives the orbit — the page never gets hijacked.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();

      const s = springRef.current;
      s.jump(s.get() + (e.deltaX / 600) * STEP);
      paint();

      window.clearTimeout(idle);
      idle = window.setTimeout(() => goTo(Math.round(s.get() / STEP)), 140);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(idle);
    };
  }, [reduced, goTo, paint]);

  // Initial paint, and a repaint whenever the stage is resized.
  //
  // `reduced` must be in the deps. Its server snapshot is `true`, so the first
  // client render is the plain list and `stageRef` is null; when hydration
  // flips it to false the orbit mounts, and without this dependency the effect
  // never re-runs — leaving every card untransformed and stacked on top of
  // each other.
  useEffect(() => {
    paint();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => paint());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [paint, reduced]);

  // ---- reduced motion: an ordinary list, no orbit at all ------------------
  if (reduced) {
    return (
      <section className="border-t border-line py-20" aria-labelledby="work-heading">
        <div className="shell">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-heading" className="mt-5 max-w-[16ch] text-[length:var(--text-title)]">
            Work we have shipped, and work we would like to.
          </h2>
          <ul className="mt-14 grid gap-12 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="group block">
                  <BrowserFrame
                    src={p.site.desktop}
                    alt={p.site.alt}
                    domain={p.site.label}
                    sizes="(max-width: 768px) 92vw, 46vw"
                  />
                  <h3 className="mt-6 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-silver">
                    {p.tagline}
                  </p>
                  <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey">
                    {p.practices.map((x) => practiceTag[x]).join(" · ")} · {p.year}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border-t border-line py-16 md:py-20" aria-labelledby="work-heading">
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 id="work-heading" className="mt-5 max-w-[16ch] text-[length:var(--text-title)]">
            Work we have shipped, and work we would like to.
          </h2>
        </div>
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-grey-deep">
          Drag · swipe · arrows
        </p>
      </div>

      {/* The stage. `touch-action: pan-y` is what keeps vertical scrolling with
          the page while horizontal movement drives the orbit. */}
      <div
        ref={stageRef}
        role="group"
        aria-label="Selected work — use the left and right arrow keys to move between projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
        className={cn(
          "relative mt-12 h-[clamp(300px,42vw,470px)] w-full touch-pan-y select-none [perspective:1200px] [transform-style:preserve-3d]",
          grabbing ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {PROJECTS.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-[min(78vw,540px)] will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
          >
            <Link
              href={`/work/${p.slug}`}
              tabIndex={i === active ? 0 : -1}
              aria-hidden={i !== active}
              onClick={() => track("view_project", { project: p.slug })}
              // Dragging must never fire a navigation.
              onDragStart={(e) => e.preventDefault()}
              className="block"
            >
              <BrowserFrame
                src={p.site.desktop}
                alt={p.site.alt}
                domain={p.site.label}
                priority={i === 0}
                sizes="(max-width: 768px) 78vw, 540px"
                badge={p.kind === "concept" ? "Studio concept" : undefined}
                motion={p.motion}
                active={i === active}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* The active project's identity, below the stage where it never covers
          the work. Cross-faded, with every entry present in the DOM. */}
      <div className="shell relative mt-10 min-h-[132px] text-center">
        {PROJECTS.map((p, i) => (
          <div
            key={p.slug}
            aria-hidden={i !== active}
            // `inset-x-0` pins to the shell's PADDING box, so an absolutely
            // positioned child escapes the page gutter entirely. The padding
            // is reapplied here to put it back inside.
            className={cn(
              "absolute inset-x-0 top-0 px-[var(--page-gutter)] transition-opacity duration-300 ease-[var(--ease)]",
              i === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <h3 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none">
              {p.title}
            </h3>
            <p className="mt-3 text-balance font-mono text-[0.62rem] uppercase tracking-[0.1em] text-grey sm:text-[0.66rem] sm:tracking-[0.16em]">
              {p.practices.map((x) => practiceTag[x]).join(" · ")}
            </p>
            <Link
              href={`/work/${p.slug}`}
              tabIndex={i === active ? 0 : -1}
              className="group mt-5 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mineral"
            >
              View project
              <span className="transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="shell mt-6 flex items-center justify-center gap-3">
        <OrbitButton label="Previous project" onClick={() => step(-1)}>←</OrbitButton>
        <ol className="flex items-center gap-2" aria-label="Project position">
          {PROJECTS.map((p, i) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={p.title}
                aria-current={i === active}
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-[var(--dur)] ease-[var(--ease)]",
                  i === active ? "w-7 bg-lume" : "w-1.5 bg-line-strong hover:bg-grey",
                )}
              />
            </li>
          ))}
        </ol>
        <OrbitButton label="Next project" onClick={() => step(1)}>→</OrbitButton>
      </div>
    </section>
  );
}

function OrbitButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // Feedback on press, not on release.
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-grey transition-all duration-150 ease-out hover:border-line-strong hover:text-mineral active:scale-90"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
