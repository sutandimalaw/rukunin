#!/bin/bash
set -e

PORT=3000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

kill_port() {
	if command -v fuser >/dev/null 2>&1; then
		fuser -k ${PORT}/tcp 2>/dev/null || true
	fi
}

# Kill any lingering process on port 3000 (helps prevent EADDRINUSE)
kill_port

# Give the kernel a moment to release the socket
sleep 2

cd "$SCRIPT_DIR/apps/web"

node_modules/.bin/next start --port ${PORT} &
NEXT_PID=$!

trap 'echo "Shutting down Next.js..."; kill "$NEXT_PID" 2>/dev/null || true; sleep 2; kill_port; exit 0' SIGTERM SIGINT

wait "$NEXT_PID"
