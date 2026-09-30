"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useMediaQuery } from "@/lib/use-media-query";
import { dbgFlag, dbgMark } from "@/lib/debug";

/** Lenis handles wheel input; Motion owns the visual scroll choreography. */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  useEffect(() => {
    document.documentElement.classList.add("js");
    dbgMark("smooth:init", { reduced });
    if (reduced) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { animate, inView, scroll }] = await Promise.all([
        import("lenis"),
        import("motion"),
      ]);
      dbgMark("smooth:imports-ok", { cancelled });
      if (cancelled) return;

      const lenis = dbgFlag("nolenis") ? null : new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
        autoRaf: true,
        anchors: true,
      });
      dbgMark("smooth:lenis", { created: !!lenis });
      if (document.body.style.overflow === "hidden") lenis?.stop();
      const onMenu = (event: Event) => {
        dbgMark("smooth:menu", { open: (event as CustomEvent<boolean>).detail });
        if ((event as CustomEvent<boolean>).detail) lenis?.stop();
        else lenis?.start();
      };
      window.addEventListener("auren:menu", onMenu);
      document.documentElement.classList.add("depth-on");

      const cleanups: Array<() => void> = [];
      const register = (trigger: string) => {
        cleanups.splice(0).forEach((stop) => stop());
        dbgMark("smooth:register", {
          trigger,
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          depth: document.querySelectorAll("[data-depth]").length,
          reveal3d: document.querySelectorAll("[data-reveal-3d]").length,
          revealMask: document.querySelectorAll("[data-reveal-mask]").length,
          heroOut: document.querySelectorAll("[data-hero-out]").length,
        });

        document.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
          const amount = Number.parseFloat(el.dataset.depth ?? "0");
          if (!amount) return;
          // Phones keep most of the depth: at 0.45 the drift was too small
          // to register on a 390px screen, which read as a static page.
          const distance = amount * (window.innerWidth < 768 ? 0.7 : 1);
          cleanups.push(scroll((progress) => {
            el.style.translate = `0 ${((0.5 - progress) * distance).toFixed(2)}%`;
          }, { target: el.parentElement ?? el, offset: ["start end", "end start"] }));
        });

        document.querySelectorAll<HTMLElement>("[data-reveal-3d]").forEach((el) => {
          cleanups.push(inView(el, () => {
            animate(el, {
              opacity: [0, 1],
              transform: ["perspective(1200px) translateY(36px) rotateX(-6deg)", "perspective(1200px) translateY(0) rotateX(0)"],
            }, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
          }, { margin: "0px 0px -8% 0px" }));
        });

        document.querySelectorAll<HTMLElement>("[data-reveal-mask]").forEach((el) => {
          cleanups.push(inView(el, () => {
            animate(el, {
              clipPath: ["inset(12% 5% 12% 5% round 18px)", "inset(0% 0% 0% 0% round 0px)"],
              transform: ["scale(0.985)", "scale(1)"],
            }, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
          }, { margin: "0px 0px -10% 0px" }));
        });

        document.querySelectorAll<HTMLElement>("[data-hero-out]").forEach((el) => {
          cleanups.push(scroll((progress) => {
            const p = Math.min(1, Math.max(0, progress));
            el.style.translate = `0 ${(-12 * p).toFixed(2)}%`;
            el.style.opacity = String(1 - p * 0.82);
          }, { target: el.closest("section") ?? el, offset: ["start start", "end start"] }));
        });
      };

      const frame = requestAnimationFrame(() => register("initial"));
      const onRoute = () => requestAnimationFrame(() => register("route"));
      let resizeTimer = 0;
      // Only a width change alters anything `register` computes (the depth
      // distance). iOS fires `resize` every time the toolbar collapses or
      // expands — height only — and tearing down every binding mid-scroll for
      // that is pure churn. Motion's scroll tracking re-measures on its own.
      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (dbgFlag("noresize") || window.innerWidth === lastWidth) {
          dbgMark("smooth:resize-skipped", { innerWidth: window.innerWidth, innerHeight: window.innerHeight });
          return;
        }
        lastWidth = window.innerWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => register("resize"), 150);
      };
      window.addEventListener("auren:route-motion", onRoute);
      window.addEventListener("resize", onResize, { passive: true });
      dispose = () => {
        cancelAnimationFrame(frame);
        clearTimeout(resizeTimer);
        cleanups.splice(0).forEach((stop) => stop());
        window.removeEventListener("auren:route-motion", onRoute);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("auren:menu", onMenu);
        lenis?.destroy();
        document.documentElement.classList.remove("depth-on");
      };
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [reduced]);

  useEffect(() => {
    const timer = window.setTimeout(() => window.dispatchEvent(new Event("auren:route-motion")), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
