# Projects & Architecture (Step 8)

## What's real now

| Page                   | Was                                                                                | Now                                                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/projects`            | Sample array, status filter bar present but unwired                                | Real data via `getPublishedProjects()`, `?status=` filter actually applied                                                                                                    |
| `/projects/[slug]`     | Breadcrumb stub                                                                    | Full template: status, tech badges, repo/demo links, optional architecture-diagram image, screenshot gallery, MDX body, tags — plus `generateStaticParams`/`generateMetadata` |
| `/architecture`        | **Wrong filter entirely** — Step 4 reused the status-based `ProjectFilterBar` here | Replaced with a real `DomainFilterBar` grouped by the `domain` field Architecture docs actually have                                                                          |
| `/architecture/[slug]` | Breadcrumb stub                                                                    | Full render: MDX body (Mermaid diagrams render inline, per Step 5), resolved **related projects** and **related KB articles** from frontmatter slug references                |

## A real content-model bug, not just a wiring gap

Step 4 wired `ProjectFilterBar` (filtering by `active`/`completed`/`archived`/`planned`) onto **both** `/projects` and `/architecture`, because both needed "some filter bar" at the time and the component existed. But the Architecture schema (Step 2) has no `status` field at all — it has `domain`. That stub would have shipped a filter bar that always showed all four status pills, all of which filtered against a field that doesn't exist on any Architecture doc, silently doing nothing. Fixed by building `DomainFilterBar` and wiring it to the real `domain` field instead. This is the kind of mismatch that's easy to miss when a component "looks like it fits" structurally (both are card grids that want a filter bar) but the underlying data models are actually different.

## New libraries

- **`lib/projects.ts`** — `getPublishedProjects()`, `filterProjectsByStatus()`
- **`lib/architecture.ts`** — `getPublishedArchitecture()`, `getArchitectureDomains()`, `filterArchitectureByDomain()`, and `resolveRelatedProjects()`/`resolveRelatedKbArticles()`, which turn the `relatedProjects`/`relatedKbArticles` slug arrays (Step 1's frontmatter design, unused until now) into real title+href pairs — a stale slug reference degrades to "not shown" rather than a dead link with a raw slug as the label

## New components

`DomainFilterBar` (replaces the misapplied `ProjectFilterBar` on Architecture), `ImageGallery` (plain `<img>`, same documented trade-off as MDX images in Step 5 — no known dimensions at build time for content-authored screenshot paths).

## Editorial convention worth documenting

"Overview," "Lessons Learned," and "Future Improvements" (named in the original brief as project-page sections) are **not** separate frontmatter fields — they're just `##` headings the author writes in the MDX body, same as any other article. Modeling them as structured fields would mean a rigid schema fighting against what's fundamentally free-form writing; the fixed frontmatter fields (`status`, `stack`, `repoUrl`, `demoUrl`, `architectureDiagram`, `screenshots`) are reserved for things that actually drive UI (badges, links, galleries), not prose structure.

## Verified against real, cross-linked content

Added a second project (different status — `completed` vs. `active`) and a second architecture reference (different domain — `kubernetes` vs. `oracle`), and populated `relatedProjects`/`relatedKbArticles` on the Oracle RAC architecture doc pointing at real project and KB slugs from Steps 6–7. Then, against the live production server:

1. `/projects?status=completed` correctly shows **only** the completed project, excluding the active one — confirming the filter (unlike Architecture's before this step) actually filters.
2. `/projects/oracle-rac-lab` correctly renders the repo link, `Proxmox` tech badge, `active` status dot, and the "Lessons learned" MDX heading.
3. `/architecture?domain=kubernetes` correctly groups by the real `domain` field — verified the count badge (`kubernetes (1)`) renders correctly despite React splitting the number and label across comment-boundary text nodes (same rendering detail first noticed in Step 7).
4. `/architecture/oracle-rac-reference` correctly resolves and links **both** its related KB articles (Cache Fusion, Interconnect Requirements) and its related project (Oracle RAC Lab) by slug — proving the frontmatter cross-reference fields designed back in Step 1 actually work end-to-end, four steps later.

`npm run typecheck` / `build` / `lint` all clean.

## Next step

**Step 9: Search** — a build-time static search index (no external service, per the brief) covering all four content types, with a command-palette-style overlay and the dedicated `/search` results page that's been an empty stub since Step 2.
