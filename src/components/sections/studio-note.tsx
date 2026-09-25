import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";
import { founder, site } from "@/config/site";

/**
 * A short human note, not a corporate biography.
 *
 * Full-bleed and quiet, with no border and no card — it is one of the moments
 * that breaks the page's rhythm of framed sections.
 */
export function StudioNote() {
  return (
    <section className="py-24 md:py-36" aria-labelledby="studio-note">
      <div className="shell">
        <h2 id="studio-note" className="eyebrow">
          The studio
        </h2>
        <Reveal>
          <p className="mt-8 max-w-[19ch] font-display text-[length:var(--text-display)] leading-[0.96]">
            Small on purpose.
          </p>
          <p className="mt-10 max-w-[54ch] text-[length:var(--text-lead)] leading-[1.5] text-silver">
            {site.name} is led by {founder.name}, working from {site.region} with
            clients beyond it. Small enough that the person you talk to is the
            person doing the work, and that the website, the advert and what
            happens after the enquiry are all decided by the same hand.
          </p>
          <Link
            href="/studio"
            className="group mt-10 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mineral"
          >
            More about the studio
            <span className="transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
