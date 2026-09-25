import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Buttons.
 *
 * Built to the apple-design rules on response and feedback:
 *   - `active:scale-[0.97]` fires on pointer-DOWN, not on release. Waiting for
 *     the click to acknowledge a press is what makes a control feel dead.
 *   - The press transition is 120ms — fast enough to feel like contact.
 *     Release uses the slower editorial curve, so it settles rather than snaps.
 *   - The arrow moves on its own, slightly further than the label, which reads
 *     as intent rather than as decoration.
 *
 * Pill-shaped rather than rectangular, and sized to the label. The previous
 * buttons were large rectangles that read as boxes on a page already built
 * from boxes.
 */
const base =
  "magnetic-btn group inline-flex items-center gap-2.5 rounded-full font-mono " +
  "text-[0.72rem] font-medium uppercase tracking-[0.14em] px-6 py-3 " +
  "transition-[transform,background-color,border-color,color] duration-[var(--dur)] ease-[var(--ease)] " +
  "active:scale-[0.97] active:duration-[120ms]";

const variants = {
  primary: "bg-mineral text-ink hover:bg-white",
  // A hairline rather than a filled surface. `--color-grey` would fail contrast
  // as a border, so the line is drawn in silver.
  ghost: "border border-silver/40 text-mineral hover:border-silver hover:bg-mineral/[0.06]",
  quiet: "px-0 text-mineral hover:text-white",
} as const;

type Variant = keyof typeof variants;

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3 w-3 transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1"
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

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
        {arrow && <Arrow />}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
