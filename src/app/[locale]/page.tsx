import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { WhyAuren } from "@/components/sections/why-auren";
import { WorkShowcase } from "@/components/sections/work-showcase";
import { ConceptsShowcase } from "@/components/sections/concepts-showcase";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { Range } from "@/components/sections/range";
import { Process } from "@/components/sections/process";
import { StudioNote } from "@/components/sections/studio-note";
import { ContactCta } from "@/components/sections/contact-cta";
import { asLocale } from "@/i18n/copy";

/**
 * Homepage architecture.
 *
 *   hero → why → shipped work → the five concepts → capabilities → range →
 *   how we work → studio → contact
 *
 * The shipped work comes first because a visitor should see what this studio
 * has actually made before being shown what it hopes to make. The five
 * concepts follow immediately after, because for most of the businesses this
 * studio wants, there is no shipped work to look at yet — the concepts are the
 * argument, and burying them under a capabilities grid would be hiding it.
 *
 * Each section owns exactly one motion idea. Nothing else animates.
 *
 * The rhythm is the point: quiet, motion, impact, five rooms, quiet, finale.
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
      <Hero />
      <WhyAuren />
      <WorkShowcase />
      <ConceptsShowcase locale={asLocale(locale)} />
      <WhatWeBuild />
      <Range />
      <Process />
      <StudioNote />
      <ContactCta />
    </>
  );
}
