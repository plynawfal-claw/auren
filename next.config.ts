import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  // The development-tools badge defaults to the bottom-left corner, where it
  // obscures the palette control during visual review. Keep error overlays
  // available while removing the badge itself.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Lets a phone on the same Wi-Fi reach the dev server's HMR socket. Without
  // it the page loads over the LAN but never live-reloads, which makes testing
  // the mobile layout needlessly painful.
  //
  // Development only — Next ignores this in a production build, and it grants
  // nothing beyond dev resources. Private-range addresses only; never put a
  // public host here.
  //
  // Whole private ranges rather than one address: the Mac's DHCP lease moves
  // between networks, and a stale single IP silently drops the HMR socket on
  // the phone again.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default withNextIntl(nextConfig);
