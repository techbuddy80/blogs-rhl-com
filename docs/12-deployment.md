# Deployment (Step 12)

Deploying `blogs.rhl.com` to the homelab, end to end: Node.js, the
production build, running it as a systemd service, exposing it via
Cloudflare Tunnel, DNS, HTTPS, security headers, and automatic deploys on
merge to `main`.

## 1. Prerequisites on the target host

- A Linux VM or LXC container in Proxmox (matches the rest of the homelab's
  pattern — Nextcloud on VM 109, etc. This site can live on its own VM/LXC).
- Node.js 20+ (matches the `engines` field added to `package.json` this
  step — `nvm install 20` or your distro's Node 20 package).
- Git, and a clone of the repo at `/opt/blogs-rhl-com`.

```bash
sudo mkdir -p /opt/blogs-rhl-com
sudo chown $USER:$USER /opt/blogs-rhl-com
git clone https://github.com/techbuddy80/blogs-rhl-com.git /opt/blogs-rhl-com
cd /opt/blogs-rhl-com
cp .env.example .env   # fill in real values — see Step 2's .env.example
npm ci
npm run build
```

## 2. Running as a systemd service

`deploy/blogs-rhl-com.service` is the real unit file — **verified** with
`systemd-analyze verify` (no warnings) before being included here, not just
written from memory of the directive names.

```bash
# Create a dedicated, unprivileged service user — never run this as root
# or your personal login user.
sudo useradd --system --home /opt/blogs-rhl-com --shell /usr/sbin/nologin blogsrhl
sudo chown -R blogsrhl:blogsrhl /opt/blogs-rhl-com

sudo cp deploy/blogs-rhl-com.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now blogs-rhl-com
sudo systemctl status blogs-rhl-com
```

The unit includes basic hardening (`ProtectSystem=strict`,
`NoNewPrivileges=true`, `ProtectHome=true`) since this service only needs to
bind a local port and read its own working directory — nothing else on the
host.

**Alternative: PM2.** If you'd rather not manage a systemd user, `pm2 start
npm --name blogs-rhl-com -- start` plus `pm2 startup` + `pm2 save` gets you
equivalent auto-restart-on-boot behavior with less unit-file ceremony, at
the cost of one more global npm package to keep updated. This build
standardizes on systemd since it's already present on any Linux host with
no extra install, and the hardening options above aren't available in PM2.

## 3. Cloudflare Tunnel

```bash
# On the tunnel host (can be the same VM, or a separate lightweight one):
cloudflared tunnel login
cloudflared tunnel create blogs-rhl-com
cloudflared tunnel route dns blogs-rhl-com blogs.rhl.com
```

`tunnel route dns` creates the CNAME in Cloudflare-managed DNS automatically
— no manual DNS record needed, and no inbound port ever opens on the
router.

Copy `deploy/cloudflared-config.yml` to `/etc/cloudflared/config.yml`,
replacing `<TUNNEL_ID>` with the ID from `tunnel create`'s output, then:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

## 4. HTTPS

Cloudflare Tunnel terminates TLS at Cloudflare's edge automatically — the
origin (this Next.js process) never needs its own certificate. In the
Cloudflare dashboard, set **SSL/TLS mode to Full** (or **Full (strict)** if
you also want Cloudflare validating a cert on the tunnel connection itself,
which `cloudflared` provides automatically). Do not use "Flexible" — that
would terminate TLS at Cloudflare but talk to the tunnel over plaintext.

## 5. Security headers

The baseline headers were already added to `next.config.mjs` back in Step
2 (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). At the
Cloudflare layer, worth adding via a **Transform Rule** (Rules →
Transform Rules → Modify Response Header) or a Cloudflare-managed HSTS
setting (SSL/TLS → Edge Certificates → "Always Use HTTPS" + HSTS):

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

A full Content-Security-Policy is deliberately deferred to Step 13
(performance/security hardening pass) — CSP needs to account for every
external resource the site actually loads (Google Fonts, Giscus's script,
the Mermaid dynamic import), which is easier to get right after the whole
site is feature-complete than to write speculatively now and have it break
something added later.

## 6. Automatic deploys on merge to `main`

`.github/workflows/deploy.yml` — **validated as real YAML** (parsed, not
just visually checked). Triggers via `workflow_run` only after `ci.yml`
completes successfully on `main`, so nothing unvalidated ever deploys.

This requires a **self-hosted GitHub Actions runner** registered on the
homelab host — the tunnel-only network has no inbound path for a
cloud-hosted GitHub runner to reach it directly, so the runner has to live
on the same side of the tunnel as the site itself:

```bash
# On the homelab host, following GitHub's own runner registration flow
# (Settings → Actions → Runners → New self-hosted runner):
./config.sh --url https://github.com/techbuddy80/blogs-rhl-com --token <TOKEN>
sudo ./svc.sh install
sudo ./svc.sh start
```

The workflow itself just calls `scripts/deploy.sh`, which is idempotent
(`git reset --hard origin/main`, `npm ci`, `npm run build`, service
restart) and includes its own health check — it curls `localhost:3000`
after restarting and fails loudly (exit 1, non-zero workflow status) if the
site doesn't come back up, rather than silently leaving a broken deploy
running.

**Note on `sudo systemctl restart` inside the deploy script**: the runner's
service account needs passwordless sudo scoped to _only_ that one command
— add a line like this via `sudo visudo`:

```
runner-user ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart blogs-rhl-com
```

Never grant broader passwordless sudo than the one command actually needed.

## Verified in this step

- `systemd-analyze verify` on `deploy/blogs-rhl-com.service` — no warnings.
- Both new YAML files (`deploy.yml`, `cloudflared-config.yml`) parsed
  successfully with a real YAML parser.
- `package.json`'s new `engines` field doesn't break `npm install`/`build`
  (re-ran both after adding it).

What's _not_ independently verifiable from this sandbox: the actual
Cloudflare Tunnel connection, DNS propagation, and the self-hosted runner
registration all require real Cloudflare account access and the actual
homelab hardware — those steps are written from documented, standard
`cloudflared`/GitHub Actions runner setup flows, not fabricated, but
they're the one part of this step that can't be build-tested the way
everything else in this project has been.

## Next step

**Step 13: Performance, accessibility, and security hardening** — Lighthouse
pass (targeting the 100/100/100/100 goal from the original brief), a real
Content-Security-Policy (deferred from this step for the reason above), image
optimization pass, and an accessibility audit across the component set.
