import { createOgImage, ogSize } from "@/lib/og-image";
import { serviceBySlug } from "@/content/services";

export const size = ogSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  return createOgImage(service?.title ?? "AUREN", "Capability");
}
