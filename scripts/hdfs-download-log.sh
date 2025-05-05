#!/bin/bash
set -e
# Script pour télécharger le dernier fichier de log HDFS correspondant à un pattern donné.
# Utilisation : ./download_latest_hdfs_log.sh [pattern]

source "$(dirname "$0")/hdfs-utils.sh"

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

echo "📥 Téléchargement de $latest_log vers $LOCAL_DATA_DIR..."
hdfs dfs -get -f "$latest_log" "$LOCAL_DATA_DIR/"
echo "✅ Téléchargement terminé : $LOCAL_DATA_DIR/$(basename "$latest_log")"
