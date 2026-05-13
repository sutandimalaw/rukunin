#!/bin/bash
# start-web.sh - Wrapper script to start the Next.js app for Rukunin
# Ensures the port is free before starting and handles graceful shutdown.

set -euo pipefail
PORT=3000
APP_DIR="apps/web"

echo "Starting Rukunin Web..."
echo "Ensuring port $PORT is free..."
fuser -k -n tcp "$PORT" || true
# Wait until port is actually free (max 15s)
for i in $(seq 1 15); do
  fuser "$PORT/tcp" > /dev/null 2>&1 || break
  sleep 1
done

# Function to be called on script exit
cleanup() {
    echo "Caught signal, stopping Rukunin Web process..."
    if [ -n "$web_pid" ]; then
        kill "$web_pid"
        wait "$web_pid" 2>/dev/null
    fi
    echo "Rukunin Web stopped."
    exit 0
}

# Trap termination signals
trap cleanup SIGTERM SIGINT

# Start the Next.js app in the background
echo "Starting Next.js server from directory: $APP_DIR"
(
  cd "$APP_DIR"
  exec npx next start
) &

web_pid=$!
echo "Rukunin Web process started with PID: $web_pid"

# Wait for the process to exit
wait "$web_pid"
