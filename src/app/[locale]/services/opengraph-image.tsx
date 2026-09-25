import { createOgImage, ogSize } from "@/lib/og-image";

export const alt = "AUREN capabilities";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage("What we build, together.", "Capabilities");
}
