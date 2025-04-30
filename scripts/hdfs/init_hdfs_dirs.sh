#!/bin/bash
set -e

# Liste des répertoires HDFS à créer
HDFS_DIRS=(/errors /input /logs /processed /models)

check_hdfs_connection() {
    echo "🔌 Vérification de la connexion à HDFS..."
    if ! hdfs dfs -ls / >/dev/null 2>&1; then
        echo "❌ HDFS n'est pas accessible. Vérifiez que le NameNode est démarré."
        exit 1
    fi
}

create_hdfs_dirs() {
    for dir in "${HDFS_DIRS[@]}"; do
        if hdfs dfs -test -d "$dir"; then
            echo "📁 Le dossier $dir existe déjà sur HDFS."
        else
            echo "📂 Création du dossier $dir..."
            hdfs dfs -mkdir -p "$dir"
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
