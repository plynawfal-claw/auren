import { createOgImage, ogSize } from "@/lib/og-image";

export const alt = "AUREN insights";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage("Notes from the work.", "Insights");
}
