import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/lib/blog";

import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const BASE_URL = SITE_URL;

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Real feed generated from every published blog post, replacing the Step 2
// placeholder channel-only stub.
export async function GET() {
  const posts = getPublishedBlogs();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Engineering portfolio, technical blog, and knowledge base covering Oracle, PostgreSQL, cloud infrastructure, and homelab engineering.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
