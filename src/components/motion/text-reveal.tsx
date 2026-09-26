"use client";

import { Fragment, useRef } from "react";
import { useRevealOnView } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/**
 * A statement that typesets itself.
 *
 * The heading is split into words — not characters. Character-level reveals
 * are the single most over-used animation on sites in this category, and on a
 * Bodoni statement they break the kerning the typeface is chosen for. Words,
 * each masked by its own overflow-hidden box and staggered 34ms, read as
 * typesetting setting itself.
 *
 * The mechanics are the same as `Reveal`: one shared observer, `is-visible`
 * added once, and the hidden state gated behind `.js` so the words are present
 * and selectable in the server HTML for both crawlers and no-JS readers.
 *
 * The space between words is a real text node between the boxes rather than
 * inside them — whitespace inside an inline-block gets trimmed, which is how
 * word reveals end up running every word together.
 */
export function TextReveal({
  id,
  text,
  className,
  as: Tag = "p",
  delay = 0,
}: {
  /** Needed when a section is labelled by this heading. */
  id?: string;
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3" | "span";
  /** Milliseconds before the stagger begins. */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useRevealOnView(ref);

  const words = text.split(" ");

  return (
    <Tag
      id={id}
      ref={ref as React.Ref<never>}
      className={cn("tr", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="tr__w">
            <span className="tr__i" style={{ "--i": i } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
