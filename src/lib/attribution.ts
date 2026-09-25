"use client";

import type { BriefInput } from "./brief-schema";

const KEY = "auren.attribution";

type Attribution = NonNullable<BriefInput["attribution"]>;

/**
 * Capture attribution on first arrival and keep it.
 *
 * Read at submit time rather than at first paint, and stored so the original
 * touch survives the visitor wandering through three pages before enquiring.
 * Reconstructing this afterwards from a referrer header is guesswork, and
 * guesswork is what makes channel reporting an opinion.
 *
 * sessionStorage can throw outright in private mode, so every access is
 * guarded and the form still submits without it.
 */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;

    const p = new URLSearchParams(window.location.search);
    const data: Attribution = {
      utm_source: p.get("utm_source") ?? undefined,
      utm_medium: p.get("utm_medium") ?? undefined,
      utm_campaign: p.get("utm_campaign") ?? undefined,
      utm_content: p.get("utm_content") ?? undefined,
      utm_term: p.get("utm_term") ?? undefined,
      landingPage: window.location.href.slice(0, 2000),
      referrer: document.referrer ? document.referrer.slice(0, 2000) : undefined,
      firstSeen: new Date().toISOString(),
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable. The enquiry matters more than the attribution.
  }
}

export function readAttribution(): Attribution | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}
