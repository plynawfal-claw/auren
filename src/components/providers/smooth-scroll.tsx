"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Smooth scroll, scroll choreography and the site's global 3D camera,
 * sharing one rAF loop.
 *
 * The single loop matters: running Lenis on its own rAF and letting
 * ScrollTrigger drive its own is the standard way these two libraries end up
 * a frame apart and jitter.
 *
 * GSAP and Lenis are imported dynamically so neither lands in the initial
 * bundle. Under reduced motion they are never fetched at all — the CSS path
 * renders everything fully visible and still.
 *
 * The depth layer is deliberately small:
 *   - one shared camera (`perspective: 1200px` on `main`, applied via the
 *     `depth-on` class) so every translateZ in the page agrees on a distance;
 *   - `[data-depth]` marks elements that drift on scroll — a translateY drift
 *     reads as parallax, is interruption-safe and never animates layout;
 *   - `[data-reveal-3d]` marks elements that arrive with a small perspective
 *     tilt; the tween starts from the element's natural state, so a failed or
 *     skipped animation leaves the content visible.
 *   - `[data-reveal-mask]` marks a project presentation, which opens from a
 *     clipped frame rather than sliding in. It is the one place a paint-heavy
 *     property (clip-path) is animated, and only once per element.
 *   - `[data-hero-out]` is the hero's hand-off: the statement lifts and dims as
 *     the hero leaves, so the next section is arrived at rather than cut to.
 *
 * On screens under 768px every drift factor is halved; on coarse pointers and
 * under reduced motion nothing is registered at all.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rebuildRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Marks the document as interactive. Every `.reveal` hides itself only
    // under `.js`, so without this class the page renders fully visible —
    // which is exactly what crawlers and no-JS readers get.
    document.documentElement.classList.add("js");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // One camera for the whole page. Everything that asks for depth —
      // the hero layers, the concept cards, the capability stage — now
      // shares it, so their translateZ values agree.
      const root = document.documentElement;
      root.classList.add("depth-on");

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.15,
      });

      let raf = 0;
      const loop = (time: number) => {
        lenis.raf(time);
        ScrollTrigger.update();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // --- scroll choreography --------------------------------------
      // Registered per navigation (the layout persists across routes, so a
      // one-shot scan would keep triggers pointing at dead nodes).
      const registerDepth = () => {
        const mobile = window.innerWidth < 768 ? 0.5 : 1;
        root.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
          const depth = Number.parseFloat(el.dataset.depth ?? "0");
          if (!depth) return;
          gsap.fromTo(
            el,
            { yPercent: depth * mobile },
            {
              yPercent: depth * mobile * -1,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        // --- 3D arrival -------------------------------------------------
        // `gsap.from` keeps the element's natural state as the end state, so
        // content is never hidden if this never runs.
        const cards = root.querySelectorAll<HTMLElement>("[data-reveal-3d]");
        if (cards.length) {
          gsap.set(cards, { transformPerspective: 1200, transformStyle: "preserve-3d" });
          ScrollTrigger.batch(cards, {
            start: "top 88%",
            once: true,
            onEnter: (entered) =>
              gsap.from(entered, {
                opacity: 0,
                y: 40,
                rotateX: -7,
                transformOrigin: "50% 100%",
                duration: 1.1,
                ease: "power3.out",
                stagger: 0.12,
                clearProps: "opacity,transform",
              }),
          });
        }

        // --- masked arrival ------------------------------------------------
        // The project presentations. `fromTo` rather than `from` here: the
        // opening frame is the interesting part of the reveal, and a scrub-free
        // fromTo leaves no half-state if the page is reloaded mid-section.
        const masks = root.querySelectorAll<HTMLElement>("[data-reveal-mask]");
        if (masks.length) {
          ScrollTrigger.batch(masks, {
            start: "top 90%",
            once: true,
            onEnter: (entered) =>
              gsap.fromTo(
                entered,
                { clipPath: "inset(14% 7% 14% 7% round 18px)", scale: 0.985 },
                {
                  clipPath: "inset(0% 0% 0% 0% round 0px)",
                  scale: 1,
                  duration: 1.4,
                  ease: "power3.out",
                  stagger: 0.1,
                  clearProps: "clipPath,transform",
                },
              ),
          });
        }

        // --- hero hand-off -------------------------------------------------
        // The typography lifts and dims as the hero leaves, so the transition
        // into the next section is a movement rather than a cut. The object
        // itself is driven from the shader, not from here.
        const heroOut = root.querySelectorAll<HTMLElement>("[data-hero-out]");
        heroOut.forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 0, opacity: 1, scale: 1 },
            {
              yPercent: -16,
              opacity: 0,
              scale: 0.97,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section") ?? el,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        ScrollTrigger.refresh();
      };

      const killChoreography = () => {
        ScrollTrigger.getAll().forEach((t) => {
          const el = t.trigger as Element | undefined;
          if (
            el &&
            el.isConnected &&
            el.closest("[data-depth], [data-reveal-3d], [data-reveal-mask], [data-hero-out]")
          ) {
            t.kill();
          }
        });
      };

      rebuildRef.current = () => {
        killChoreography();
        // Wait a frame so the new route's nodes are mounted before scanning.
        requestAnimationFrame(registerDepth);
      };

      // First paint of this route, then again once images and fonts have
      // settled the layout.
      const frame1 = requestAnimationFrame(registerDepth);
      const settle = setTimeout(registerDepth, 700);

      cleanup = () => {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(frame1);
        clearTimeout(settle);
        rebuildRef.current = null;
        lenis.destroy();
        root.classList.remove("depth-on");
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Route change: rebuild the parallax and reveal set against the new page.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => rebuildRef.current?.(), 90);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}
