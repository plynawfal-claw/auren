"use client";

/**
 * One event vocabulary, three destinations.
 *
 * Every tracked interaction goes through `track()`. Calling gtag or fbq
 * directly from a component is how a funnel ends up with three slightly
 * different names for the same action and a purchase counted twice.
 *
 * Nothing loads unless the corresponding id is configured, so a deployment
 * without analytics ships no third-party script at all.
 */

export type AurenEvent =
  | "view_project"
  | "project_cta_click"
  | "service_view"
  | "start_project"
  | "form_step"
  | "form_submit"
  | "whatsapp_click"
  | "email_click"
  | "case_study_complete"
  | "work_orbit_move";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Events that must fire at most once per page view.
 *
 * React Strict Mode invokes effects twice in development, and a scroll-driven
 * "completed the case study" event can otherwise fire every time the sentinel
 * re-enters the viewport. Both produce inflated counts that quietly corrupt
 * every downstream decision.
 */
const fired = new Set<string>();

export function resetOnceGuards() {
  fired.clear();
}

export function track(event: AurenEvent, params: Params = {}, once = false) {
  if (typeof window === "undefined") return;

  if (once) {
    const key = `${event}:${JSON.stringify(params)}`;
    if (fired.has(key)) return;
    fired.add(key);
  }

  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  );

  window.gtag?.("event", event, clean);
  window.dataLayer?.push({ event, ...clean });

  // Meta distinguishes its standard events from custom ones. Only the two
  // that map to a standard go through `track`; everything else is custom, so
  // the standard-event reports stay meaningful.
  if (window.fbq) {
    if (event === "start_project") window.fbq("track", "Lead", clean);
    else if (event === "form_submit") window.fbq("track", "CompleteRegistration", clean);
    else window.fbq("trackCustom", event, clean);
  }
}
