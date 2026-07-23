# blogs.rhl.com — Architecture & Information Architecture (Step 1 of 14)

This is the foundation document for the whole build. Every later step (scaffold, design system, MDX, search, SEO, deployment) will be implemented against the decisions made here, so it's worth being deliberate now — changing the content model or routing structure later means touching every article you've written.

---

## 1. Goals, in priority order

1. **Longevity** — you'll be adding content for years. The structure has to survive scope creep (new content types, new taxonomies) without a rewrite.
2. **Zero CMS friction** — writing a post is "create an `.mdx` file, add frontmatter, commit." No admin UI, no database for content.
3. **Fast, accessible, SEO-clean** — Lighthouse 100s aren't a vanity metric here; they're a forcing function that keeps the stack honest (no bloated client JS, no layout shift, real semantic HTML).
4. **Single content model, multiple views** — Blog, Knowledge Base, Projects, and Architecture are visually and navigationally distinct, but underneath they should share one plumbing layer (frontmatter parsing, MDX rendering, TOC generation, search indexing), not four bespoke pipelines.
5. **Cheap to run at home** — no external SaaS dependencies beyond DNS/tunnel and (optionally) Giscus/comments, which are free and GitHub-backed.

---

## 2. Core architectural decision: one content engine, four "content types"

Rather than treating Blog / Knowledge Base / Projects / Architecture as four separate subsystems, they're modeled as **four content types sharing one schema-driven content layer**, each with its own frontmatter shape, its own route group, and its own card/index component — but one MDX compiler, one search indexer, one TOC extractor, and one tag/category system.

```
Content Type      Nature                          Nesting              Ordering
──────────────────────────────────────────────────────────────────────────────
Blog              Time-ordered narrative posts    Flat                 By date (newest first)
Knowledge Base     Evergreen reference docs        Deeply nested        By manual order / alphabetical
Projects          Portfolio case studies         Flat                 By status / date
Architecture       Reference diagrams + rationale  Flat-ish (by domain)  By category
```

This distinction matters because it drives real UX differences: a blog post has "previous/next" and "related articles"; a KB page has a persistent left-hand tree nav and breadcrumbs instead; a project page has a structured overview/architecture/lessons-learned template rather than free-form prose.

**Trade-off acknowledged:** a fully unified "everything is a Document" model (like a flat CMS) would be simpler to build initially, but it pushes all the type-specific logic into runtime conditionals scattered through components. Modeling the four types explicitly costs a bit more upfront schema work but keeps each route's component tree simple and type-safe.

---

## 3. Technology stack — rationale and trade-offs

| Choice                                                                                           | Why                                                                                                                                                                                             | Trade-off accepted                                                                                                                                     |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js App Router**                                                                           | Server Components by default → near-zero client JS for content pages; native support for streaming, `generateMetadata`, `generateStaticParams`, parallel routes for things like the TOC sidebar | More conceptual overhead (RSC vs client boundaries) than Pages Router, but it's the actively developed path and pays off in performance                |
| **Content Collections** (`@content-collections/core`) over raw `next-mdx-remote` or Contentlayer | Type-safe frontmatter validated with Zod at build time; Contentlayer is effectively unmaintained (archived), Content Collections is its actively-maintained spiritual successor                 | Slightly smaller ecosystem/docs than Contentlayer had at its peak — mitigated by it being a thin, well-scoped tool                                     |
| **Static rendering (SSG) as default, ISR only where useful**                                     | All content is Git-based and known at build time — there's no reason to hit the filesystem/DB per-request. Homelab hardware should be spent on serving static HTML, not re-rendering            | Rebuilds are required to publish; acceptable since publishing = `git push` → CI build anyway                                                           |
| **Local full-text search (no Algolia/Meilisearch server)**                                       | You explicitly ruled out external services; a prebuilt static search index (FlexSearch or Pagefind) generated at build time serves this at zero runtime cost                                    | Slightly less powerful than a hosted search-as-a-service (no typo-tolerance tuning UI, no analytics) — acceptable for a personal site's content volume |
| **Framer Motion**                                                                                | Used sparingly — page transitions, hover states, reveal-on-scroll — never for anything that gates content visibility (accessibility: respects `prefers-reduced-motion`)                         | Adds client JS bundle weight where used; scoped to specific interactive components only, not global                                                    |
| **shadcn/ui**                                                                                    | Copy-into-repo components (not an npm dependency) — you own and can modify every primitive, no black-box styling fights                                                                         | You're responsible for updating/patching components yourself over time (acceptable — that's the point of the model)                                    |
| **Giscus for comments**                                                                          | GitHub Discussions-backed, no database, matches the "everything is Git" philosophy                                                                                                              | Requires a GitHub login to comment — an intentional filter, not a bug, for a technical audience                                                        |

---

## 4. Information Architecture — full sitemap

```
/                                   Home
/blog                               Blog index (paginated, filterable by tag/category)
/blog/[slug]                        Blog post
/blog/tag/[tag]                     Tag archive
/blog/category/[category]           Category archive

/knowledge-base                     KB landing (category grid)
/knowledge-base/[category]          Topic list within category (e.g. /knowledge-base/oracle)
/knowledge-base/[category]/[topic]  Page list within topic (e.g. /knowledge-base/oracle/rac)
/knowledge-base/[category]/[topic]/[page]  Leaf KB article (e.g. /knowledge-base/oracle/rac/cache-fusion)

/projects                           Projects index (grid)
/projects/[slug]                    Project detail page

/architecture                       Architecture index (grouped by domain)
/architecture/[slug]                Architecture reference page (diagram-first)

/about                              About / resume / timeline
/contact                            Contact form + links

/search                             Full search results page (also available as a command-palette overlay)

/rss.xml, /sitemap.xml, /robots.txt Generated, not routed pages
```

### Why Knowledge Base is nested exactly three levels deep, and Blog isn't nested at all

KB content is hierarchical by nature, but unbounded nesting (`[...slug]`) makes breadcrumbs, sidebar-tree generation, and static param enumeration non-deterministic — the code has to handle "any depth" instead of "this depth." Capping it at **category → topic → page** (e.g. `oracle → rac → cache-fusion`) covers every example in your spec's Knowledge Base section without needing more than three levels, and keeps `generateStaticParams`, breadcrumbs, and the sidebar tree builder working against a fixed, known shape. A topic with no sub-pages yet just gets a single overview-style leaf page; a category with no topics yet is a stub grid.

Blog, Projects, and Architecture stay intentionally flat: a blog post's home is its date and tags, not a folder path — flattening those avoids the classic blog anti-pattern of URLs that break when you reorganize categories later.

### Navigation model

- **Top nav** (your 7 items + search + GitHub + LinkedIn + theme toggle) stays global and static across all routes.
- **Secondary nav** differs by section:
  - Blog → sort/filter bar (tag, category, date)
  - Knowledge Base → persistent left sidebar tree (like GitHub Docs / Stripe Docs), collapsible, generated from folder structure
  - Projects → grid with status/tech filter
  - Architecture → grouped-by-domain grid (Oracle, Kubernetes, Networking, etc.)
- **Right sidebar** (blog + KB + architecture only) → table of contents, auto-generated from MDX headings, scroll-spy highlighted.

---

## 5. Content model — frontmatter schemas

All schemas are enforced via Content Collections + Zod, so a malformed frontmatter field fails the build, not the deployed site.

### Shared base fields (all content types)

```ts
{
  title: string
  description: string          // used for meta description + card summary
  publishedAt: date
  updatedAt?: date
  draft?: boolean               // excluded from prod build when true
  category: string               // single primary category, drives taxonomy
  tags: string[]
}
```

### Blog — additive fields

```ts
{
  author: string                // default: you; supports future guest posts
  coverImage?: string
  readingTime: number            // auto-computed, not authored
  relatedSlugs?: string[]        // manual override; falls back to tag-overlap algorithm
}
```

### Knowledge Base — additive fields

```ts
{
  order?: number                 // manual sort within a topic
  topic: string                   // e.g. "rac", "storage" — level 2 of the fixed 3-level path
  // category (level 1) comes from the shared base `category` field
  // slug/filename (level 3) is the leaf page itself — no `parent` field needed,
  // since depth is fixed at category/topic/page rather than open-ended
}
```

### Projects — additive fields

```ts
{
  status: "active" | "completed" | "archived" | "planned"
  stack: string[]                 // rendered as Technology Badges
  repoUrl?: string
  demoUrl?: string
  architectureDiagram?: string     // path to mermaid/svg asset
  screenshots?: string[]
}
```

### Architecture — additive fields

```ts
{
  domain: string                   // "oracle" | "kubernetes" | "networking" | ...
  diagramType: "mermaid" | "image"
  relatedProjects?: string[]       // cross-link to /projects
  relatedKbArticles?: string[]     // cross-link to /knowledge-base
}
```

**Design note:** Projects and Architecture cross-link each other and the KB by slug reference rather than free-text links. This lets you later auto-generate "used in this project" / "see also" blocks without parsing MDX bodies for links — the relationships are structured data, which is what will let this site's cross-referencing actually get _better_ over the years instead of rotting into dead links.

---

## 6. Taxonomy strategy

Two axes, applied consistently across all four content types:

- **Category** (singular, required) — the primary shelf a piece of content lives on. Drives `/blog/category/[category]` archives and the KB's top-level grouping. A deliberately small, curated list — **12 categories**, merged down from the raw content-area list in the original spec, since two dozen near-duplicate categories (Oracle / Oracle Cloud / Oracle@AWS; AWS / OCI / Azure; Docker / Kubernetes) would make the nav a wall of links rather than a navigation aid. Defined in a single source-of-truth `lib/taxonomy.ts`, not invented ad hoc per post.
- **Tags** (plural, optional) — free-form, cross-cutting labels that carry the specifics a merged category loses (`rac`, `data-guard`, `terraform`, `cloudflare-tunnel`). Tags grow organically; categories don't.

This mirrors how Stripe Docs / GitHub Docs separate "which product area" (category) from "which concepts apply" (tags).

### Canonical category list

| Category                    | Absorbs (from original spec)                                                                  | Example tags                                              |
| --------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `oracle`                    | Oracle Database, RAC, Data Guard, Exadata, Oracle AI Database, Oracle Cloud, Oracle@AWS       | `rac`, `data-guard`, `exadata`, `zero-downtime-migration` |
| `postgresql`                | PostgreSQL, EDB, AlloyDB                                                                      | `alloydb`, `edb`, `replication`                           |
| `databases`                 | cross-engine architecture, performance tuning, HA/DR, backup & recovery, migration            | `disaster-recovery`, `high-availability`                  |
| `cloud`                     | AWS, OCI, Azure                                                                               | `aws`, `oci`, `azure`                                     |
| `infrastructure-networking` | Infrastructure, Networking, DNS, Reverse Proxy, Cloudflare, Virtualization, Storage, SAN, NAS | `cloudflare-tunnel`, `san`, `nas`, `vlans`                |
| `devops-automation`         | Terraform, Ansible, GitHub Actions, Jenkins, CI/CD, Automation, Python                        | `terraform`, `ansible`, `python`                          |
| `containers-kubernetes`     | Docker, Podman, Kubernetes, Helm, GitOps                                                      | `helm`, `gitops`                                          |
| `homelab`                   | Proxmox, LXC, VMs, TrueNAS, Monitoring, Grafana, Prometheus                                   | `proxmox`, `truenas`, `grafana`                           |
| `linux`                     | (unchanged)                                                                                   |                                                           |
| `security`                  | (unchanged)                                                                                   |                                                           |
| `ai`                        | Vector Search, LLMs, Ollama, MCP Servers, RAG, AI Automation                                  | `ollama`, `rag`, `mcp`                                    |
| `career`                    | professional growth, reflections, philosophy                                                  |                                                           |

**Note:** "Architecture" is deliberately _not_ a category, even though it appeared in the original list — `/architecture` is already a dedicated content type in this IA, and reusing the label as a category would make "Architecture" mean two different things in the UI. Architecture-flavored blog or KB content just takes its domain category (e.g. `oracle`, `containers-kubernetes`) plus the tag `architecture`.

---

## 7. Folder structure (content + code)

```
app/
  (marketing)/
    page.tsx                      → Home
    about/page.tsx
    contact/page.tsx
  blog/
    page.tsx                      → index
    [slug]/page.tsx
    tag/[tag]/page.tsx
    category/[category]/page.tsx
  knowledge-base/
    page.tsx
    [category]/page.tsx
    [category]/[topic]/page.tsx
    [category]/[topic]/[page]/page.tsx
  projects/
    page.tsx
    [slug]/page.tsx
  architecture/
    page.tsx
    [slug]/page.tsx
  search/page.tsx
  sitemap.ts
  robots.ts
  rss.xml/route.ts

components/
  layout/         (Navbar, Footer, ThemeToggle, Breadcrumb)
  content/        (ArticleCard, ProjectCard, CategoryCard, Tag, TOC, CodeBlock, Callout, ImageGallery)
  home/           (Hero, FeaturedProjects, TechStack, Timeline, Newsletter)
  ui/             (shadcn primitives)

content/
  blog/*.mdx
  knowledge-base/<category>/<topic>/*.mdx   (fixed 3 levels — category/topic/page.mdx)
  projects/*.mdx
  architecture/*.mdx

lib/
  taxonomy.ts       (canonical category list)
  content-config.ts (Content Collections schema defs)
  search-index.ts
  mdx-components.tsx
  utils.ts

hooks/
styles/
public/
scripts/            (index generation, RSS build helpers)
types/
data/               (structured JSON: skills, certifications, timeline, tech stack)
```

---

## 8. Rendering & data-flow strategy

1. **Build time:** Content Collections reads `content/**/*.mdx`, validates frontmatter against Zod schemas, compiles MDX to a serializable format.
2. **Static generation:** `generateStaticParams` enumerates every slug per content type → fully static HTML for every article/project/KB page/architecture page at build time.
3. **Search index:** a build script (`scripts/build-search-index.ts`) walks the compiled content collections and emits a static JSON index consumed client-side by the search UI (Pagefind or FlexSearch) — no server round-trip per keystroke.
4. **Incremental content:** because everything is static, "publishing" is: write MDX → commit → GitHub Actions builds → homelab deploy restarts the Next.js process (or swaps the static export) behind the Cloudflare Tunnel. No runtime database, no cache invalidation logic needed.
5. **Where dynamism is genuinely needed** (contact form submission, newsletter signup) — these become the only two features requiring a server action / API route, kept deliberately minimal and isolated from the content pipeline.

---

## 9. What this unlocks for later steps

Because the content model, taxonomy, and routing are locked in now:

- **Step 3 (design system)** can build `ArticleCard`, `ProjectCard`, `CategoryCard` against known, typed frontmatter shapes instead of guessing.
- **Step 9 (search)** just indexes whatever Content Collections already validated — no separate content-discovery logic.
- **Step 10 (SEO/structured data)** can generate JSON-LD per content type mechanically (BlogPosting for blog, TechArticle for KB, CreativeWork for projects) because the type is known at the schema level, not inferred.
- **Adding a 5th content type** later (say, "Talks" or "Now" page) means adding one more schema + route group, not restructuring the existing four.

---

## Next step

**Step 2: Project scaffold** — initialize the Next.js App Router project with TypeScript, Tailwind, shadcn/ui, ESLint/Prettier, Content Collections, and the folder skeleton above, so Step 3 (design system) has a real codebase to build components into.

Let me know if you want to adjust anything here first — especially the taxonomy list or the KB nesting depth — since those are the two decisions most expensive to change once content exists.
