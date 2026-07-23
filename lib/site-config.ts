/**
 * Single source of truth for the site's public URL and derived name.
 *
 * Every other file that needs the domain (sitemap, RSS, robots, structured
 * data, OpenGraph images, metadata, the footer/navbar wordmark) imports
 * from here instead of hardcoding a URL string. This exists specifically
 * because it *didn't* exist through Steps 1–12 — the domain was hardcoded
 * as a literal string in 15 different files, which is exactly why
 * correcting a wrong domain after deployment meant a 15-file find/replace
 * instead of a one-line env change. See docs/12b-domain-correction.md.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://blogs.ramhl.com";

// Derived, not hardcoded separately — "blogs.ramhl.com" from
// "https://blogs.ramhl.com", so the two can never drift apart again.
export const SITE_NAME = new URL(SITE_URL).host;
