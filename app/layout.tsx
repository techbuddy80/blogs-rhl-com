import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "katex/dist/katex.min.css";
import "@/styles/globals.css";

// Display face — headings only, used with restraint (see docs/03-design-system.md)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body face — optimized for long-form technical reading density
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Code + UI metadata (dates, reading time, tags) — the terminal/SQL thread
// running through the whole interface, not just code blocks.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blogs.rhl.com"),
  title: {
    default: "Senior Database Architect • Cloud Engineer • Infrastructure Enthusiast",
    template: "%s | blogs.rhl.com",
  },
  description:
    "Engineering portfolio, technical blog, and knowledge base covering Oracle, PostgreSQL, cloud infrastructure, Kubernetes, automation, and homelab engineering.",
  openGraph: {
    type: "website",
    siteName: "blogs.rhl.com",
    url: "https://blogs.rhl.com",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
