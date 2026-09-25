import { Surface } from "@/components/surface/surface";
import { OrbitalSculpture } from "@/components/motion/orbital-sculpture";
import { ButtonLink } from "@/components/ui/button";

/**
 * One statement, one surface, two actions.
 *
 * Nothing about the four practices appears here. A visitor should see the
 * studio's claim and then the work itself; the internal service taxonomy comes
 * much further down, once they have a reason to care about it.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-32 pb-20 md:pt-28">
      {/* The signature. Decorative by definition — every word below is real
          text in the server HTML, never inside the canvas. */}
      <Surface className="pointer-events-none absolute inset-0 -z-10" />
      <OrbitalSculpture className="right-[-21%] top-[10%] z-0 hidden opacity-55 md:block xl:right-[-12%] xl:opacity-70" />

      <div className="shell relative z-10">
        <h1 className="max-w-[15ch] text-[length:var(--text-statement)] leading-[0.92] tracking-[-0.03em]">
          We build digital experiences designed to move businesses{" "}
          <em className="italic">forward.</em>
        </h1>

        <p className="lead mt-9 max-w-[54ch]">
          Web experiences, products, creative, growth and intelligent systems —
          designed as one connected practice.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/work">View work</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Start a project
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
