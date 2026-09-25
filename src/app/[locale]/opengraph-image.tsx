import { createOgImage, ogSize } from "@/lib/og-image";

export const alt = "AUREN — digital experiences designed to move businesses forward";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage("We build digital experiences.", "The studio");
}
