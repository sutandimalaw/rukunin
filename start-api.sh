#!/bin/bash
# start-api.sh - Wrapper script to start the NestJS API for Rukunin
# Ensures the port is free before starting and handles graceful shutdown.

set -euo pipefail
PORT=3001
APP_DIR="apps/api"

echo "Starting Rukunin API..."
echo "Ensuring port $PORT is free..."
fuser -k -n tcp "$PORT" || true
# Wait until port is actually free (max 15s)
for i in $(seq 1 15); do
  fuser "$PORT/tcp" > /dev/null 2>&1 || break
  sleep 1
done

# Function to be called on script exit
cleanup() {
    echo "Caught signal, stopping Rukunin API process..."
    if [ -n "$api_pid" ]; then
        kill "$api_pid"
        wait "$api_pid" 2>/dev/null
    fi
    echo "Rukunin API stopped."
    exit 0
}

# Trap termination signals
trap cleanup SIGTERM SIGINT

# Start the NestJS app in the background
echo "Starting NestJS server from directory: $APP_DIR"
(
  cd "$APP_DIR"
  exec node dist/main.js
) &

api_pid=$!
echo "Rukunin API process started with PID: $api_pid"

# Wait for the process to exit
wait "$api_pid"
