#!/bin/bash
# Utilisation : ./download_latest_hdfs_log.sh [pattern]

set -e

HDFS_LOG_DIR="/logs"
LOCAL_OUTPUT_DIR="/root/data"
PATTERN=$1

if [ -z "$PATTERN" ]; then
  echo "⚠️ Aucun pattern fourni. Utilisation du motif par défaut : 'upload_'"
  PATTERN="upload_"
fi

latest_log=$(hdfs dfs -ls "$HDFS_LOG_DIR" | awk '{print $8}' | grep "$PATTERN" | sort -V | tail -n 1)

if [ -z "$latest_log" ]; then
  echo "❌ Aucun fichier de log trouvé dans $HDFS_LOG_DIR"
  exit 1
fi

echo "📥 Téléchargement de $latest_log vers $LOCAL_OUTPUT_DIR..."
hdfs dfs -get -f "$latest_log" "$LOCAL_OUTPUT_DIR/"
echo "✅ Téléchargement terminé : $LOCAL_OUTPUT_DIR/$(basename "$latest_log")"
