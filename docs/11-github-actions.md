# GitHub Actions & Repo Prep (Step 11)

## What's added

| File                                         | Purpose                                                                                                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LICENSE`                                    | MIT for source code, with an explicit carve-out note that `content/` (blog posts, KB articles, etc.) is separately copyrighted                                 |
| `.github/workflows/ci.yml`                   | Runs `lint` → `typecheck` → `format:check` → `build` on every push/PR to `main`, with `concurrency` set to cancel superseded runs                              |
| `.github/dependabot.yml`                     | Weekly npm + GitHub Actions dependency updates, grouped into one PR for minor/patch bumps rather than one-per-package                                          |
| `.github/ISSUE_TEMPLATE/*.md` + `config.yml` | Bug report, feature request, and a **content correction** template (this site is content-heavy enough to warrant a distinct template from generic bug reports) |
| `.github/PULL_REQUEST_TEMPLATE.md`           | Checklist covering the same three gates CI runs, plus content-specific and design-token-specific checks                                                        |
| `CONTRIBUTING.md`                            | Split into content contributions vs. code contributions — very different expectations for each                                                                 |
| `README.md`                                  | Added CI/license badges and a full index of every step's doc in `docs/`, since there are now 10 of them                                                        |

## A real gap this step caught: the CI workflow would have failed on its first run

Adding `npm run format:check` as a CI gate (matching the script that already existed in `package.json` since Step 2, but had never actually been run in this entire build) surfaced that **42 files** failed Prettier's formatting check — every file created via heredoc across Steps 2–10 was never run through Prettier, so quote style, trailing commas, and Tailwind class ordering had all drifted from what Prettier expects.

This is exactly the kind of gap that's invisible until you actually add the CI gate and run it: `lint`, `typecheck`, and `build` had all been passing clean at the end of every prior step, so there was no earlier signal that formatting was off — ESLint and Prettier check different things. Fixed by running `npm run format` (the `--write` counterpart, already scaffolded in Step 2) across the whole repo, then re-verified all four gates (`lint`/`typecheck`/`format:check`/`build`) still pass clean afterward — reformatting is supposed to be a no-op on behavior, but it's worth confirming rather than assuming.

## Verified

- All three `.github/*.yml` files parse as valid YAML (checked directly with a YAML parser, not just eyeballed — a workflow with a subtle indentation error stays silently broken until someone notices no checks ever ran).
- Confirmed `package-lock.json` is present and committed (required for `npm ci`, which is stricter than `npm install` and is what the workflow uses).
- Confirmed every script name referenced in `ci.yml` (`lint`, `typecheck`, `format:check`, `build`) matches `package.json` exactly.
- Ran all four gates locally in the same order the workflow runs them, end to end, immediately after the format fix — all clean.

## Next step

**Step 12: Deployment** — Node process management (PM2 or systemd) instructions for running the built site in the homelab, Cloudflare Tunnel configuration for exposing `blogs.rhl.com`, DNS setup, and wiring the CI workflow to actually deploy on merge to `main` rather than just validating.
