#!/bin/bash

set -e

KEYSPACE="reco"
TABLE="recommendations"

echo "📁 Création du keyspace '$KEYSPACE'..."
cqlsh -e "
CREATE KEYSPACE IF NOT EXISTS $KEYSPACE
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
"

echo "📄 Création de la table '$TABLE'..."
cqlsh -k $KEYSPACE -e "
CREATE TABLE IF NOT EXISTS $TABLE (
  userid int,
  movieid int,
  score float,
  title text,
  genres text,
  PRIMARY KEY (userid, movieid)
)
"

echo "✅ Keyspace et table initialisés avec succès."
