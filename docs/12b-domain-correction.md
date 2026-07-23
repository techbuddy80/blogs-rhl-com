# Domain Correction: rhl.com → ramhl.com

Discovered during Cloudflare Tunnel setup in Step 12: the domain used
throughout this entire build (`blogs.rhl.com`) was wrong from the very
first prompt. `cloudflared tunnel route dns` surfaced it indirectly —
it created `blogs.rhl.com.ramhl.com` instead of routing `blogs.rhl.com`
directly, because `rhl.com` was never actually a zone in the Cloudflare
account; `ramhl.com` is the real, owned domain.

## What this exposed

The domain had been hardcoded as a literal string in **15 files** across
12 steps — sitemap, RSS, robots.txt, structured data, OpenGraph images,
root metadata, the footer/navbar wordmark, the Cloudflare Tunnel config,
and the CI workflow. Fixing a wrong domain meant a 15-file find-and-replace
instead of a one-line change, which is exactly the failure mode
`NEXT_PUBLIC_SITE_URL` was scaffolded back in Step 2 to prevent — except it
was never actually wired up (flagged but left unfixed in an earlier
conversation, before this came up independently through deployment).

## The real fix

Added `lib/site-config.ts`:

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://blogs.ramhl.com";
export const SITE_NAME = new URL(SITE_URL).host;
```

Every one of those 15 files now imports `SITE_URL`/`SITE_NAME` from here
instead of hardcoding a string. A future domain change (or a staging
environment with a different URL) is now a one-line `.env` edit, not a
repo-wide grep.

## Verified — both paths, not just the happy one

1. **Fallback path**: built with no `.env` present — confirmed via live
   server that sitemap, robots.txt, RSS feed, and the footer wordmark all
   correctly resolve to `blogs.ramhl.com` (the new default).
2. **Override path**: since `NEXT_PUBLIC_*` variables are baked in at
   **build time**, not read at runtime, it's not enough to confirm the
   default looks right — set `NEXT_PUBLIC_SITE_URL` to a throwaway test
   value, rebuilt, and confirmed the sitemap actually reflected the
   override rather than silently ignoring it. Both directions work.
3. Full build/typecheck/lint/format:check all clean afterward.
4. A repo-wide grep for the old domain string (`grep -rln "rhl\.com"`
   excluding the hyphenated `blogs-rhl-com` project/service name) came back
   completely empty — including two instances that weren't caught by the
   first pass (a sample project's `demoUrl` frontmatter, and a comment in
   `scripts/deploy.sh`), found only by re-running the search after the
   "obvious" files were fixed rather than assuming the first pass caught
   everything.

## What you need to do on your end

Since the site was already deployed with the old domain by the time this
was caught:

```bash
# On the homelab host, in the repo checkout:
git pull   # once this fix is committed/pushed on your end
npm ci
npm run build
sudo systemctl restart blogs-rhl-com
```

And redo the Cloudflare Tunnel DNS route against the correct hostname:

```bash
cloudflared tunnel route dns blogs-rhl-com blogs.ramhl.com
```

(The tunnel itself and its credentials don't need to change — only the
DNS route and the site's own domain references.)
