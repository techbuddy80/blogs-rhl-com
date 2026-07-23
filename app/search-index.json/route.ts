import { NextResponse } from "next/server";
import { buildSearchDocuments } from "@/lib/search-index";

// Content is static until the next rebuild — force static generation so
// this is served as a cached file, not recomputed per request.
export const dynamic = "force-static";

// Static JSON, generated from whatever content is published at build time.
// Fetched once client-side (see lib/use-search.ts) and indexed in-browser
// with FlexSearch — no external search service, per the original brief.
export async function GET() {
  return NextResponse.json(buildSearchDocuments());
}
