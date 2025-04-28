#!/bin/bash

# Vérification de la disponibilité de HDFS
echo "HDFS est accessible."

# Création des répertoires principaux dans HDFS
echo "Création de la structure de dossiers dans HDFS..."
hdfs dfs -mkdir -p /errors
hdfs dfs -mkdir -p /input
hdfs dfs -mkdir -p /logs
hdfs dfs -mkdir -p /processed

# Vérification de l'existence des sous-répertoires
today=$(date +"%Y-%m-%d")
hdfs dfs -mkdir -p /errors/$today
hdfs dfs -mkdir -p /logs/$today

echo "Répertoires créés."

# Tentative de transfert des fichiers (Assurez-vous que les fichiers existent)
if ls /path/to/local/csvs/*.csv 1> /dev/null 2>&1; then
  echo "Transfert des fichiers CSV vers HDFS..."
  hdfs dfs -put /path/to/local/csvs/*.csv /input/
else
  echo "Le fichier /path/to/local/csvs/*.csv n'existe pas. Impossible de le transférer."
fi

# Log de fin de traitement
echo "Traitement terminé. Logs disponibles dans /logs/$today, erreurs dans /errors/$today."
