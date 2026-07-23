# Layouts & Navigation (Step 4)

## Components built

| Component          | Path                                        | Notes                                                                                                                                                  |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Navbar`           | `components/layout/navbar.tsx`              | Global top nav, sticky + backdrop-blur. Client component (needs `usePathname` for active-link state and mobile-menu toggle state).                     |
| `Footer`           | `components/layout/footer.tsx`              | Explore / Connect columns + copyright. Server component.                                                                                               |
| `ThemeToggle`      | `components/layout/theme-toggle.tsx`        | Wraps `next-themes`; guards against hydration mismatch with a `mounted` check.                                                                         |
| `Breadcrumb`       | `components/layout/breadcrumb.tsx`          | Generic `{label, href?}[]` — used on every KB/blog/project/architecture detail and archive page.                                                       |
| `TableOfContents`  | `components/layout/toc.tsx`                 | Scroll-spy via `IntersectionObserver`. Takes a `headings` array — real extraction from compiled MDX lands in Step 5.                                   |
| `Pagination`       | `components/layout/pagination.tsx`          | Query-param based (`?page=N`), plain links — no client state.                                                                                          |
| `KbSidebar`        | `components/content/kb-sidebar.tsx`         | Collapsible category → topic → page tree, built with native `<details>/<summary>` — **zero client JS** for expand/collapse.                            |
| `BlogFilterBar`    | `components/content/blog-filter-bar.tsx`    | Category pills as plain links to `/blog/category/[slug]` — filtering is real navigation, not client state, so filtered views stay shareable/indexable. |
| `ProjectFilterBar` | `components/content/project-filter-bar.tsx` | Same pattern, by status; reused by both Projects and Architecture.                                                                                     |

## Real layout wiring, not just components sitting unused

- `app/layout.tsx` — `Navbar` and `Footer` now wrap every route.
- `app/knowledge-base/layout.tsx` — a genuine Next.js nested layout applying a persistent `KbSidebar` to every route under `/knowledge-base` (index, category, topic, and leaf article), via a `[240px_1fr]` grid. Sample tree data stands in until Step 7 wires a real Content Collections query.
- Every blog/KB/project/architecture stub page (index, archive, and detail) now renders a real `Breadcrumb`, and the blog/projects/architecture index pages render their filter bar and (for blog) `Pagination` against sample data.

## Design decisions worth flagging

- **KB sidebar uses `<details>/<summary>`, not a client accordion.** This sidebar renders on every KB page, so shipping it as a zero-JS progressive-enhancement pattern (rather than a `useState`-driven accordion) avoids client bundle weight on the site's most-used navigation surface. The category matching the current URL is expanded server-side via the `open` attribute — no JS needed for the common case.
- **Filter bars are links, not client state.** `?category=oracle` and `?status=active` are real URLs. This means a filtered blog category view is independently bookmarkable, shareable, and crawlable — a meaningfully different (and better) outcome than a client-side filter that resets on reload, at zero extra engineering cost.
- **Navbar is a client component** (the one deliberate exception to "avoid client JS") — active-link highlighting via `usePathname` and the mobile menu disclosure both need it. The bundle cost is small and it's the one piece of chrome present on literally every page, so it's a reasonable place to spend the budget.

## Bugs caught by actually building

1. **Nested `<a>` tags via `asChild`.** The first draft of `Navbar` used `<Button asChild><Link>...</Link></Button>`, but the `Button` component from Step 3 doesn't implement Radix's `Slot` pattern — it would have rendered a literal `<button>` wrapping an `<a>`, invalid nested-interactive-element markup that browsers silently mangle. Fixed by applying `buttonVariants()` classes directly to the `Link`/`<a>` elements instead of wrapping them.
2. **Unescaped apostrophe.** `what's next` in `app/projects/page.tsx` failed `next/core-web-vitals`'s `react/no-unescaped-entities` rule during the real `next build` lint pass — a good example of why building beats eyeballing JSX. Fixed with `&rsquo;`.

## Verified

- `npm run typecheck` — clean.
- `npm run build` — clean, all 14 routes compiling (font fetch again stripped temporarily for this sandbox's network allowlist, then restored — same caveat as Steps 2–3, no code issue).
- Confirmed the KB nested layout actually applies (sidebar renders around all four KB route levels) and that filter-bar/breadcrumb wiring compiles against real route params.

## Next step

**Step 5: MDX content support** — syntax highlighting with copy buttons and line numbers, callouts, Mermaid diagram rendering, math, code groups, and the real heading-extraction pass that will finally give `TableOfContents` live data instead of an empty array.
