#!/bin/bash
set -e

PORT=3000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Kill any lingering process on port 3000
fuser -k ${PORT}/tcp 2>/dev/null || true

# Wait for port to truly free
sleep 2

# Trap signals to gracefully shutdown
trap 'echo "Shutting down Next.js gracefully..."; kill $NEXT_PID 2>/dev/null || true; sleep 2; fuser -k ${PORT}/tcp 2>/dev/null || true; exit 0' SIGTERM SIGINT

# Start Next.js
cd "$SCRIPT_DIR/apps/web"
exec node_modules/.bin/next start --port ${PORT}
