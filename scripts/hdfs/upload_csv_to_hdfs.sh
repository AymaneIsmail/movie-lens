#!/bin/bash

set -e

LOCAL_DATA_DIR="/root/data"
HDFS_INPUT_DIR="/input"
HDFS_LOG_DIR="/logs"

timestamp=$(date +%Y%m%d_%H%M%S)
LOG_FILENAME="upload_${timestamp}.log"
LOG_LOCAL_PATH="/tmp/${LOG_FILENAME}"
LOG_HDFS_PATH="${HDFS_LOG_DIR}/${LOG_FILENAME}"

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

init_log() {
  echo "📝 Début de l'upload CSV à $(date)" > "$LOG_LOCAL_PATH"
}

append_log() {
  echo "$1" | tee -a "$LOG_LOCAL_PATH" >/dev/null
}

flush_log_to_hdfs() {
  echo "📁 Upload du fichier log dans HDFS ($LOG_HDFS_PATH)..."
  hdfs dfs -put -f "$LOG_LOCAL_PATH" "$LOG_HDFS_PATH"
  rm -f "$LOG_LOCAL_PATH"
  echo "✅ Log sauvegardé dans HDFS."
}

upload_single_file() {
  local file="$1"
  local filename=$(basename "$file")

  append_log "📤 Upload de $filename..."
  if hdfs dfs -put -f "$file" "$HDFS_INPUT_DIR/"; then
    append_log "✅ Succès : $filename"
  else
    append_log "❌ Échec : $filename"
  fi
}

upload_all_csv_files() {
  local files=("$LOCAL_DATA_DIR"/*.csv)

  echo "🔍 ${#files[@]} fichiers CSV trouvés dans $LOCAL_DATA_DIR."

  if [[ ! -e "${files[0]}" ]]; then
    append_log "⚠️ Aucun fichier CSV trouvé dans $LOCAL_DATA_DIR."
    return
  fi

  for file in "${files[@]}"; do
    [[ -f "$file" ]] && upload_single_file "$file"
  done
}

main() {
  check_hdfs_connection
  ensure_hdfs_directory_exists "$HDFS_INPUT_DIR"
  ensure_hdfs_directory_exists "$HDFS_LOG_DIR"

  init_log
  upload_all_csv_files
  flush_log_to_hdfs
}

main
