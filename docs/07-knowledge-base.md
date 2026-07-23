# Knowledge Base (Step 7)

## What's real now

| Page                                        | Was (Step 4)                             | Now                                                                                                        |
| ------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `app/knowledge-base/layout.tsx`             | One hardcoded sample category/topic/page | `buildKbTree()` from real `allKnowledgeBases` content                                                      |
| `/knowledge-base`                           | Stub                                     | Real category grid via `getKbCategoriesWithContent()`, showing only categories with actual published pages |
| `/knowledge-base/[category]`                | Breadcrumb only                          | Real topic list with article counts + `generateStaticParams`                                               |
| `/knowledge-base/[category]/[topic]`        | Didn't exist as real page                | Real page list + `generateStaticParams` (category × topic pairs)                                           |
| `/knowledge-base/[category]/[topic]/[page]` | Rendered one hardcoded match             | `generateStaticParams` across every real KB doc + `generateMetadata`                                       |

## New library: `lib/knowledge-base.ts`

`parseKbSlug` splits a doc's `_meta`-derived `slug` (e.g. `"oracle/rac/cache-fusion"`) into `{category, topic, page}` — the one place that fixed-3-level assumption from Step 1 actually gets exercised. `buildKbTree()`, `getKbCategoriesWithContent()`, `getKbTopicsForCategory()`, and `getKbPagesForTopic()` all build on top of it.

`formatSlugLabel()` title-cases a topic slug for display, with a small acronym dictionary (`RAC`, `AWS`, `OCI`, `DNS`, `SAN`, `NAS`, etc.) so `"rac"` renders as `RAC`, not `Rac` — worth the lookup table given how acronym-dense this content domain genuinely is.

## A real bug found by thinking through the layout model, not just building

`app/knowledge-base/layout.tsx` sits at `/knowledge-base` — a route segment with **no dynamic parameter of its own**. Next.js only threads a route's _own_ matched dynamic segments into that route's `params`; a layout above `[category]/[topic]/[page]` never receives those deeper params, no matter how deep the page below it goes. Step 4's `KbSidebar` took `currentCategory`/`currentTopic`/`currentPage` as **props from the layout** — which would have compiled fine and looked correct in the one-sample-page state Step 4 shipped with, but would have silently rendered the _same_ (wrong, likely empty) active-state highlighting on every KB page in production, since the layout genuinely cannot know what page is being viewed below it.

Fixed by converting `KbSidebar` to a client component that derives the active category/topic/page directly from `usePathname()` — the actual source of truth for "what page is this," rather than a prop chain that structurally can't carry that information. This is the kind of bug that `tsc`/`next build` would never catch (the old code type-checked and built fine); it only surfaces by reasoning about Next's layout/params model, or by clicking through a real multi-page KB tree — which is why Step 4's single-sample-page KB never exposed it.

## Verified with real, multi-category content

Step 4–6's KB only ever had one sample doc — insufficient to test tree grouping, category-with-content filtering, or per-topic counts. Added two more (`oracle/rac/interconnect-requirements`, `postgresql/performance/vacuum-tuning`) specifically to span a second category and a second topic within the first, then:

1. `npm run typecheck` / `build` / `lint` — all clean.
2. **Build output**: `generateStaticParams` correctly produced 2 categories (`oracle`, `postgresql`), 2 topics (`rac`, `performance`), and all 3 leaf pages as real SSG output.
3. **Ran the production server and inspected actual HTML**:
   - `/knowledge-base` shows both category cards
   - `/knowledge-base/oracle` shows the `RAC` topic card with the correct count — `2 articles` (confirmed by inspecting the exact DOM text nodes, since React splits `{count} {label}` across comment-boundary text nodes that a naive substring search misses)
   - The sidebar on a leaf page (`/knowledge-base/oracle/rac/cache-fusion`) correctly lists **both** RAC pages and the PostgreSQL category/topic — confirming the real tree spans categories, not just the one sample category Step 4 had

## Next step

**Step 8: Projects & Architecture** — full templates (overview, architecture diagram, screenshots, technologies used, lessons learned, GitHub repo link, status, future improvements for Projects; domain-grouped Mermaid reference diagrams + rationale for Architecture), replacing the remaining sample data and stub pages in both sections.
