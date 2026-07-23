import { ImageResponse } from "next/og";
import { getPublishedBlogs } from "@/lib/blog";
import { getCategory } from "@/lib/taxonomy";
import { SITE_NAME } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getPublishedBlogs().map((post) => ({ slug: post.slug }));
}

// Per-post OG image, generated at build time from real frontmatter — the
// title and category badge are what actually get shared on social/Slack
// previews, not a generic site logo.
export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPublishedBlogs().find((p) => p.slug === params.slug);
  const categoryLabel = post ? (getCategory(post.category)?.label ?? post.category) : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#0A0E13",
        color: "#EAF0F6",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            padding: "6px 16px",
            borderRadius: 8,
            border: "1px solid rgba(232,163,61,0.4)",
            backgroundColor: "rgba(232,163,61,0.1)",
            color: "#E8A33D",
            fontSize: 24,
          }}
        >
          {categoryLabel}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 56, fontWeight: 600, lineHeight: 1.2 }}>
        {post?.title ?? SITE_NAME}
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#9AA7B4" }}>{SITE_NAME}</div>
    </div>,
    { ...size }
  );
}
