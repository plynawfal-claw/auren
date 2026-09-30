import { HeroParallax } from "@/components/ui/hero-parallax";
import { projectBySlug } from "@/content/projects";
import { c, tr } from "@/i18n/copy";

const selected = [
  { slug: "docteur-plante", width: 1440, height: 900 },
  { slug: "tagpet", width: 1440, height: 838 },
  { slug: "promostore-alu", width: 1440, height: 838 },
] as const;

export function AurenHeroParallax({ locale }: { locale: string }) {
  return (
    <HeroParallax products={selected.map(({ slug, width, height }) => {
      const p = projectBySlug[slug];
      return { title: p.title, link: `/work/${slug}`, thumbnail: p.site.desktop, alt: p.site.alt, width, height, category: tr(locale, c("View project", "Voir le projet", "شوف المشروع")) };
    })}>
      <p className="eyebrow">{tr(locale, c("Selected work", "Projets choisis", "مشاريع مختارة"))}</p>
      <h2 id="parallax-heading" className="mt-6 max-w-[22ch] font-display text-[length:var(--text-display)] leading-[1.02]">
        {tr(locale, c("Different businesses. One standard of execution.", "Des entreprises différentes. Une même exigence.", "مشاريع مختلفة. نفس الإتقان."))}
      </h2>
    </HeroParallax>
  );
}
