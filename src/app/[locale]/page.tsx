import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { WhyAuren } from "@/components/sections/why-auren";
import { AurenHeroParallax } from "@/components/work/auren-hero-parallax";
import { AurenFocusProjects } from "@/components/work/auren-focus-projects";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { IntelligentSystems } from "@/components/sections/intelligent-systems";
import { SectionBridge } from "@/components/motion/section-bridge";
import { Process } from "@/components/sections/process";
import { ContactCta } from "@/components/sections/contact-cta";

/**
 * Homepage architecture.
 *
 *   hero → selected work → why → capabilities → focus concepts →
 *   how we work → contact
 *
 * The shipped work comes first because a visitor should see what this studio
 * has actually made before being shown what it can make for them.
 *
 * Each section owns exactly one motion idea. Nothing else animates.
 *
 * The rhythm is the point: quiet, motion, impact, rooms, quiet, finale.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero locale={locale} />
      <AurenHeroParallax locale={locale} />
      <WhyAuren locale={locale} />
      <WhatWeBuild locale={locale} />
      <IntelligentSystems locale={locale} />
      <SectionBridge locale={locale} />
      <AurenFocusProjects locale={locale} />
      <Process locale={locale} />
      <ContactCta locale={locale} />
    </>
  );
}
