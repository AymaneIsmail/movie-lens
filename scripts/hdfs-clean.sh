#!/bin/bash
set -e

source "$(dirname "$0")/hdfs-utils.sh"

clean_hdfs_dirs() {
    for dir in "${HDFS_DIRS[@]}"; do
        if hdfs dfs -test -d "$dir"; then
            echo "🧹 Nettoyage du dossier $dir..."
            hdfs dfs -rm -r -skipTrash "$dir"/
        else
            echo "⚠️ Le dossier $dir n'existe pas sur HDFS."
        fi
    done
}

main() {
    check_hdfs_connection
    clean_hdfs_dirs
    echo "🧼 Tous les répertoires HDFS ont été nettoyés."
}

main
