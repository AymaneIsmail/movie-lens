#!/bin/bash

echo "Création de la structure de dossiers dans HDFS..."
hdfs dfs -mkdir -p /errors
hdfs dfs -mkdir -p /input
hdfs dfs -mkdir -p /logs
hdfs dfs -mkdir -p /processed

today=$(date +"%Y-%m-%d")
hdfs dfs -mkdir -p /errors/$today
hdfs dfs -mkdir -p /logs/$today

echo "Répertoires créés."

echo "Ceci est un fichier de log de test pour vérifier l'écriture dans HDFS." > /tmp/test_log.txt
hdfs dfs -put /tmp/test_log.txt /logs/$today/test_log.txt
echo "Fichier de test créé dans /logs/$today/test_log.txt."

echo "Vérification du fichier dans HDFS..."
hdfs dfs -ls /logs/$today/test_log.txt

echo "Traitement terminé. Logs disponibles dans /logs/$today, erreurs dans /errors/$today."
