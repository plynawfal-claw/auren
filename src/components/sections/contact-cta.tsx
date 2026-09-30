import { ButtonLink } from "@/components/ui/button";
import { TextReveal } from "@/components/motion/text-reveal";
import { contact, hasEmail, hasWhatsApp } from "@/config/site";
import { c, tr } from "@/i18n/copy";

/**
 * The close.
 *
 * The studio's motif, at its clearest: seven hairlines enter from across the
 * full width and meet at a single point directly above the statement. Nothing
 * else moves in this section — no sculpture, no glow behind the type — because
 * after eight sections the right final gesture is one idea, stated once.
 *
 * The lines are a single SVG with `preserveAspectRatio="none"` and
 * `vector-effect: non-scaling-stroke`, so they stay exactly one pixel at every
 * viewport width instead of thickening as the section stretches.
 */
export function ContactCta({ locale }: { locale: string }) {
  return (
    <section
      className="relative overflow-hidden border-t border-line pt-24 pb-28 md:pt-32 md:pb-36"
      aria-labelledby="cta-heading"
    >
      <svg
        aria-hidden="true"
        data-depth="6"
        viewBox="0 0 100 42"
        preserveAspectRatio="none"
        className="au-converge pointer-events-none absolute inset-x-0 top-0 h-[30%] w-full"
      >
        {[1, 17, 33, 50, 67, 83, 99].map((x, i) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={50}
            y2={42}
            stroke="var(--color-lume)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity={i === 3 ? 0.45 : 0.22}
          />
        ))}
        <circle cx="50" cy="42" r="1.1" fill="var(--color-lume)" opacity="0.7" />
      </svg>

      {/* A single soft light, low in the section. Pure CSS — a second WebGL
          context for an ambient glow would not earn its cost. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 100% at 50% 100%, color-mix(in srgb, var(--color-lume) 10%, transparent), transparent 70%)",
        }}
      />

      <div className="shell relative z-10">
        <p className="eyebrow">{tr(locale, c("Next step", "La suite", "الخطوة الجاية"))}</p>

        <TextReveal
          id="cta-heading"
          as="h2"
          text={tr(locale, c("Have something worth building?", "Un projet qui mérite de voir le jour ?", "عندك فكرة كتستاهل تبنيها؟"))}
          className="mt-8 max-w-[15ch] text-[length:var(--text-statement)] leading-[0.94] tracking-[-0.025em]"
        />

        <p className="lead mt-9 max-w-[46ch]">
          {tr(locale, c(
            "Tell us what you are building or trying to fix. You will get a considered reply, not a calendar link.",
            "Parlez-nous de ce que vous créez ou cherchez à améliorer. Vous recevrez une réponse réfléchie, pas un lien vers un calendrier.",
            "قول لينا شنو باغي تبني أو تصلّح. غادي نجاوبوك بجواب مدروس، ماشي غير برابط ديال المواعيد.",
          ))}
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/contact">{tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}</ButtonLink>
          {hasEmail && (
            <ButtonLink href={`mailto:${contact.email}`} variant="ghost">
              {contact.email}
            </ButtonLink>
          )}
          {hasWhatsApp && (
            <ButtonLink href={`https://wa.me/${contact.whatsapp}`} variant="ghost">
              WhatsApp
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
