import { createOgImage, ogSize } from "@/lib/og-image";

export const alt = "About AUREN Studio";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage("Small on purpose.", "The studio");
}
