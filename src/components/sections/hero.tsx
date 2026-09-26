import { Surface } from "@/components/surface/surface";
import { SignatureObject } from "@/components/signature/signature-object";
import { HeroDepth } from "@/components/motion/hero-depth";
import { ButtonLink } from "@/components/ui/button";

/**
 * One statement, one object, two actions.
 *
 * Nothing about the four practices appears here. A visitor should see the
 * studio's claim and then the work itself; the internal service taxonomy comes
 * much further down, once they have a reason to care about it.
 *
 * The right-hand visual is the studio's signature object — an abstract
 * sculpture of separate blades converging on one axis, raymarched in WebGL. It
 * is the studio's own motif rather than a decorative shape, and it is the first
 * thing that tells a visitor this is not a template.
 *
 * Two hooks belong to the hand-off into the next section:
 *   - `data-hero` is what SignatureObject measures to drive the transformation.
 *   - `data-hero-out` is scrubbed by the smooth-scroll provider: as the hero
 *     leaves, the typography lifts and settles back rather than simply
 *     scrolling away.
 *
 * Depth is polish, not redesign: the content block gains a fixed layer order —
 * headline, actions, lead — plus a pointer tilt of at most 2.5 degrees from
 * HeroDepth.
 */
export function Hero() {
  return (
    <section
      data-hero
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-32 pb-20 md:pt-28"
    >
      {/* The signature. Decorative by definition — every word below is real
          text in the server HTML, never inside the canvas. */}
      <Surface className="pointer-events-none absolute inset-0 -z-10" />
      <SignatureObject className="absolute right-[-19%] top-[6%] z-0 hidden aspect-square w-[min(62vw,780px)] md:block xl:right-[-11%]" />

      <div className="shell relative z-10">
        <HeroDepth>
          <div data-hero-out>
            <h1
              className="max-w-[15ch] text-[length:var(--text-statement)] leading-[0.92] tracking-[-0.03em]"
              style={{ transform: "translateZ(46px)" }}
            >
              We build digital experiences designed to move businesses{" "}
              <em className="italic">forward.</em>
            </h1>

            <p
              className="lead mt-9 max-w-[54ch]"
              style={{ transform: "translateZ(26px)" }}
            >
              Web experiences, products, creative, growth and intelligent systems —
              designed as one connected practice.
            </p>

            <div
              className="mt-12 flex flex-wrap gap-3"
              style={{ transform: "translateZ(34px)" }}
            >
              <ButtonLink href="/work">View work</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Start a project
              </ButtonLink>
            </div>
          </div>
        </HeroDepth>
      </div>
    </section>
  );
}
