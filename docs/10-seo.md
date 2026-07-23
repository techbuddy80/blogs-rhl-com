# SEO, RSS, Sitemap, Structured Data (Step 10)

## What's real now

| File                                          | Was (Step 2)                | Now                                                                                                                                                                                                     |
| --------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/sitemap.ts`                              | 7 hardcoded static URLs     | Real enumeration: every blog post, category, tag, KB category/topic/article, project, and architecture reference — **30 URLs** in the current sample content, growing automatically as content is added |
| `app/rss.xml/route.ts`                        | Empty `<channel>`, no items | Real feed from every published blog post, proper XML-escaping, `force-static`                                                                                                                           |
| `app/robots.ts`                               | Allow-all                   | Added `disallow: /search` (query-param results have no independent SEO value)                                                                                                                           |
| Every detail page's `generateMetadata`        | Title/description only      | + `alternates.canonical`, `openGraph`, `twitter`                                                                                                                                                        |
| Every detail page                             | No structured data          | JSON-LD via a shared `<JsonLd>` component                                                                                                                                                               |
| _(new)_ `app/opengraph-image.tsx`             | Didn't exist                | Site-wide default OG image, generated at build time (Satori/`next/og`), no external asset needed                                                                                                        |
| _(new)_ `app/blog/[slug]/opengraph-image.tsx` | Didn't exist                | Per-post OG image showing the real title + category badge                                                                                                                                               |

## JSON-LD schema mapping

| Content type   | Schema         | Why                                                                                                                                         |
| -------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Blog           | `BlogPosting`  | Standard for dated editorial content; includes `author`, `datePublished`/`dateModified`, `keywords`                                         |
| Knowledge Base | `TechArticle`  | Evergreen technical reference, not date-driven editorial content                                                                            |
| Architecture   | `TechArticle`  | Same reasoning as KB — reference documentation, not a portfolio artifact                                                                    |
| Projects       | `CreativeWork` | A built artifact/portfolio piece, not an article — `keywords` combines both `tags` and `stack` so the tech stack is searchable metadata too |

Built in `lib/structured-data.ts`, rendered via `components/seo/json-ld.tsx` (a bare `<script type="application/ld+json">`, since Next's Metadata API has no first-class slot for structured data).

## Verified — including things `curl` genuinely can't check by itself

`npm run typecheck` / `build` / `lint` all clean. Beyond that, ran the actual production server and inspected real output rather than trusting the build succeeded silently:

1. **`sitemap.xml`**: confirmed **30 `<loc>` entries**, all real (not the old 7 hardcoded ones) — spanning blog, KB (category + topic + article levels), projects, and architecture.
2. **`rss.xml`**: confirmed exactly 3 `<item>` entries with correct titles, matching the 3 real published posts — including that the em dash in "Hello, World — Why This Site Exists" survived XML escaping correctly (the escaper only touches `&<>"'`, not Unicode).
3. **JSON-LD**: fetched a real page from each of the four content types and grep'd the actual rendered `<script>` payload — confirmed correct `@type`, real dates, real author/publisher, and (for projects) `keywords` correctly combining tags + stack.
4. **Canonical URLs**: confirmed `<link rel="canonical" href="https://blogs.rhl.com/blog/hello-world"/>` renders correctly.
5. **OG images**: fetched `/blog/hello-world/opengraph-image` and ran `file` on the response — confirmed a genuine **1200×630 PNG**, not just "the route didn't 404."

## Trade-off documented

OG images use system fonts rather than fetching a custom webfont at build time — fetching Google Fonts during image generation would add a network dependency to the build (and this sandbox specifically can't reach `fonts.googleapis.com`, though your machine will be able to). If a branded OG image face matters later, `next/og`'s `ImageResponse` accepts a font buffer directly; that's a small, isolated addition whenever it's worth the build-time fetch.

## Next step

**Step 11: GitHub Actions & deployment prep** — README, LICENSE, `.gitignore` refinement, issue/PR templates, CONTRIBUTING guide, and CI workflows for linting/type-checking/build validation on every push — setting up the repository side of things before Step 12's actual Cloudflare Tunnel homelab deployment.
