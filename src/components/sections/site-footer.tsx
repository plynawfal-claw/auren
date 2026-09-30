import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/ui/wordmark";
import { services } from "@/content/services";
import { localizeService } from "@/content/services.i18n";
import { contact, founder, hasEmail, hasWhatsApp, site } from "@/config/site";
import { c, tr } from "@/i18n/copy";
import type { Locale } from "@/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="text-mineral">
              <Wordmark />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-grey">
              {tr(locale, c(site.description, "Un studio créatif qui relie design, technologie et croissance.", "ستوديو إبداعي كيجمع التصميم، التكنولوجيا والنمو."))}
            </p>
            <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-grey">
              {tr(locale, c(`Based in ${site.region} · Working beyond borders`, "Basé au Maroc · Ouvert sur le monde", "من المغرب · كنخدمو بلا حدود"))}
            </p>
          </div>

          <nav className="md:col-span-4" aria-label={tr(locale, c("Capabilities", "Expertises", "الخدمات"))}>
            <h2 className="eyebrow">{tr(locale, c("Capabilities", "Expertises", "الخدمات"))}</h2>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  {/* Every capability page, anchored by its own name. These are
                      the site's commercial pages; one crawlable link each from
                      every route is what keeps them close to the homepage. */}
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline gap-3 text-sm text-silver transition-colors hover:text-mineral"
                  >
                    {localizeService(s, locale).title}
                    <span
                      aria-hidden="true"
                      className="translate-x-0 opacity-0 transition-all duration-[var(--dur)] ease-[var(--ease)] group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow">{tr(locale, c("Contact", "Contact", "تواصل"))}</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-silver transition-colors hover:text-mineral"
                >
                  {tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}
                </Link>
              </li>
              {/* Rendered only when a real channel is configured. The site
                  never ships a dead mailto: or a wa.me link to nowhere. */}
              {hasEmail && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-silver transition-colors hover:text-mineral"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {hasWhatsApp && (
                <li>
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-silver transition-colors hover:text-mineral"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-grey sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · {founder.name}
          </p>
          <p>{tr(locale, c("Digital experiences · Creative · Growth · Intelligent systems", "Expériences digitales · Création · Croissance · Systèmes intelligents", "تجارب رقمية · إبداع · نمو · أنظمة ذكية"))}</p>
        </div>
      </div>
    </footer>
  );
}
