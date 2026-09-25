import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { WhyAuren } from "@/components/sections/why-auren";
import { WorkOrbit } from "@/components/work/work-orbit";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { Range } from "@/components/sections/range";
import { Process } from "@/components/sections/process";
import { StudioNote } from "@/components/sections/studio-note";
import { ContactCta } from "@/components/sections/contact-cta";

/**
 * Homepage architecture.
 *
 *   hero → why → work → what we build → range → how we work → studio → contact
 *
 * The work comes before the capabilities on purpose: a visitor should see what
 * this studio has made before being asked to read what it offers.
 *
 * Each section owns exactly one motion idea — ambient light, pieces
 * connecting, spatial orbit, one shape transforming, a journey, a closing
 * reveal. Nothing else animates.
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
      <WorkOrbit />
      <WhatWeBuild />
      <Range />
      <Process />
      <StudioNote />
      <ContactCta />
    </>
  );
}
