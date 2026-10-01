import type { Metadata } from "next";
import { share } from "@/lib/share";
import { setRequestLocale } from "next-intl/server";
import { StartProjectQuestionnaire } from "@/components/sections/start-project-questionnaire";
import { contact, hasEmail, site } from "@/config/site";
import { c, tr } from "@/i18n/copy";
import { routing } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"));
  const description = tr(locale, c(
      "Tell AUREN what you are building or trying to improve in four short steps.",
      "Décrivez à AUREN ce que vous voulez créer ou améliorer, en quatre étapes courtes.",
      "قول لـ AUREN شنو باغي تبني ولا تحسّن، فأربع خطوات قصيرة.",
    ));
  return { title, description, ...share("/og/contact.png", title, description) };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="min-h-[100svh] pb-24 pt-32 sm:pt-36">
      <div className="shell grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="eyebrow">{tr(locale, c("Start a project", "Lancer un projet", "بدا مشروع"))}</p>
          <h1 className="mt-6 max-w-[12ch] text-[length:var(--text-title)]">
            {tr(locale, c("Tell us what you’re building.", "Parlez-nous de votre projet.", "قول لينا شنو باغي تبني."))}
          </h1>
          <p className="lead mt-6 max-w-[42ch]">
            {tr(locale, c(
              "Four short steps. Share just enough to start a useful conversation.",
              "Quatre étapes courtes. Juste assez pour entamer une vraie conversation.",
              "أربع خطوات خفاف. غير القدر اللي يخلينا نبداو هضرة مفيدة.",
            ))}
          </p>
          <dl className="mt-12 space-y-7 border-t border-line pt-8">
            <div>
              <dt className="eyebrow">{tr(locale, c("Where we are", "Où nous trouver", "فين حنا"))}</dt>
              <dd className="mt-2 text-sm text-silver">{tr(locale, c(`${site.region} · working beyond borders`, "Maroc · et partout ailleurs", "المغرب · وكنخدمو حتى برا"))}</dd>
            </div>
            {hasEmail && (
              <div>
                <dt className="eyebrow">{tr(locale, c("Email", "E-mail", "الإيميل"))}</dt>
                <dd className="mt-2 text-sm"><a className="text-silver hover:text-mineral" href={`mailto:${contact.email}`}>{contact.email}</a></dd>
              </div>
            )}
          </dl>
        </div>
        <div className="lg:col-span-7">
          <StartProjectQuestionnaire locale={locale} />
        </div>
      </div>
    </section>
  );
}
