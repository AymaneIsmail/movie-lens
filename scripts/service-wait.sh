#!/bin/bash
# Usage: ./wait-for-service.sh <host> <port> <timeout>

HOST="$1"
PORT="$2"
TIMEOUT="${3:-30}"

echo "🔍 Waiting for $HOST:$PORT (timeout: ${TIMEOUT}s)..."

for ((i=0;i<TIMEOUT;i++)); do
  if nc -z "$HOST" "$PORT"; then
    echo "✅ Service is available!"
    exit 0
  fi
  sleep 1
done

echo "❌ Timeout waiting for $HOST:$PORT"
exit 1
