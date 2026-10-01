"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

/**
 * One rendered loop per How-we-work phase (`remotion/src/process.tsx`,
 * `public/motion/process/`, 22–44 KB each).
 *
 * The clips are white-on-black and play on their own small screen: black on
 * the dark palette, and on the light palette the same clip inverted with its
 * hue kept (see `.process-motion` in globals.css) — one asset for both themes.
 *
 * Only the phase being read plays; the others hold their poster. A clip is
 * fetched when its card comes within 400px of the viewport, never before,
 * and under reduced motion only the poster is shown.
 */
export function ProcessMotion({ clip, active, className }: { clip: string; active: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  // A decode error retries once, then the clip gives way to its poster for
  // good — a phase is never left blank.
  const [failures, setFailures] = useState(0);
  const poster = `/motion/process/posters/${clip}.webp`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // play() can reject (Low Power Mode); the poster underneath is correct then.
    if (active) video.play().catch(() => {});
    else video.pause();
  }, [active, near, failures]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("process-motion pointer-events-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 1–4 KB poster; next/image would add a request for nothing */}
      <img src={poster} alt="" className="process-motion__media" decoding="async" loading="lazy" />
      {near && !reduced && failures < 2 && (
        <video
          key={failures}
          ref={videoRef}
          className="process-motion__media process-motion__video"
          data-playing={playing}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => { setPlaying(false); setFailures((n) => n + 1); }}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
        >
          {/* H.264 first: hardware-decoded nearly everywhere, and what Safari
              plays anyway. The VP9 file is the fallback, not the default. */}
          <source src={`/motion/process/${clip}.mp4`} type="video/mp4" />
          <source src={`/motion/process/${clip}.webm`} type="video/webm" />
        </video>
      )}
    </div>
  );
}
