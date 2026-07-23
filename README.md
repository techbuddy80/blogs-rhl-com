# blogs.ramhl.com

[![CI](https://github.com/techbuddy80/blogs-rhl-com/actions/workflows/ci.yml/badge.svg)](https://github.com/techbuddy80/blogs-rhl-com/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Personal engineering portfolio, technical blog, knowledge base, and project
showcase — built with Next.js App Router, TypeScript, Tailwind, shadcn/ui,
and MDX via Content Collections. No CMS: every article is a Git-tracked
`.mdx` file.

## Status

Built incrementally, one step at a time — each step's design decisions,
verification steps, and any bugs caught along the way are documented in
`docs/`:

| Step  | Doc                                 | Covers                                                           |
| ----- | ----------------------------------- | ---------------------------------------------------------------- |
| 1     | `docs/01-architecture-and-ia.md`    | Architecture, information architecture, content model, taxonomy  |
| 2     | _(this scaffold)_                   | Project setup, folder structure, Content Collections schemas     |
| 3     | `docs/03-design-system.md`          | Design tokens, typography, component set                         |
| 4     | `docs/04-layouts-and-navigation.md` | Navbar, Footer, TOC, breadcrumbs, KB sidebar                     |
| 5     | `docs/05-mdx-content.md`            | Syntax highlighting, callouts, Mermaid, math, heading extraction |
| 6     | `docs/06-blog.md`                   | Real listing, pagination, related articles, prev/next            |
| 7     | `docs/07-knowledge-base.md`         | Real tree, category/topic listings                               |
| 8     | `docs/08-projects-architecture.md`  | Full templates, cross-linked related content                     |
| 9     | `docs/09-search.md`                 | Static search index, FlexSearch, command palette                 |
| 10    | `docs/10-seo.md`                    | Sitemap, RSS, JSON-LD, OpenGraph images                          |
| 11    | _(this file + `.github/`)_          | CI, issue/PR templates, contributing guide                       |
| 12    | `docs/12-deployment.md`             | systemd service, Cloudflare Tunnel, DNS, HTTPS, auto-deploy      |
| 13–14 | _(upcoming)_                        | Performance/security hardening, production readiness review      |

Every doc above also notes what was **verified** (not just built) and any
real bugs the verification caught — worth reading if you're picking this
project back up after time away.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — covers both content corrections
(typos, outdated commands) and code contributions (dev setup, conventions,
what CI checks).

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Scripts

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Local dev server                  |
| `npm run build`        | Production build                  |
| `npm run start`        | Serve the production build        |
| `npm run lint`         | ESLint                            |
| `npm run format`       | Prettier (writes)                 |
| `npm run format:check` | Prettier (check only, used in CI) |
| `npm run typecheck`    | `tsc --noEmit`                    |

## Folder structure

```
app/                  Routes (App Router)
components/           layout/ content/ home/ ui/
content/               blog/ knowledge-base/ projects/ architecture/  (MDX, Git-tracked)
lib/                   taxonomy.ts, utils.ts — shared logic
data/                  Structured JSON (skills, certifications, timeline, tech stack)
types/                 Hand-authored shared types
content-collections.ts Content-type schemas (Zod), one per content type
```

## Content model

Four content types, one schema-driven pipeline (Content Collections). See
`docs/01-architecture-and-ia.md` section 5 for the full frontmatter spec per
type, and section 6 for the canonical 12-category taxonomy in
`lib/taxonomy.ts`.

**Adding a blog post:**

```
content/blog/my-post.mdx
```

**Adding a Knowledge Base article** (fixed 3-level depth — category/topic/page):

```
content/knowledge-base/<category>/<topic>/<page>.mdx
```

**Adding a project:**

```
content/projects/my-project.mdx
```

**Adding an architecture reference:**

```
content/architecture/my-reference.mdx
```

Every file needs frontmatter matching its collection's schema in
`content-collections.ts` — the build fails loudly if a required field is
missing or a `category` isn't one of the 12 canonical values, rather than
publishing a malformed page.

## Deployment

Runs in a homelab behind Cloudflare Tunnel at `blogs.ramhl.com`, as a systemd
service with automatic deploys on merge to `main` via a self-hosted GitHub
Actions runner. Full instructions — Node setup, the systemd unit, Cloudflare
Tunnel + DNS, HTTPS, security headers, and the deploy workflow — are in
[`docs/12-deployment.md`](docs/12-deployment.md). Deployment configs
themselves live in `deploy/` and `scripts/deploy.sh`.
