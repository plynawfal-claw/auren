import { createOgImage, ogSize } from "@/lib/og-image";

export const alt = "Start a project with AUREN";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage("Have something worth building?", "Contact");
}
