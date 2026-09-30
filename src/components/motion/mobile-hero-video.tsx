"use client";

import { useEffect, useRef } from "react";
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
 * The clip is 648×960, cropped from the Kling export's clean sculpture panel
 * (the export carries a KlingAI mark and a burned-in prompt caption outside
 * it), with a 1s tail→head crossfade so the loop has no visible seam.
 */
export function MobileHeroVideo({ className }: { className?: string }) {
  const phone = useMediaQuery("(max-width: 767px)", false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const play = phone && !reduced;

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
