import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  allowedDevOrigins: ["192.168.100.188"],
};

export default withNextIntl(nextConfig);
