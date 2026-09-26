import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProjectBriefForm } from "@/components/sections/project-brief-form";
import { contact, hasEmail, hasWhatsApp, site } from "@/config/site";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  // No `alternates.canonical` here on purpose. A relative canonical resolves
  // against the locale-free `metadataBase`, so it emitted the English URL on
  // every locale. `LocaleAlternates` derives canonical + hreflang per route
  // and per locale instead.
  title: "Start a project",
  description:
    "Tell AUREN what you are building or trying to fix. Six short questions, then a considered reply — not a calendar link.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const briefInboxReady = Boolean(process.env.BRIEF_WEBHOOK_URL);

  return (
    <section className="pt-36 pb-24">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Start a project</p>
          <h1 className="mt-6 text-[length:var(--text-title)]">
            Tell us what you are building.
          </h1>
          <p className="lead mt-6 max-w-[42ch]">
            {briefInboxReady
              ? "Six short questions. Enough to know whether we are the right studio for it, and enough to give you a real answer rather than a discovery call."
              : "The project inbox is being connected. Please check back soon."}
          </p>

          <dl className="mt-12 space-y-7 border-t border-line pt-8">
            <div>
              <dt className="eyebrow">Where we are</dt>
              <dd className="mt-2 text-sm text-silver">
                {site.region} · working beyond borders
              </dd>
            </div>
            {hasEmail && (
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-2 text-sm">
                  <a className="text-silver hover:text-mineral" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </dd>
              </div>
            )}
            {hasWhatsApp && (
              <div>
                <dt className="eyebrow">WhatsApp</dt>
                <dd className="mt-2 text-sm">
                  <a
                    className="text-silver hover:text-mineral"
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message us
                  </a>
                </dd>
              </div>
            )}
            {briefInboxReady && (
              <div>
                <dt className="eyebrow">Reply time</dt>
                <dd className="mt-2 text-sm text-silver">
                  Usually within two working days
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="md:col-span-7">
          {briefInboxReady ? (
            <ProjectBriefForm />
          ) : (
            <div className="border border-line bg-graphite p-8 md:p-12" role="status">
              <p className="eyebrow">Project enquiries</p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                Opening soon.
              </h2>
              <p className="mt-5 max-w-[48ch] leading-relaxed text-silver">
                We are connecting the project inbox. The brief form will open
                once we can receive every message reliably.
              </p>
              {hasEmail && (
                <a
                  className="mt-8 inline-block border-b border-silver pb-1 font-mono text-xs uppercase tracking-[0.16em] text-mineral"
                  href={`mailto:${contact.email}`}
                >
                  Email the studio →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
