import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { tr } from "@/i18n/copy";
import type { Concept, ConceptPalette, Row } from "@/content/concepts/types";
import type { MediaAsset as Frame } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * Shared chrome for the five concept showcases.
 *
 * What is shared and what is not is the decision this file exists to record.
 * Shared: the palette mechanism, the honesty badge, the "what a visitor could
 * do" list and the typography scale. Not shared: the composition. A restaurant
 * is a card laid over a photograph, a fashion label is a figure beside a
 * product, a showroom is a room you stand in, a hire desk is a form over a
 * landscape, a café is one calm screen. What follows is the vocabulary those
 * five are written in, not a layout they are poured into.
 *
 * The palette arrives as inline custom properties rather than as class names
 * because the values live in content, one set per concept. Nothing about a
 * colour is decided in a stylesheet, so adding a sixth concept needs no CSS.
 */

export type PaletteStyle = React.CSSProperties & Record<`--c-${string}`, string>;

export function paletteStyle(p: ConceptPalette): PaletteStyle {
  return {
    "--c-bg": p.bg,
    "--c-panel": p.panel,
    "--c-ink": p.ink,
    "--c-soft": p.soft,
    "--c-line": p.line,
    "--c-accent": p.accent,
    "--c-accent-ink": p.accentInk,
  } as PaletteStyle;
}

/** The section wrapper. Owns the concept's colour world and its direction. */
export function ConceptStage({
  concept,
  locale,
  children,
  className,
  id,
}: {
  concept: Concept;
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("c-stage relative overflow-hidden", className)}
      style={paletteStyle(concept.palette)}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {children}
    </section>
  );
}

/**
 * The honesty label.
 *
 * Rendered on every concept, in the concept's own palette, at the largest
 * legible size its frame allows. Never the faintest thing on the screen, never
 * a tooltip. These are AUREN's own designs for businesses that do not exist
 * yet; a visitor who could mistake one for shipped client work has been lied
 * to.
 */
export function ConceptBadge({ concept, locale }: { concept: Concept; locale: Locale }) {
  return (
    <span className="c-badge inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--c-accent)]" />
      {tr(locale, concept.badge)}
    </span>
  );
}

/** The masthead: index, category, badge, and the one-sentence promise. */
export function ConceptMasthead({
  concept,
  locale,
  index,
}: {
  concept: Concept;
  locale: Locale;
  index: string;
}) {
  return (
    <header className="c-masthead min-w-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="shrink-0 font-mono text-[0.68rem] tracking-[0.18em] text-[var(--c-soft)]">
          {index}
        </span>
        <span aria-hidden="true" className="h-px w-10 shrink-0 bg-[var(--c-line)]" />
        <p className="min-w-0 flex-1 basis-40 font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.16em] text-[var(--c-soft)] sm:basis-auto sm:flex-none">
          {tr(locale, concept.category)}
        </p>
        <ConceptBadge concept={concept} locale={locale} />
      </div>

      <h2 className="c-name font-display leading-[0.9]">{concept.name}</h2>

      <p className="c-promise max-w-[54ch] leading-relaxed text-[var(--c-soft)]">
        {tr(locale, concept.promise)}
      </p>
    </header>
  );
}

/**
 * What a visitor could actually do on the site.
 *
 * Capabilities, never outcomes. No "40% more bookings", no "as seen on" — a
 * concept has no client to have measured anything. The list is written as
 * verbs the visitor performs, because that is the only claim available.
 */
export function ConceptCan({ concept, locale }: { concept: Concept; locale: Locale }) {
  return (
    <ul className="c-can grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2">
      {concept.can.map((item, i) => (
        <li key={i} className="c-can__item">
          <span className="font-mono text-[0.6rem] tracking-[0.16em] text-[var(--c-accent)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="leading-snug">{tr(locale, item)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A photograph. Real ratio, real object-position, average colour behind it.
 *
 * Reference artwork is never cropped to fill a box. When the layout gives the
 * plate a frame of its own (an `aspect-*` class), the image still fills that
 * frame — that is a deliberate composition. When it does not, the plate takes
 * the image's own aspect ratio, so a landscape hero stays landscape and a tall
 * detail stays tall. The frame never forces the artwork to be something it is
 * not, and nothing is upscaled: `sizes` stays honest so the browser picks the
 * smallest adequate source.
 */
export function Plate({
  image,
  alt,
  className,
  position,
  sizes = "(max-width: 768px) 92vw, 50vw",
  priority = false,
  overlay,
}: {
  image: Frame;
  alt: string;
  className?: string;
  position?: string;
  sizes?: string;
  priority?: boolean;
  /** A caption that belongs to the picture, not to the layout. */
  overlay?: React.ReactNode;
}) {
  const hasFrame = className ? /\baspect-/.test(className) : false;
  return (
    <figure
      className={cn("c-plate relative overflow-hidden rounded-2xl", className)}
      style={{
        background: image.tint,
        ...(hasFrame ? {} : { aspectRatio: `${image.width} / ${image.height}` }),
      }}
    >
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
      {overlay && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">{overlay}</div>
      )}
    </figure>
  );
}

/** A row list — a spec table, an address block, opening hours, materials. */
export function RowList({ rows, locale, dense }: { rows: Row[]; locale: Locale; dense?: boolean }) {
  return (
    <dl className="c-rows">
      {rows.map((row, i) => (
        <div key={i} className="c-rows__row">
          <dt className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--c-soft)]">
            {tr(locale, row.label)}
          </dt>
          <dd className={cn("text-[var(--c-ink)]", dense ? "text-sm" : "text-[0.95rem]")}>
            {tr(locale, row.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A control that belongs to the concept, not to the AUREN shell. */
export function Cta({
  children,
  variant = "solid",
  className,
}: {
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "line";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-transform duration-[var(--dur)] ease-[var(--ease)]",
        variant === "solid" && "bg-[var(--c-accent)] text-[var(--c-accent-ink)] hover:brightness-110",
        variant === "ghost" && "border border-[var(--c-line)] text-[var(--c-ink)] hover:border-[var(--c-accent)]",
        variant === "line" &&
          "rounded-none border-b border-[var(--c-accent)] px-0 py-1 text-[var(--c-ink)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A label, in the concept's own voice. */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--c-soft)]">
      {children}
    </p>
  );
}
