import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BrowserFrame, DeviceFrame } from "@/components/work/browser-frame";
import { TextReveal } from "@/components/motion/text-reveal";
import { projectBySlug, type Project } from "@/content/projects";
import { practiceTag, type PracticeId } from "@/content/practices";
import { cn } from "@/lib/cn";

/**
 * Selected work, as an exhibition.
 *
 * The previous section put six projects on an ellipse and rotated them. It was
 * a good interaction and a bad presentation: six identical frames, one at a
 * time, each held at a third of its size. Work is the reason anyone is here,
 * so it now gets four layouts instead of one — full-bleed, split, cinematic
 * and device — and each one is laid out for the project rather than the
 * project being poured into a slot.
 *
 * What each presentation carries:
 *   - the name, at scale, in the display face;
 *   - the industry, in the plainest words a business owner uses;
 *   - what was actually built, taken from the project's own delivered list;
 *   - the one-sentence description;
 *   - the work itself, large;
 *   - one interaction: a masked arrival on scroll, a slow parallax, a
 *     pointer tilt, and a pointer-driven push-in on the picture.
 *
 * Honesty rules carry over unchanged. Concept work is badged inside the frame,
 * and no entry carries a metric, a testimonial or an award.
 */

type Variant = "full" | "split" | "cinema" | "device";

/**
 * Order is editorial. All three shipped client projects lead, because that is
 * what a prospective client is looking for.
 */
const SLIDES: { slug: string; variant: Variant }[] = [
  { slug: "docteur-plante", variant: "full" },
  { slug: "tagpet", variant: "split" },
  { slug: "promostore-alu", variant: "cinema" },
];

function Ledger({
  index,
  title,
  industry,
  year,
  practices,
  delivered,
  align = "left",
}: {
  index: string;
  title: string;
  industry: string;
  year: number;
  practices: readonly PracticeId[];
  delivered: readonly string[];
  align?: "left" | "right";
}) {
  return (
    <div className={cn(align === "right" && "md:text-right")}>
      <div
        className={cn(
          "flex items-baseline gap-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-grey",
          align === "right" && "md:justify-end",
        )}
      >
        <span>{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span className="text-silver">{industry}</span>
        <span className="text-grey-deep">{year}</span>
      </div>

      <h3 className="mt-5 font-display text-[clamp(2.1rem,5.2vw,4.25rem)] leading-[0.94] tracking-[-0.02em]">
        {title}
      </h3>

      <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">
        {practices.map((p) => practiceTag[p as keyof typeof practiceTag]).join(" · ")}
      </p>

      {/* What was built. Taken from the project's own list — never written for
          this page, so it cannot drift from the case study. */}
      <ul
        className={cn(
          "mt-7 max-w-[42ch] space-y-1.5 text-sm leading-relaxed text-silver",
          align === "right" && "md:ml-auto",
        )}
      >
        {delivered.slice(0, 3).map((line) => (
          <li key={line} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-line-strong" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ViewProject({ slug, label, liveUrl }: { slug: string; label: string; liveUrl?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href={`/work/${slug}`}
        className="group inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mineral"
      >
        {label}
        <span aria-hidden="true" className="transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1">
          →
        </span>
      </Link>
      {/* Show a live badge for shipped projects with a public URL. */}
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="au-live-badge hover:border-grey transition-colors"
          aria-label={`Visit the live site for this project (opens in a new tab)`}
        >
          Live site
        </a>
      )}
    </div>
  );
}


/* ---------- full-bleed -------------------------------------
   The widest possible statement of one project, edge to edge,
   above the hatch of the frame. The ledger sits inside the shell
   so the type stays on the page grid even though the image does
   not. `-inset-[6%]` on the depth layer is what lets the picture
   drift ±5% on scroll without ever revealing the edge of its box.
   ----------------------------------------------------------- */
function FullBleed({ index, project }: { index: string; project: Project }) {
  return (
    <article className="relative">
      <div className="shell">
        <Ledger
          index={index}
          title={project.title}
          industry={project.industry}
          year={project.year}
          practices={project.practices}
          delivered={project.delivered}
        />
      </div>

      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} — view project`}
        className="work-frame group mt-9 block border-y border-line"
      >
        <div
          data-reveal-mask
          className="relative aspect-[4/3] overflow-hidden bg-graphite sm:aspect-[16/9] lg:aspect-[21/9]"
        >
          <div data-depth="5" className="absolute -inset-[6%]">
            <Image
              src={project.site.desktop}
              alt={project.site.alt}
              fill
              priority
              sizes="100vw"
              className="work-frame__img object-cover object-top"
            />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
          />
        </div>
      </Link>

      <div className="shell mt-7 flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
        <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-silver md:text-base">
          {project.tagline}
        </p>
        <ViewProject slug={project.slug} label="View project" liveUrl={project.links.live} />
      </div>
    </article>
  );
}

/* ---------- split ------------------------------------------
   The reading half stays put while the work moves past it. The
   frame keeps its browser chrome here — on this layout the point
   is that it is a site, not a photograph.
   ----------------------------------------------------------- */
function Split({ index, project }: { index: string; project: Project }) {
  return (
    <article className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <Ledger
          index={index}
          title={project.title}
          industry={project.industry}
          year={project.year}
          practices={project.practices}
          delivered={project.delivered}
        />
        <p className="mt-7 max-w-[44ch] text-[0.95rem] leading-relaxed text-silver">
          {project.tagline}
        </p>
        <div className="mt-8">
          <ViewProject slug={project.slug} label="View project" liveUrl={project.links.live} />
        </div>
      </div>

      <div className="lg:col-span-7">
        <Link href={`/work/${project.slug}`} className="work-frame group block">
          <div data-reveal-mask>
            <BrowserFrame
              src={project.site.desktop}
              alt={project.site.alt}
              domain={project.site.label}
              badge={undefined}
              sizes="(max-width: 1024px) 92vw, 55vw"
            />
          </div>
        </Link>
      </div>
    </article>
  );
}

/* ---------- cinematic ---------------------------------------
   The widest crop on the site, with the type set into the
   picture rather than beside it. The left-to-right scrim is what
   keeps the display face legible over a screenshot without
   dimming the work itself.
   ----------------------------------------------------------- */
function Cinema({ index, project }: { index: string; project: Project }) {
  return (
    <article>
      <div className="shell flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-grey">
        <span>{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span className="text-silver">{project.industry}</span>
        <span className="text-grey-deep">{project.year}</span>
      </div>

      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} — view project`}
        className="work-frame group mt-7 block"
      >
        <div
          data-reveal-mask
          className="relative aspect-[4/3] overflow-hidden border-y border-line bg-graphite sm:aspect-[2/1] lg:aspect-[21/9]"
        >
          <div data-depth="4" className="absolute -inset-[7%]">
            <Image
              src={project.site.desktop}
              alt={project.site.alt}
              fill
              sizes="100vw"
              className="work-frame__img object-cover object-top"
            />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent"
          />
          <div className="absolute inset-0 flex items-end overflow-hidden">
            <div className="shell pb-7 md:pb-10 lg:pb-14">
              <h3 className="max-w-[14ch] font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.94]">
                {project.title}
              </h3>
              <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-silver md:text-base">
                {project.tagline}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mineral">
                View project
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="shell mt-6 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-grey-deep">
          {project.practices.map((p) => practiceTag[p]).join(" · ")}
        </p>
        <p className="max-w-[54ch] text-sm leading-relaxed text-grey">
          {project.delivered.slice(0, 3).join(" · ")}
        </p>
      </div>
    </article>
  );
}

/* ---------- device ------------------------------------------
   The interface as an interface: the site and the same site in
   a hand, overlapping, with the phone allowed to break the frame
   on a wide screen and simply placed below it on a phone, where
   an overhang is nothing but a collision.
   ----------------------------------------------------------- */
function Device({ index, project }: { index: string; project: Project }) {
  return (
    <article className="shell grid gap-x-14 gap-y-12 lg:grid-cols-12 lg:pb-10">
      <div className="lg:col-span-5">
        <Ledger
          index={index}
          title={project.title}
          industry={project.industry}
          year={project.year}
          practices={project.practices}
          delivered={project.delivered}
        />
        <p className="mt-7 max-w-[44ch] text-[0.95rem] leading-relaxed text-silver">
          {project.tagline}
        </p>
        <div className="mt-8">
          <ViewProject slug={project.slug} label="View project" liveUrl={project.links.live} />
        </div>
      </div>

      <div className="lg:col-span-7" data-reveal-3d>
        <div className="relative lg:pb-6">
          <Link href={`/work/${project.slug}`} className="work-frame group block">
            <div data-reveal-mask>
              <BrowserFrame
                src={project.site.desktop}
                alt={project.site.alt}
                domain={project.site.label}
                badge={undefined}
                sizes="(max-width: 1024px) 92vw, 55vw"
              />
            </div>
          </Link>

          <DeviceFrame
            src={project.site.mobile}
            alt={`${project.title} on a phone`}
            className="mt-6 w-[38%] max-w-[170px] -rotate-2 lg:absolute lg:-bottom-8 lg:-left-10 lg:mt-0 lg:w-[30%] lg:max-w-[186px] lg:rotate-[-3deg]"
          />
        </div>
      </div>
    </article>
  );
}

const VARIANTS: Record<
  Variant,
  (props: { index: string; project: Project }) => React.JSX.Element
> = {
  full: FullBleed,
  split: Split,
  cinema: Cinema,
  device: Device,
};


/**
 * Selected work.
 *
 * Four presentations, four layouts, one section. The rhythm is deliberate:
 * widest statement first, then the reading frame, then the cinematic crop,
 * then the interface in the hand — wide, split, wide, intimate.
 */
export function WorkShowcase() {
  const slides = SLIDES.flatMap((slide, i) => {
    const project = projectBySlug[slide.slug];
    if (!project) return [];
    return [{ ...slide, project, index: String(i + 1).padStart(2, "0") }];
  });

  return (
    <section
      className="relative border-t border-line py-24 md:py-32"
      aria-labelledby="work-heading"
    >
      <div className="shell">
        <p className="eyebrow">Selected work</p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-14 gap-y-7">
          <TextReveal
            id="work-heading"
            as="h2"
            text="Work we have shipped."
            className="max-w-[18ch] text-[length:var(--text-display)] leading-[0.94]"
          />
          <p className="max-w-[40ch] text-sm leading-relaxed text-grey md:text-base">
            Three real businesses, shipped end to end.
          </p>
        </div>
      </div>

      <div className="mt-20 space-y-32 md:mt-28 md:space-y-44">
        {slides.map(({ variant, project, index }) => {
          const Presentation = VARIANTS[variant];
          return <Presentation key={project.slug} index={index} project={project} />;
        })}
      </div>
    </section>
  );
}
