"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * One rendered loop per capability, shown inside the What-we-build stage.
 *
 * The loops are rendered with Remotion from `remotion/` (a separate package —
 * no Remotion code ships to the browser) into `public/motion/`: 720×540,
 * 4s, 27–65 KB each. Six capabilities, five stories: the two systems rows
 * share the workflow loop.
 *
 * Loading is progressive. Nothing is fetched until the stage is within 300px
 * of the viewport, and then only the active capability's clip; switching
 * rows swaps the source. The poster (the finished story, 6–9 KB) is always
 * underneath, so a slow network or reduced motion still shows the whole idea.
 * Under reduced motion no <video> is mounted at all.
 */
const CLIP: Record<string, string> = {
  websites: "websites-that-sell",
  ecommerce: "shops-that-take-orders",
  brand: "brands-people-remember",
  growth: "growth-that-brings-people-in",
  systems: "systems-that-save-time",
  ai: "systems-that-save-time",
};

export function ServiceMotion({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  // Which clip is actually playing. Until then the video stays transparent:
  // a paused loop shows its current frame, and at the loop seam that frame is
  // the bare ground — so before play starts, off-screen, or when Low Power
  // Mode refuses autoplay, the poster underneath is what shows.
  const [playing, setPlaying] = useState<string | null>(null);
  const clip = CLIP[id] ?? CLIP.websites;
  const poster = `/motion/posters/${clip}.webp`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearIo = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: "300px 0px" });
    const seenIo = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    nearIo.observe(el);
    seenIo.observe(el);
    return () => { nearIo.disconnect(); seenIo.disconnect(); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // play() can reject (Low Power Mode); the poster underneath is correct then.
    if (onScreen) video.play().catch(() => {});
    else video.pause();
  }, [onScreen, clip]);

  return (
    <div ref={ref} aria-hidden="true" className="service-motion pointer-events-none absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- 6–9 KB poster; next/image would add a request for nothing */}
      <img key={`p-${clip}`} src={poster} alt="" className="service-motion__media" decoding="async" loading="lazy" />
      {near && !reduced && (
        <video
          key={clip}
          ref={videoRef}
          className="service-motion__media service-motion__video"
          data-playing={playing === clip}
          onPlaying={() => setPlaying(clip)}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src={`/motion/${clip}.webm`} type="video/webm" />
          <source src={`/motion/${clip}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
