# Design System (Step 3)

## Rationale

The brief named Vercel, Linear, Stripe Docs, Tailwind UI, Medium, GitHub Docs,
and shadcn/ui as inspiration — all minimal, dark-friendly, typography-first
products. Rather than average those into "generic dark SaaS site," the token
system below is grounded in the actual subject: a database architect and
homelab operator whose daily tools are SQL terminals, log output, and
monitoring dashboards.

Two generic-AI-design patterns were deliberately avoided:

- Near-black background + single bright acid-green/cyan accent — the reflexive
  "tech site" look.
- Warm cream + serif display + terracotta accent — the reflexive "editorial"
  look.

Instead: a **blue-black** (not pure black) background with an **amber**
primary accent — evoking terminal-phosphor monitors and Oracle SQL\*Plus
sessions, something this site's actual audience/author will recognize as
specific rather than generic.

## Color tokens

| Token                      | Dark (default) | Light         | Role               |
| -------------------------- | -------------- | ------------- | ------------------ |
| `background`               | `220 26% 6%`   | `0 0% 100%`   | Page background    |
| `surface`                  | `220 20% 10%`  | `220 14% 96%` | Cards, panels      |
| `border`                   | `220 15% 16%`  | `220 13% 90%` | Hairlines          |
| `foreground`               | `210 20% 92%`  | `220 26% 8%`  | Body text          |
| `muted-foreground`         | `220 9% 60%`   | `220 9% 40%`  | Secondary text     |
| `primary` (amber)          | `38 92% 58%`   | `32 95% 44%`  | Links, CTAs        |
| `status-active` (teal)     | `172 66% 50%`  | `172 66% 38%` | "Active" status    |
| `status-completed` (green) | `142 71% 45%`  | `142 71% 35%` | "Completed" status |
| `status-archived` (slate)  | `220 9% 45%`   | `220 9% 45%`  | "Archived" status  |

Defined as CSS custom properties in `styles/globals.css`, consumed via
Tailwind's `theme.extend.colors` in `tailwind.config.ts` — never hardcoded in
components.

## Typography

| Role    | Face           | Used for                                                            |
| ------- | -------------- | ------------------------------------------------------------------- |
| Display | Space Grotesk  | Headings only — restrained, not body text                           |
| Body    | Inter          | All long-form prose (blog, KB, project write-ups)                   |
| Mono    | JetBrains Mono | Code blocks **and** UI metadata (dates, reading time, tags, badges) |

Loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables
(`--font-display`, `--font-sans`, `--font-mono`) and mapped in Tailwind's
`fontFamily`. Using mono for UI metadata (not just code) is the deliberate
choice tying "this person writes SQL and YAML all day" into the interface
itself, not just the code blocks.

## Signature element: the status dot

`components/content/status-dot.tsx` — a small colored dot (active/pulsing
teal, completed/green, archived/slate, planned/amber-outline), borrowed
directly from Kubernetes pod status and Grafana panels. This is the one
place the design spends real personality; everything else — cards, badges,
layout — stays quiet and disciplined around it.

## Restraint decisions

- **Taxonomy categories are not color-coded.** Twelve categories × twelve
  colors on a card grid would read as noisy, working against "minimal."
  Category badges stay neutral (amber-tinted, same treatment for all).
  Color is reserved for status only.
- **Animation is scoped, not global.** `prefers-reduced-motion` is respected
  at the stylesheet level (`styles/globals.css`), and the only built-in
  keyframe animation (`pulse-dot`) is reserved for the one state that's
  genuinely "live."

## Components built in this step

| Component                         | Path                                      | Notes                                                    |
| --------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `Button`                          | `components/ui/button.tsx`                | shadcn-style, `cva` variants: default/outline/ghost/link |
| `Badge`                           | `components/ui/badge.tsx`                 | Monospace by default                                     |
| `Card` (+ sub-parts)              | `components/ui/card.tsx`                  | Header/Title/Description/Content/Footer                  |
| `Separator`                       | `components/ui/separator.tsx`             |                                                          |
| `StatusDot`                       | `components/content/status-dot.tsx`       | Signature element                                        |
| `Tag`                             | `components/content/tag.tsx`              | Links to `/blog/tag/[tag]`                               |
| `TechnologyBadge`                 | `components/content/technology-badge.tsx` | For project stacks                                       |
| `CategoryBadge` / `CategoryLabel` | `components/content/category-badge.tsx`   | Linked vs. non-linked variants — see note below          |
| `CategoryCard`                    | `components/content/category-card.tsx`    | For the KB/category grid                                 |
| `ArticleCard`                     | `components/content/article-card.tsx`     | Blog listing card                                        |
| `ProjectCard`                     | `components/content/project-card.tsx`     | Projects listing card, includes `StatusDot`              |

**Bug caught during build-testing:** the first draft of `ArticleCard` nested
a linked `CategoryBadge` inside the card's own outer `<Link>` — invalid HTML
(`<a>` inside `<a>`) that would have caused a hydration error. Fixed by
splitting into a non-interactive `CategoryLabel` (safe to nest) and a
standalone linked `CategoryBadge` (for filter bars/breadcrumbs where it isn't
nested inside another link).

## Verified

- `npm run typecheck` — clean.
- `npm run build` — clean, all routes compiling, Content Collections still
  validating the 4 sample documents against Step 2's schemas.
- Google Fonts can't be fetched from _this sandbox_ (not on its allowed
  domain list) — confirmed by temporarily stripping the font imports and
  re-running the full build clean. This is a sandbox-only limitation; your
  machine will fetch Space Grotesk/Inter/JetBrains Mono normally.

## Next step

**Step 4: layouts & navigation** — Navbar, Footer, Breadcrumb, TOC,
Pagination, and the three section-specific secondary navs (blog filter bar,
KB sidebar tree, projects/architecture grids) that wrap around the page
stubs built in Step 2, using the components built here.
