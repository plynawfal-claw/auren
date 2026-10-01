import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext adapter for Cloudflare Workers.
 *
 * Defaults only: no R2 incremental cache, no D1 tag cache, no queue. Every
 * page here is prerendered at build time and served from the Worker's static
 * assets, so nothing needs a paid binding and the deploy stays on the free
 * plan. Add a cache binding only if the site starts revalidating pages.
 */
export default defineCloudflareConfig();
