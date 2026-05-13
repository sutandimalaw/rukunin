#!/bin/bash
# Deploy check script — runs via cron every minute on VPS
# VPS pulls from GitHub (outbound) — no inbound SSH needed
set -euo pipefail

REPO_DIR=/var/www/rukunin
LOCK_FILE=/tmp/rukunin-deploy.lock

# Prevent concurrent deploys
if [ -f "${LOCK_FILE}" ]; then
  exit 0
fi
touch "${LOCK_FILE}"
trap 'rm -f "${LOCK_FILE}"' EXIT

cd "${REPO_DIR}"

git config --global --add safe.directory "${REPO_DIR}" 2>/dev/null || true

# Fetch latest deploy branch from GitHub.
# VPS network can stall; enforce timeout + SSH keepalive so this never hangs forever.
fetch_ok=false
GIT_SSH_COMMAND="ssh -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=3"
for attempt in 1 2 3 4 5; do
  if timeout 60s env GIT_SSH_COMMAND="${GIT_SSH_COMMAND}" git fetch origin deploy --quiet 2>&1; then
    fetch_ok=true
    break
  fi
  echo "$(date -u): WARN: git fetch failed (attempt ${attempt}/5), retrying in $((attempt * 5))s..."
  sleep $((attempt * 5))
done

if [ "${fetch_ok}" != "true" ]; then
  echo "$(date -u): ERROR: git fetch failed after retries"
  echo "$(date -u): DNS diagnostics:"
  (ls -la /etc/resolv.conf && echo "---" && cat /etc/resolv.conf) 2>&1 || true
  command -v resolvectl >/dev/null 2>&1 && (echo "---" && resolvectl status) 2>&1 || true
  exit 1
fi

LOCAL_SHA=$(git rev-parse HEAD 2>/dev/null || echo "none")
REMOTE_SHA=$(git rev-parse origin/deploy 2>/dev/null || echo "")

if [ -z "${REMOTE_SHA}" ]; then
  echo "$(date -u): ERROR: deploy branch not found on origin"
  exit 1
fi

# Nothing to deploy
if [ "${LOCAL_SHA}" = "${REMOTE_SHA}" ]; then
  exit 0
fi

echo "$(date -u): New deploy detected: ${LOCAL_SHA:0:7} → ${REMOTE_SHA:0:7}"

# Switch to deploy branch and pull latest artifacts
git checkout -B deploy origin/deploy 2>/dev/null || {
  git checkout deploy
  git reset --hard origin/deploy
}
git clean -fd

echo "$(date -u): Checked out deploy branch: $(git rev-parse --short HEAD)"

# Install runtime deps.
# IMPORTANT: do NOT use --no-optional here.
# Next.js needs platform optional deps on Linux (e.g. @next/swc-linux-x64-gnu) to run `next start`.
# Keep it lightweight by omitting dev deps, but still include optional deps.
echo "$(date -u): Installing dependencies (prod + optional)..."
npm install --omit=dev --include=optional --prefer-offline 2>&1 | tail -20

# Run database migrations
echo "$(date -u): Running migrations..."
npx prisma migrate deploy --schema apps/api/src/prisma/schema.prisma

# Restart apps via PM2
echo "$(date -u): Restarting apps..."
pm2 delete rukunin-web 2>/dev/null || true
pm2 delete rukunin-api 2>/dev/null || true

if command -v lsof >/dev/null 2>&1; then
  kill -9 $(lsof -t -i:3000) 2>/dev/null || true
  kill -9 $(lsof -t -i:3001) 2>/dev/null || true
elif command -v fuser >/dev/null 2>&1; then
  fuser -k 3000/tcp 2>/dev/null || true
  fuser -k 3001/tcp 2>/dev/null || true
fi

pm2 start ecosystem.config.js --env production --update-env
pm2 save

echo "$(date -u): Deploy complete: $(git rev-parse --short HEAD)"
