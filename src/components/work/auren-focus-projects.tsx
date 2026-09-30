import { FocusCards } from "@/components/ui/focus-cards";
import { focusProjects } from "@/content/focus-projects";
import { c, tr } from "@/i18n/copy";

export function AurenFocusProjects({ locale }: { locale: string }) {
  return (
    <section className="border-t border-line py-20 md:py-28" aria-labelledby="focus-heading">
      <div className="shell">
        <p className="eyebrow">{tr(locale, c("Digital experiences", "Expériences digitales", "تجارب رقمية"))}</p>
        <h2 id="focus-heading" className="mt-6 max-w-[22ch] font-display text-[length:var(--text-display)] leading-[1.02]">
          {tr(locale, c("Different worlds. The same care.", "Des univers différents. La même attention.", "عوالم مختلفة. نفس العناية."))}
        </h2>
        <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-grey">
          {tr(locale, c("Seven visual directions. Concepts and references, open to possibility.", "Sept directions visuelles. Des concepts et des références à explorer.", "سبعة توجهات بصرية. تصوّرات ومراجع كتحلّ آفاق جديدة."))}
        </p>
        <div className="mt-14 md:mt-20">
          <FocusCards cards={focusProjects.map((p) => ({ ...p, title: tr(locale, p.title), alt: tr(locale, p.alt), category: tr(locale, c("Concept", "Concept", "تصوّر")) }))} />
        </div>
      </div>
    </section>
  );
}
