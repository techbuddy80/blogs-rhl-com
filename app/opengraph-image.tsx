import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default site-wide OG image — generated at build time via Satori (no
// external image asset needed). Per-post dynamic images override this at
// app/blog/[slug]/opengraph-image.tsx.
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#0A0E13",
        color: "#EAF0F6",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", width: 64, height: 6, backgroundColor: "#E8A33D" }}
      />
      <div style={{ display: "flex", fontSize: 64, fontWeight: 600, marginTop: 40 }}>
        blogs.rhl.com
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#9AA7B4", marginTop: 20 }}>
        Senior Database Architect · Cloud Engineer · Infrastructure Enthusiast
      </div>
    </div>,
    { ...size }
  );
}
