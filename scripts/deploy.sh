#!/usr/bin/env bash
# Deploy blogs.rhl.com — run on the homelab host, either by the self-hosted
# GitHub Actions runner (see .github/workflows/deploy.yml) or manually.
#
# Usage: ./scripts/deploy.sh
# Assumes it's run from inside the repo checkout at /opt/blogs-rhl-com.

set -euo pipefail

REPO_DIR="/opt/blogs-rhl-com"
SERVICE_NAME="blogs-rhl-com"

cd "$REPO_DIR"

echo "==> Pulling latest main"
git fetch origin main
git reset --hard origin/main

echo "==> Installing dependencies"
npm ci

echo "==> Running production build"
npm run build

echo "==> Restarting service"
sudo systemctl restart "$SERVICE_NAME"

echo "==> Waiting for health check"
for _ in $(seq 1 10); do
  if curl -sf http://localhost:3000/ -o /dev/null; then
    echo "==> Deploy succeeded — site responding"
    exit 0
  fi
  sleep 2
done

echo "==> Site did not respond after restart — check: journalctl -u $SERVICE_NAME -n 50" >&2
exit 1
