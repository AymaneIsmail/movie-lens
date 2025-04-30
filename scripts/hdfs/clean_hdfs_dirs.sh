#!/bin/bash
set -e

# Liste des répertoires à nettoyer
HDFS_DIRS=(/spark-history /errors /input /logs /processed /models)

check_hdfs_connection() {
    echo "🔌 Vérification de la connexion à HDFS..."
    if ! hdfs dfs -ls / >/dev/null 2>&1; then
        echo "❌ HDFS n'est pas accessible."
        exit 1
    fi
}

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
