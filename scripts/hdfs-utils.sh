HDFS_LOG_DIR="/logs"
HDFS_INPUT_DIR="/input"
LOCAL_DATA_DIR="/root/data"
HDFS_DIRS=(/errors /input /logs /processed /models /tmp)

check_hdfs_connection() {
    echo "🔌 Vérification de la connexion à HDFS..."
    if ! hdfs dfs -ls / >/dev/null 2>&1; then
        echo "❌ HDFS n'est pas accessible. Vérifiez que le NameNode est démarré."
        exit 1
    fi
}

ensure_hdfs_directory_exists() {
    local dir="$1"
    if ! hdfs dfs -test -d "$dir"; then
        echo "❌ Le répertoire $dir n'existe pas sur HDFS. Avez-vous lancé le script init_hdfs_dirs.sh ?"
        exit 1
    fi
}

ensure_local_directory_exists() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        echo "❌ Le répertoire local $dir n'existe pas." 1>&2
        exit 1
    fi
}