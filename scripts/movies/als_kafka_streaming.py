import argparse
from dataclasses import dataclass
from contextlib import contextmanager
from typing import Generator

from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.window import Window
from pyspark.sql.functions import from_json, col, explode, row_number, desc
from pyspark.sql.types import StructType, StructField, IntegerType, FloatType, StringType
from pyspark.ml.recommendation import ALSModel

# ------------------------------- CONFIGURATION ------------------------------ #
@dataclass
class Params:
    ratings: str = "hdfs:///input/rating.csv"
    movies: str = "hdfs:///input/movie.csv"
    links: str = "hdfs:///input/link.csv"
    model: str = "hdfs:///models/als"
    top_n: int = 10
    kafka_topic: str = "movielens_ratings"
    kafka_host: str = "kafka:9092"
    cassandra_host: str = "cassandra"
    cassandra_port: int = 9042
    keyspace: str = "reco"
    table: str = "recommendations"
    checkpoint: str = "hdfs://namenode:9000/tmp/kafka_als_streaming"
    app_name: str = "KafkaALSStreaming"

# ---------------------------------- SCHEMAS --------------------------------- #
RATINGS_SCHEMA = StructType([
    StructField("userId", IntegerType()),
    StructField("movieId", IntegerType()),
    StructField("rating", FloatType()),
    StructField("timestamp", StringType()),
])

MOVIES_SCHEMA = StructType([
    StructField("movieId", IntegerType()),
    StructField("title", StringType()),
    StructField("genres", StringType()),
])

LINKS_SCHEMA = StructType([
    StructField("movieId", IntegerType()),
    StructField("imdbId", IntegerType()),
    StructField("tmdbId", IntegerType()),
])

# ------------------------------- SPARK SESSION ------------------------------ #
@contextmanager
def spark_session(app_name: str, cassandra_host: str) -> Generator[SparkSession, None, None]:
    spark = (
        SparkSession.builder
        .appName(app_name)
        .master("yarn")
        .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1,com.datastax.spark:spark-cassandra-connector_2.12:3.5.1")
        .config("spark.cassandra.connection.host", cassandra_host)
        .getOrCreate()
    )
    try:
        yield spark
    finally:
        spark.stop()

# --------------------------------- MAIN JOB --------------------------------- #
def run_streaming_job(params: Params) -> None:
    with spark_session(params.app_name, params.cassandra_host) as spark:
        model = ALSModel.load(params.model)

        movies_df = (
            spark.read
            .option("header", "true")
            .schema(MOVIES_SCHEMA)
            .csv(params.movies)
            .select("movieId", "title", "genres")
        )

        links_df = (
            spark.read
            .option("header", "true")
            .schema(LINKS_SCHEMA)
            .csv(params.links)
            .select("movieId", "imdbId", "tmdbId")
        )

        df_kafka = (
            spark.readStream
            .format("kafka")
            .option("kafka.bootstrap.servers", params.kafka_host)
            .option("subscribe", params.kafka_topic)
            .option("startingOffsets", "latest")
            .load()
        )

        df_json = df_kafka.selectExpr("CAST(value AS STRING) as json")
        df_parsed = df_json.select(from_json("json", RATINGS_SCHEMA).alias("data")).select("data.*")

        # 🔄 Processing batch
        def process_batch(batch_df: DataFrame, epoch_id: int) -> None:
            user_ids = batch_df.select("userId").distinct()
            recs = (
                model.recommendForUserSubset(user_ids, params.top_n)
                .select("userId", explode("recommendations").alias("rec"))
                .select("userId", col("rec.movieId"), col("rec.rating").alias("score"))
                .join(movies_df, on="movieId", how="left")
                .join(links_df, on="movieId", how="left")
            )
            # ➜ Calculer le rang 1…N par utilisateur, trié sur le score
            w = Window.partitionBy("userId").orderBy(desc("score"))
            recs_ranked = (
                recs.withColumn("rank", row_number().over(w))
                .filter(col("rank") <= params.top_n)
                .select("userId", "movieId", "title", "genres", "score", "rank", "imdbId", "tmdbId")
            )
            # ➜ Écrire dans Cassandra
            (
                recs_ranked
                .withColumnRenamed("userId", "userid")
                .withColumnRenamed("movieId", "movieid")
                .withColumnRenamed("imdbId", "imdbid")
                .withColumnRenamed("tmdbId", "tmdbid")
                .write
                .format("org.apache.spark.sql.cassandra")
                .mode("append")
                .options(table=params.table, keyspace=params.keyspace)
                .save()
            )

        # ▶️ Start stream
        (
            df_parsed.writeStream
            .foreachBatch(process_batch)
            .outputMode("update")
            .option("checkpointLocation", params.checkpoint)
            .start()
            .awaitTermination()
        )

# ----------------------------------- CLI ----------------------------------- #
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kafka ALS Streaming Job")
    for field in Params.__dataclass_fields__.values():
        parser.add_argument(f"--{field.name}", type=type(field.default), default=field.default)

    args = parser.parse_args()
    params = Params(**vars(args))

    run_streaming_job(params)
