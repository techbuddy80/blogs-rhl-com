# Blog (Step 6)

## What's real now

Every sample array from Step 4 is replaced with real data from `allBlogs`
(the generated Content Collections export):

| Page                        | Was (Step 4)           | Now                                                                                                                                |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `/blog`                     | Hardcoded sample array | `getPublishedBlogs()` + real pagination (`?page=N`, 9/page)                                                                        |
| `/blog/[slug]`              | Stub                   | Full post: byline, tags, share buttons, prev/next, related articles, comments — plus `generateStaticParams` and `generateMetadata` |
| `/blog/category/[category]` | Stub                   | Real filter + pagination + `generateStaticParams` (only categories with actual posts)                                              |
| `/blog/tag/[tag]`           | Stub                   | Real filter + pagination + `generateStaticParams` (every tag in use)                                                               |

## New library: `lib/blog.ts`

| Function                                       | Purpose                                                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `getPublishedBlogs()`                          | Filters `draft`, sorts newest-first                                                                                                      |
| `paginate(items, page, pageSize)`              | Generic pagination, clamps out-of-range page numbers                                                                                     |
| `getRelatedArticles(post, all, limit)`         | Manual `relatedSlugs` frontmatter wins if present; otherwise scores by tag-overlap count + same-category bonus                           |
| `getAdjacentArticles(post, sortedNewestFirst)` | Chronological prev/next against the same sorted list the listing page uses, so "older/newer" matches what's actually adjacent in `/blog` |
| `getAllTags(posts)`                            | Deduplicated, sorted — feeds tag-archive `generateStaticParams`                                                                          |

## New components

`AuthorByline`, `ShareButtons` (X/LinkedIn/copy-link — copy uses the Clipboard API, share links are plain intent URLs, no client SDK needed), `RelatedArticles`, `PrevNextNav`, `GiscusComments`.

**Giscus** reads `NEXT_PUBLIC_GISCUS_*` from `.env` (scaffolded in Step 2). Since real values aren't set yet, it renders a clear configuration notice instead of an embedded widget pointed at nothing — better than a broken script tag or a silent no-op.

## Verified — with real data, not just one sample post

Step 4 and 5 only ever had one blog post (`hello-world`), which can't actually test related-articles or prev/next — both need at least two posts with real relationships. Added two more sample posts (`oracle-rac-interconnect-tuning`, `proxmox-homelab-notes`) sharing tags/categories specifically to exercise the scoring logic, then:

1. `npm run typecheck` / `build` / `lint` — all clean (one real bug fixed along the way, below).
2. **Build output confirms real static generation**: `generateStaticParams` produced 3 blog posts, 3 categories (`career`, `oracle`, `homelab`), and 5 tags as prerendered (`●` SSG) pages — not just compiling, actually generating the right set from real content.
3. **Ran the production server and checked the actual rendered output** for the middle-dated post (`oracle-rac-interconnect-tuning`):
   - Prev/next: correctly shows **older** → "Building a Proxmox Homelab..." (published earlier) and **newer** → "Hello, World..." (published later) — verifying the sort direction and adjacency math against real dates, not just that the function returns _something_.
   - Related articles: correctly shows **only** "Building a Proxmox Homelab..." (shares `rac` + `homelab` tags, score 2) and correctly **excludes** "Hello, World" (shares zero tags, score 0, filtered out) — confirming the scoring threshold works, not just that it returns a list.
   - `/blog/category/oracle` correctly shows only the one oracle-tagged post; `/blog/tag/homelab` correctly shows both homelab-tagged posts and excludes the unrelated one.

## Bug caught by building

`getAdjacentArticles` returned `sortedNewestFirst[index - 1]`, typed as `Blog | undefined` under `noUncheckedIndexedAccess` (enabled in `tsconfig.json` since Step 2) — but `PrevNextNav` declared its props as `AdjacentPost | null`. `undefined` don't satisfy `| null`, so this failed the real build (not just a lint nit — an actual type error) until each index access was coalesced with `?? null`.

## Deferred to later steps

- Full OpenGraph image generation / JSON-LD `BlogPosting` structured data — Step 10 (SEO)
- Real newsletter signup wiring — homepage work, not yet scheduled a step
- Giscus needs a real GitHub repo + discussion category configured in `.env` before comments actually work — infrastructure/deployment concern, not a code gap

## Next step

**Step 7: Knowledge Base** — real `generateStaticParams` across the fixed 3-level `category/topic/page` path, wiring the `KbSidebar` (currently sample data in `app/knowledge-base/layout.tsx`) to a real tree built from `allKnowledgeBases`, plus topic/category index pages listing their real child pages instead of the current stub text.
