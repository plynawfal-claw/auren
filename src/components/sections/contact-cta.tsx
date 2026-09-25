import { ButtonLink } from "@/components/ui/button";
import { OrbitalSculpture } from "@/components/motion/orbital-sculpture";
import { contact, hasEmail, hasWhatsApp } from "@/config/site";

export function ContactCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32" aria-labelledby="cta-heading">
      <OrbitalSculpture className="right-[-18%] top-[-42%] z-0 hidden opacity-40 md:block" />
      {/* A single soft light, low in the section. Pure CSS — a second WebGL
          context for an ambient glow would not earn its cost. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 100% at 50% 100%, rgba(220,230,245,0.10), transparent 70%)",
        }}
      />

      <div className="shell relative z-10">
        <h2 id="cta-heading" className="max-w-[13ch] text-[length:var(--text-display)] leading-[0.94]">
          Have something worth building?
        </h2>
        <p className="lead mt-7 max-w-[46ch]">
          Tell us what you are building or trying to fix. You will get a
          considered reply, not a calendar link.
        </p>

        <div className="mt-11 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Start a project</ButtonLink>
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
