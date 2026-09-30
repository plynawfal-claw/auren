"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useMediaQuery } from "@/lib/use-media-query";

/** Lenis handles wheel input; Motion owns the visual scroll choreography. */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  useEffect(() => {
    document.documentElement.classList.add("js");
    if (reduced) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { animate, inView, scroll }] = await Promise.all([
        import("lenis"),
        import("motion"),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
        autoRaf: true,
        anchors: true,
      });
      if (document.body.style.overflow === "hidden") lenis.stop();
      const onMenu = (event: Event) => {
        if ((event as CustomEvent<boolean>).detail) lenis.stop();
        else lenis.start();
      };
      window.addEventListener("auren:menu", onMenu);
      document.documentElement.classList.add("depth-on");

      const cleanups: Array<() => void> = [];
      const register = () => {
        cleanups.splice(0).forEach((stop) => stop());

        document.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
          const amount = Number.parseFloat(el.dataset.depth ?? "0");
          if (!amount) return;
          const distance = amount * (window.innerWidth < 768 ? 0.45 : 1);
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

      const frame = requestAnimationFrame(register);
      const onRoute = () => requestAnimationFrame(register);
      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(register, 150);
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
        lenis.destroy();
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
