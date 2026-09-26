import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Buttons.
 *
 * AUREN's button language, built to the apple-design rules on response and
 * feedback:
 *
 *   - `active:scale-[0.97]` fires on pointer-DOWN, not on release. Waiting for
 *     the click to acknowledge a press is what makes a control feel dead.
 *   - The press transition is 120ms — fast enough to feel like contact.
 *     Release uses the slower editorial curve, so it settles rather than snaps.
 *
 * Three deliberate decisions make this a system rather than three styles:
 *
 *   1. The surface moves, not just the colour. A layer inside the button
 *      slides up under the label, so a hover is a material event.
 *   2. The label is doubled and the pair travels one line height, so the
 *      wordmark-like label hands over to itself. Nothing is re-typed; both
 *      copies are the same string, and the second is hidden from assistive
 *      tech.
 *   3. The label and the arrow move by different amounts — 2px and 4px. Equal
 *      movement reads as a rigid block; unequal movement reads as intent.
 *
 * Pill-shaped and sized to the label, so the control feels drawn rather than
 * boxed on a page already built from boxes.
 */
const base =
  "magnetic-btn btn group relative isolate inline-flex items-center justify-center overflow-hidden " +
  "rounded-full font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] px-6 py-3 " +
  "transition-[transform,color,border-color] duration-[var(--dur)] ease-[var(--ease)] " +
  "active:scale-[0.97] active:duration-[120ms]";

const variants = {
  primary: "btn--primary bg-mineral text-ink",
  // A hairline rather than a filled surface. `--color-grey` would fail contrast
  // as a border, so the line is drawn in silver.
  ghost: "btn--ghost border border-silver/40 text-mineral hover:border-silver",
  quiet: "btn--quiet px-0 text-mineral hover:text-white",
} as const;

type Variant = keyof typeof variants;

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3 w-3 shrink-0 transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = true,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
}) {
  const cls = cn(base, variants[variant], className);
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const quiet = variant === "quiet";

  const inner = (
    <>
      {/* The surface that moves. Skipped on the quiet variant, which is a
          text link and has no surface to move. */}
      {!quiet && (
        <span className="btn__fill" aria-hidden="true">
          {variant === "primary" && <span className="btn__fill-sheen" />}
        </span>
      )}

      <span className="btn__content">
        {quiet ? (
          <span className="btn__label">{children}</span>
        ) : (
          <span className="btn__stack">
            <span className="btn__track">
              <span className="btn__label">{children}</span>
              <span className="btn__label" aria-hidden="true">
                {children}
              </span>
            </span>
          </span>
        )}
        {arrow && <Arrow />}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}
