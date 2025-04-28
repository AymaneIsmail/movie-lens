#!/bin/bash

# Script: download_kaggle_dataset.sh
# Description: Télécharge et décompresse un dataset depuis Kaggle dans le dossier du script -> https://www.kaggle.com/settings -> générer une clé d'API

KAGGLE_USERNAME="your_kaggle_username"
KAGGLE_KEY="your_kaggle_key"
DATASET="grouplens/movielens-20m-dataset"

# Dossier du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESTINATION="$SCRIPT_DIR/movielens-20m-dataset.zip"

echo "Téléchargement du dataset..."
curl -L --user "$KAGGLE_USERNAME:$KAGGLE_KEY" \
  "https://www.kaggle.com/api/v1/datasets/download/$DATASET" \
  -o "$DESTINATION"

if [ -f "$DESTINATION" ]; then
  echo "Téléchargement terminé : $DESTINATION"
  
  echo "Décompression..."
  unzip -o "$DESTINATION" -d "$SCRIPT_DIR"
  
  echo "Décompression terminée."

  echo "Nettoyage..."
  rm "$DESTINATION"
  echo "Archive supprimée."
else
  echo "Erreur lors du téléchargement."
  exit 1
fi
