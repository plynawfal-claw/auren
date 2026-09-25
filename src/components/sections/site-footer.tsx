import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/ui/wordmark";
import { practices } from "@/content/practices";
import { contact, founder, hasEmail, hasWhatsApp, site } from "@/config/site";

export function SiteFooter() {
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
              {site.description}
            </p>
            <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-grey">
              Based in {site.region} · Working beyond borders
            </p>
          </div>

          <nav className="md:col-span-4" aria-label="Capabilities">
            <h2 className="eyebrow">Capabilities</h2>
            <ul className="mt-5 space-y-2.5">
              {practices.map((d) => (
                <li key={d.id}>
                  <Link
                    href="/services"
                    className="group flex items-baseline gap-3 text-sm text-silver transition-colors hover:text-mineral"
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow">Contact</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-silver transition-colors hover:text-mineral"
                >
                  Start a project
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
          <p>Digital experiences · Creative · Growth · Intelligent systems</p>
        </div>
      </div>
    </footer>
  );
}
