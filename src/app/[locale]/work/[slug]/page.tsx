import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrowserFrame, DeviceFrame } from "@/components/work/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { practiceTag } from "@/content/practices";
import { nextProject, projectBySlug, projects } from "@/content/projects";
import { routing } from "@/i18n/navigation";
import { siteUrl } from "@/config/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug[slug];
  if (!project) return {};

  return {
    title: `${project.title} — ${project.industry}`,
    description: project.tagline,
    openGraph: {
      type: "article",
      title: `${project.title} · AUREN`,
      description: project.tagline,
      images: [{ url: project.site.desktop }],
    },
  };
}

/**
 * Case study.
 *
 * Title, one sentence, one metadata line, then the work — immediately. The
 * previous version opened with a four-column definition list, which read as
 * documentation rather than as a premium case study.
 */
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = projectBySlug[slug];
  if (!project) notFound();

  const next = nextProject(slug);
  const tags = project.practices.map((p) => practiceTag[p]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${siteUrl}/work/${project.slug}#work`,
        name: project.title,
        headline: project.title,
        description: project.tagline,
        dateCreated: String(project.year),
        creator: { "@id": `${siteUrl}/#organization` },
        about: project.industry,
        keywords: tags,
        inLanguage: "en",
        ...(project.links.live ? { sameAs: [project.links.live] } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/work` },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `${siteUrl}/work/${project.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="pt-32 md:pt-36">
        <div className="shell">
          <Link
            href="/work"
            className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-grey transition-colors hover:text-mineral"
          >
            ← Work
          </Link>

          <h1 className="mt-10 text-[length:var(--text-statement)] leading-[0.9] tracking-[-0.03em]">
            {project.title}
          </h1>

          <p className="lead mt-8 max-w-[52ch]">{project.tagline}</p>

          <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-grey">
            {project.industry} · {tags.join(" · ")} · {project.year}
          </p>

          {/* Stated plainly, at the top, in the visitor's line of sight. A
              concept must never be mistaken for a client engagement. */}
          {project.kind === "concept" && (
            <p className="mt-8 max-w-[52ch] border-l border-line-strong pl-5 text-sm leading-relaxed text-grey">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-silver">
                Studio concept
              </span>
              <br />
              This is our own exploration, not a commission. There is no client,
              no brief and no results to report — we designed and built it to
              show how we would approach this kind of business.
            </p>
          )}
        </div>

        {/* The work, immediately. */}
        <div className="shell mt-14">
          <BrowserFrame
            src={project.site.desktop}
            alt={project.site.alt}
            domain={project.site.label}
            badge={project.kind === "concept" ? "Studio concept" : undefined}
            priority
            sizes="(max-width: 768px) 92vw, 88vw"
          />
        </div>
      </header>

      <Section heading="Challenge">
        <p className="max-w-[62ch] text-[length:var(--text-lead)] leading-[1.5] text-mineral">
          {project.challenge}
        </p>
      </Section>

      <Section heading="Experience">
        <ul className="max-w-[64ch]">
          {project.experience.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 70} className="border-t border-line py-6">
              <p className="leading-relaxed text-silver">{item}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* The same experience on a phone, beside the system notes. */}
      <section className="shell py-16">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="eyebrow">System</h2>
            <DeviceFrame
              src={project.site.mobile}
              alt={`${project.title} on a phone`}
              className="mt-8 w-[52%] max-w-[210px] md:w-full"
              sizes="(max-width: 768px) 52vw, 210px"
            />
          </div>
          <ul className="md:col-span-8">
            {project.system.map((item, i) => (
              <Reveal as="li" key={i} delay={i * 70} className="border-t border-line py-6">
                <p className="max-w-[62ch] leading-relaxed text-silver">{item}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Section heading="Delivered">
        <ul className="grid max-w-[64ch] gap-x-10 sm:grid-cols-2">
          {project.delivered.map((d) => (
            <li key={d} className="border-t border-line py-3 text-sm text-silver">
              {d}
            </li>
          ))}
        </ul>

        <h3 className="eyebrow mt-12">Built with</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-grey"
            >
              {s}
            </li>
          ))}
        </ul>

        {project.links.live && (
          <div className="mt-10">
            <ButtonLink href={project.links.live} variant="ghost">
              Visit the live site
            </ButtonLink>
          </div>
        )}
      </Section>

      {/* `outcome` is null on every project by design. Rather than hide the
          section and pretend the question was never asked, the page says why
          there is no number — which is more persuasive than inventing one. */}
      <Section heading="Outcome">
        <p className="max-w-[60ch] leading-relaxed text-grey">
          {project.kind === "concept"
            ? "Nothing to report. No concept on this site carries results, because no concept has a client, a budget or a launch behind it."
            : "No performance figures are published for this project. Verified numbers will appear here when the client agrees to release them; until then the delivered work above is the evidence."}
        </p>
      </Section>

      {next && (
        <nav className="border-t border-line" aria-label="Next project">
          <Link href={`/work/${next.slug}`} className="group block py-20">
            <div className="shell">
              <p className="eyebrow">Next project</p>
              <p className="mt-5 font-display text-[clamp(2.25rem,7vw,5rem)] leading-[0.92] transition-transform duration-[var(--dur-editorial)] ease-[var(--ease)] group-hover:translate-x-3">
                {next.title}
              </p>
            </div>
          </Link>
        </nav>
      )}
    </article>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shell border-t border-line py-16">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="eyebrow">{heading}</h2>
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}
