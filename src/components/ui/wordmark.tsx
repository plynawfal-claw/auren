import { cn } from "@/lib/cn";

/**
 * The AUREN mark: an incident beam and its four resolved bands.
 *
 * One tall stroke enters; four shorter strokes leave at descending weight.
 * Monochrome, always — the chroma rule applies to the identity too, and a
 * four-colour logo would spend the site's entire colour budget in the header.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={cn("h-5 w-7", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="1" width="1.6" height="18" fill="currentColor" />
      <rect x="11" y="3.5" width="1.1" height="13" fill="currentColor" opacity="0.92" />
      <rect x="16" y="5" width="1.1" height="10" fill="currentColor" opacity="0.7" />
      <rect x="21" y="6.5" width="1.1" height="7" fill="currentColor" opacity="0.48" />
      <rect x="26" y="8" width="1.1" height="4" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function Wordmark({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span dir="ltr" lang="en" className={cn("inline-flex items-center gap-2.5", className)}>
      {showMark && <Mark />}
      <span className="font-display text-[1.45rem] leading-none" style={{ fontFamily: 'var(--font-bodoni), "Times New Roman", serif', letterSpacing: "0.16em" }}>
        AUREN
      </span>
      <span className="sr-only">AUREN — digital studio</span>
    </span>
  );
}
