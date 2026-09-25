import { createOgImage, ogSize } from "@/lib/og-image";

export const alt = "Selected work by AUREN";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage("Work we have made.", "Selected work");
}
