#!/bin/bash
set -e

source "$(dirname "$0")/hdfs-utils.sh"

create_hdfs_dirs() {
    for dir in "${HDFS_DIRS[@]}"; do
        if hdfs dfs -test -d "$dir"; then
            echo "📁 Le dossier $dir existe déjà sur HDFS."
        else
            echo "📂 Création du dossier $dir..."
            hdfs dfs -mkdir -p "$dir"
            hdfs dfs -chmod 777 "$dir"
        fi
    done
}

test_hdfs_write_permissions() {
    echo "🧪 Test d'écriture dans HDFS (/logs)..."
    local testfile="hdfs_test_$(date +%s).log"
    echo "Ceci est un test HDFS." > "/tmp/$testfile"

    hdfs dfs -put "/tmp/$testfile" /logs/
    echo "✅ Fichier de test envoyé dans /logs."

    hdfs dfs -rm "/logs/$testfile"
    rm "/tmp/$testfile"
    echo "🧹 Fichier de test supprimé. Test HDFS réussi."
}

main() {
    check_hdfs_connection
    create_hdfs_dirs
    test_hdfs_write_permissions
    echo "🎉 Initialisation HDFS terminée avec succès."
}

main