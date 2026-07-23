# MDX Content Support (Step 5)

## Pipeline

One shared MDX pipeline for all four content types, configured once in
`content-collections.ts`:

| Concern                                   | Plugin                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| Tables, strikethrough, autolinks          | `remark-gfm`                                                           |
| Math (`$...$`, `$$...$$`)                 | `remark-math` + `rehype-katex`                                         |
| Heading ids (for TOC anchors)             | `rehype-slug`                                                          |
| Syntax highlighting, line numbers, titles | `rehype-pretty-code` (Shiki, dual `github-dark`/`github-light` themes) |

## Components

| Component         | Path                                     | Role                                                                                                                       |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Mdx`             | `components/content/mdx-content.tsx`     | Thin `"use client"` wrapper around `@content-collections/mdx/react`'s `MDXContent`, supplying the shared components map.   |
| `mdxComponents`   | `components/content/mdx-components.tsx`  | Maps `figure`/`pre`/`img`/`table`/`blockquote` overrides + custom `Callout`/`CodeGroup` tags.                              |
| `CodeBlockPre`    | `components/content/code-block.tsx`      | Copy button — reads `textContent` from the DOM at click time, robust regardless of highlighting spans.                     |
| `MermaidDiagram`  | `components/content/mermaid-diagram.tsx` | Progressive enhancement: raw mermaid source stays visible until client JS renders the SVG via dynamic `import("mermaid")`. |
| `Callout`         | `components/content/callout.tsx`         | `<Callout type="note\|tip\|warning\|danger">`                                                                              |
| `CodeGroup`       | `components/content/code-group.tsx`      | Tabs over multiple titled code fences (`title="npm"` meta)                                                                 |
| `extractHeadings` | `lib/mdx-headings.ts`                    | Regex-based H2/H3 extraction + `github-slugger`, feeding `TableOfContents`                                                 |

## Key implementation finding: `rehype-pretty-code` retags `pre` → `figure`

Rather than guess at the plugin's output shape, I read `node_modules/rehype-pretty-code/dist/index.js` directly. It confirms: a fenced code block's outer `pre` element is **retagged to `figure`** (with `data-rehype-pretty-code-figure`), with the real `pre`/`code` nested inside, and an optional sibling `figcaption` (marked `data-rehype-pretty-code-title`) for the `title="..."` fence meta. This is why `mdxComponents` overrides **both** `figure` (container styling) and `pre` (copy button + Mermaid interception) — overriding only `pre` would miss the outer wrapper entirely, and overriding only `figure` would miss ordinary code blocks with no title.

Line numbers use the same pattern documented for real-world rehype-pretty-code setups: no JS, just CSS counters keyed off the `data-line-numbers`/`data-line` attributes the plugin already emits (see `styles/globals.css`).

## Verified — including actual runtime rendering, not just types

1. **`npm run typecheck` / `build` / `lint`** — all clean.
2. **Enriched the sample KB article** (`content/knowledge-base/oracle/rac/cache-fusion.mdx`) to exercise every feature at once: a `Callout`, a titled+line-numbered SQL fence, a `CodeGroup` (npm/yarn tabs), a Mermaid diagram, a GFM table, and inline math.
3. **Actually ran the production server and `curl`'d the real page** (`/knowledge-base/oracle/rac/cache-fusion`) rather than trusting the build log:
   - Confirmed `data-language="bash"`, `data-language="sql"`, `data-language="mermaid"` all present on the real HTML
   - Confirmed KaTeX rendered full MathML + HTML spans for `$L = \frac{N}{B}$`
   - Confirmed heading ids in the rendered HTML: `how-it-works`, `global-cache-service`, `installing-the-interconnect-test-tool`, `two-node-cluster-topology`, `wait-event-thresholds`
4. **Verified TOC/heading-id parity directly**: ran `extractHeadings`'s `github-slugger` against the same heading text server-side and confirmed it produces **identical slugs** to what `rehype-slug` actually assigned in the HTML above — meaning `TableOfContents` links will genuinely scroll to the right anchor, not just compile.
5. Wired real rendering into `app/blog/[slug]/page.tsx` and the KB article page (fetching from `allBlogs`/`allKnowledgeBases`, exported by the generated `content-collections` module) — these were previously stubs; now they render actual compiled MDX with a live TOC. Full listing pages, `generateStaticParams`, related articles, prev/next, and Giscus comments are still Step 6/7 work.

## Bugs caught by building, with a genuinely non-obvious one

1. **TS error indexing `data-language` off an untyped props object** in the `pre` override — fixed with `React.isValidElement<Record<string, unknown>>(...)`.
2. **content-collections' return-type serialization check failed for all four collections** the moment `headings` was added to the transform output — with no obvious reason from the error message alone. Isolated by removing fields one at a time until it was confirmed to be the `headings` array specifically, then traced to: **TypeScript's structural check against content-collections' `Record<string, SchemaType>` constraint doesn't unwrap an `interface` the same way it unwraps a `type` alias** in that generic conditional-type context. `TocHeading` was declared as an `interface`; switching it to a `type` alias fixed the error immediately, with no other change. Documented here since it's the kind of thing that would otherwise cost real time again the next time a new field gets added to a transform.

## Next step

**Step 6: Blog** — real `generateStaticParams`, listing/pagination against actual data instead of the sample array in `app/blog/page.tsx`, author byline, related articles (tag-overlap fallback + manual override), previous/next navigation, share buttons, and Giscus comments wired up using the `.env.example` variables already scaffolded in Step 2.
