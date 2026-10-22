"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

const POSTER = "/media/auren-mobile-hero-poster.webp";

/**
 * The hero object on phones: a pre-rendered loop of the signature sculpture.
 *
 * Desktop renders the live shader (`SignatureObject`); below 768px that path
 * falls back to a CSS construction which read as a thin wireframe on a real
 * phone. This replaces it there with footage of the same object, lit properly.
 *
 * Three rules keep it from costing the page anything:
 *
 *   - The poster is a CSS background, not an <img>. A background on a
 *     `display:none` element is never fetched, so desktop downloads nothing.
 *   - The <video> mounts only on a phone with motion allowed. Under reduced
 *     motion the poster is the whole visual — no autoplay, per the preference.
 *     The server renders no <video> at all, so the headline paints first and
 *     stays the LCP element.
 *   - It pauses whenever it is off-screen.
 *
 * The poster is the phone's LCP element, so it is preloaded at high priority
 * for narrow screens only (`media` keeps desktop from fetching it), and the
 * footage waits for the page's `load` event plus an idle moment: the clip is
 * ~290 KB and was competing with the poster and the fonts for the first
 * seconds of a slow connection. Until it starts, the poster is what shows.
 *
 * The clip is 648×960, cropped from the Kling export's clean sculpture panel
 * (the export carries a KlingAI mark and a burned-in prompt caption outside
 * it), with a 1s tail→head crossfade so the loop has no visible seam.
 */
export function MobileHeroVideo({ className }: { className?: string }) {
  const phone = useMediaQuery("(max-width: 767px)", false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [settled, setSettled] = useState(false);
  const play = phone && !reduced && settled;

  preload(POSTER, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });

  useEffect(() => {
    if (!phone || reduced) return;
    let idle = 0;
    const start = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setSettled(true), { timeout: 2000 })
        : window.setTimeout(() => setSettled(true), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [phone, reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!play || !video) return;
    const io = new IntersectionObserver(([entry]) => {
      // play() can reject (Low Power Mode, a data-saver setting); the poster
      // underneath is the correct state in that case, so the rejection is
      // deliberately swallowed.
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [play]);

  return (
    <div
      aria-hidden="true"
      className={cn("mobile-hero-media pointer-events-none md:hidden", className)}
      style={{ backgroundImage: `url(${POSTER})` }}
    >
      {play && (
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src="/media/auren-mobile-hero.mp4" type="video/mp4" />
          <source src="/media/auren-mobile-hero.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}
