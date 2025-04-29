#!/bin/bash

echo "Vérification de la disponibilité de HDFS..."
hdfs dfs -ls / > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "HDFS n'est pas accessible. Assurez-vous que Hadoop est démarré."
  exit 1
fi

LOCAL_DIR="/root/data"  # Répertoire monté à partir du volume Docker
HDFS_DIR="/input"

echo "Vérification des fichiers CSV dans le répertoire local $LOCAL_DIR..."
if ls $LOCAL_DIR/*.csv 1> /dev/null 2>&1; then
  echo "Fichiers CSV trouvés, début du transfert vers HDFS..."

  hdfs dfs -mkdir -p $HDFS_DIR  

  hdfs dfs -put $LOCAL_DIR/*.csv $HDFS_DIR/

  if [ $? -eq 0 ]; then
    echo "Les fichiers CSV ont été transférés avec succès vers HDFS."
  else
    echo "Erreur lors du transfert des fichiers CSV vers HDFS."
  fi
else
  echo "Aucun fichier CSV trouvé dans $LOCAL_DIR. Impossible de transférer."
fi
