# Contributing

This is a personal site, but it's public and Git-based, so corrections and
suggestions are welcome. There are two very different kinds of contribution
here — content and code — and they have different expectations.

## Content corrections (typos, outdated info, broken commands)

The fastest path: open an issue using the **Content correction** template,
or if you know the fix, open a PR directly editing the relevant `.mdx` file
under `content/`.

You don't need to run the site locally just to fix a typo — GitHub's web
editor is fine for small changes. For anything larger (a new section, a
diagram), see the dev setup below so you can preview it.

## Adding new content (new blog post, KB article, etc.)

This is the site owner's call, not open for community PRs — but if you spot
a gap (a topic that should exist, a KB article that's clearly needed), open
an issue with the **Feature request** template describing what's missing.

## Code contributions

### Dev setup

```bash
npm install
npm run dev
```

### Before opening a PR

```bash
npm run lint
npm run typecheck
npm run build
```

All three run in CI (`.github/workflows/ci.yml`) on every push and PR, so a
red check means one of these failed — same commands, same order, locally.

### Conventions worth knowing before changing code

- **Design tokens, not hardcoded colors.** Every color is a CSS custom
  property defined in `styles/globals.css` and mapped in
  `tailwind.config.ts` — see `docs/03-design-system.md` for the palette
  rationale before adding a new one.
- **Taxonomy is closed, tags are open.** The 12 categories in
  `lib/taxonomy.ts` are a deliberately curated list (see
  `docs/01-architecture-and-ia.md` section 6) — don't add a 13th category
  for something that can be a tag instead.
- **Content types share one MDX pipeline.** Blog, Knowledge Base, Projects,
  and Architecture all compile through the same `content-collections.ts`
  config — a fix to syntax highlighting, callouts, or Mermaid rendering
  should work across all four, not just the one you're testing against.
- **`interface` vs `type` matters for Content Collections return types.**
  A real bug from Step 5 of this build: TypeScript's structural check
  against Content Collections' serialization constraint doesn't unwrap an
  `interface` the same way it unwraps a `type` alias. If a `transform`
  function starts failing with a cryptic type error after adding a field,
  check whether the field's type is declared as an `interface`.

## Commit messages

No strict format enforced, but a subject line that says _what_ changed
(`fix: correct RAC interconnect diagram`, `feat: add vacuum tuning KB
article`) is much more useful than `update stuff` six months from now.
