import { createOgImage, ogSize } from "@/lib/og-image";
import { articleBySlug } from "@/content/insights";

export const size = ogSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug[slug];
  return createOgImage(article?.title ?? "AUREN", "Insight");
}
