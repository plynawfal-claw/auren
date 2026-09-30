"use client";

import { useEffect, useRef } from "react";

/**
 * Back-to-top button.
 *
 * Appears once the hero has scrolled past — never at the top of a page where
 * the user is already there. Uses the IntersectionObserver on a sentinel placed
 * at the end of the hero rather than a scroll-position number, because that
 * reads the layout directly and works regardless of hero height changes.
 */
export function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sentinel = document.querySelector("[data-hero]");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Visible = hero still on screen = button hidden.
        btnRef.current?.classList.toggle("is-visible", !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" as ScrollBehavior });

  return (
    <button
      ref={btnRef}
      type="button"
      className="au-back-top"
      onClick={toTop}
      aria-label="Back to top"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 12V4M4 8l4-4 4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
