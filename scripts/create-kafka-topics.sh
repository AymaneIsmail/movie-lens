#!/bin/bash

# Liste des topics à créer
TOPICS=("movielens_ratings")

for topic in "${TOPICS[@]}"; do
    echo "🎯 Creating topic: $topic"
    $KAFKA_HOME/bin/kafka-topics.sh --create \
        --topic "$topic" \
        --bootstrap-server kafka:9092 \
        --partitions 1 \
        --replication-factor 1 \
        --if-not-exists
done

echo "✅ All topics created."
