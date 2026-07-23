# Search (Step 9)

## Architecture decision: static JSON route, not a separate build script

Step 1's architecture doc sketched a separate `scripts/build-search-index.ts` build step. In practice, since search index generation just needs read access to the same Content Collections data every page already imports, a Next.js Route Handler (`app/search-index.json/route.ts`) does the same job with no separate tooling, no path-resolution workarounds for running a standalone script outside the Next build graph, and reuses the exact pattern already established by `app/rss.xml/route.ts`. Marked `export const dynamic = "force-static"` so it's generated once at build time and served as a cached static file — confirmed in the build output, which initially showed it as `ƒ` (dynamic) until that line was added, after which it correctly showed `○` (static).

**No external service** — per the original brief. The index is a flat JSON array of `{id, type, title, description, url, category, tags}` across all four content types, fetched once client-side and indexed in-browser with FlexSearch (`lib/use-search.ts`), module-scoped so repeated searches/dialog-opens reuse the same in-memory index rather than re-fetching or rebuilding it.

## A real type-system finding: FlexSearch's `DocumentData` genuinely requires an index signature

`Document<SearchDocument>` failed with `Type 'SearchDocument' does not satisfy the constraint 'DocumentData'` — checked FlexSearch's own type definitions rather than guessing at a workaround, and confirmed `DocumentData = { [key: string]: DocumentValue | DocumentValue[] }` is a real structural requirement, not a quirk to route around. Added an explicit index signature to `SearchDocument` with a comment explaining why it's there, rather than reaching for `as any`.

## Components

| Component                              | Role                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SearchDialog`                         | Command-palette overlay, `⌘K`/`Ctrl+K` global shortcut, replaces the plain `/search` link in the Navbar                                                                                                                                                                                                                |
| `SearchResultsList`                    | Shared between the dialog and the full page — grouped by type badge                                                                                                                                                                                                                                                    |
| `SearchPageContent` (+ `/search` page) | Full results page, keeps `?q=` in the URL via `router.replace` so results stay shareable/bookmarkable — the one place genuine client state was unavoidable (live-as-you-type), but the resulting URL is still a real, shareable one, consistent with the "filters are links" pattern from the blog/project filter bars |

## Verified — including the one thing `curl` can't check

`npm run typecheck` / `build` / `lint` all clean, and `/search-index.json` was fetched and confirmed to contain all 10 published documents across all four content types with correct `type`/`url` fields.

But the actual search _matching_ behavior only happens inside FlexSearch's in-browser index — not observable via `curl`. So the exact same API calls `lib/use-search.ts` makes (`new Document({...})`, `.add()`, `.search(query, {enrich: true, merge: true, limit})`) were run directly in a Node script against the real generated index JSON:

- `"cache fusion"` → both the KB article and the blog post mentioning it, correctly
- `"rac"` → all six RAC-related documents across every content type (blog, KB, project, architecture)
- `"vacuum"` / `"cloudflare"` → exactly the one relevant document each, no false positives
- A nonsense query → correctly empty

This confirms the multi-field indexing, cross-type merging, and deduplication all work as intended before ever touching a browser.

## Next step

**Step 10: SEO, RSS, sitemap, and structured data** — replacing the placeholder `sitemap.ts`/`robots.ts`/`rss.xml` stubs from Step 2 with real enumeration of every published slug across all four content types, adding OpenGraph images and JSON-LD (`BlogPosting`, `TechArticle`, `CreativeWork`) per content type, and dynamic per-page metadata anywhere it's still missing.
