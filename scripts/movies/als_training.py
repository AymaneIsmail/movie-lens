"""
Ce script permet d'entraîner un modèle de recommandation basé sur l'algorithme ALS (Alternating Least Squares) 
en utilisant PySpark. Vous pouvez l'exécuter via la ligne de commande (CLI) ou l'importer dans un notebook.

Utilisation via la ligne de commande (CLI) :
--------------------------------------------
Exemple de commande pour exécuter le script :
python3 train_als.py --rank 16 --regParam 0.03 --ratings hdfs:///mon_dossier/ratings.csv

Utilisation dans un notebook :
------------------------------
Vous pouvez importer et exécuter les fonctions directement dans un notebook :
from train_als import run, Paths, ALSParams
run(Paths(ratings="hdfs:///mon_dossier/ratings.csv"), ALSParams(rank=20, regParam=0.08))
"""
from __future__ import annotations
import argparse
from dataclasses import dataclass, asdict
from typing import Tuple
from contextlib import contextmanager
from typing import Generator

from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import StructType, StructField, IntegerType, FloatType, StringType
from pyspark.ml.recommendation import ALS, ALSModel
from pyspark.ml.evaluation import RegressionEvaluator

# ------------------------------- CONFIGURATION ------------------------------ #
@dataclass
class Paths:
    ratings: str = "hdfs:///input/rating.csv"
    movies:  str = "hdfs:///input/movie.csv"
    model:   str = "hdfs:///models/als"

@dataclass
class ALSParams:
    rank:      int     = 12
    maxIter:   int     = 15
    regParam:  float   = 0.05
    nonnegative: bool  = True
    implicitPrefs: bool = False
    coldStartStrategy: str = "drop"

# ---------------------------------- SCHEMAS --------------------------------- #
RATINGS_SCHEMA = StructType([
    StructField("userId",  IntegerType()),
    StructField("movieId", IntegerType()),
    StructField("rating",  FloatType()),
    StructField("timestamp", StringType()),
])

MOVIES_SCHEMA = StructType([
    StructField("movieId", IntegerType()),
    StructField("title",   StringType()),
    StructField("genres",  StringType()),
])

# ------------------------------- SPARK SESSION ------------------------------ #
@contextmanager
def spark_session(app_name="TrainALSModel") -> Generator[SparkSession, None, None]:
    spark = (
        SparkSession.builder
        .appName(app_name)
        .master("yarn")
        .getOrCreate()
    )
    try:
        yield spark
    finally:
        spark.stop()

# --------------------------------- FONCTIONS -------------------------------- #
def load_data(spark: SparkSession, paths: Paths) -> Tuple[DataFrame, DataFrame]:
    print("📥 Lecture des fichiers CSV depuis HDFS…")
    ratings = spark.read.csv(paths.ratings, header=True, schema=RATINGS_SCHEMA)
    movies  = spark.read.csv(paths.movies,  header=True, schema=MOVIES_SCHEMA)
    return ratings, movies   # movies optionnel mais on le renvoie au cas où

def split(ratings: DataFrame, seed: int = 42) -> Tuple[DataFrame, DataFrame]:
    return ratings.randomSplit([0.8, 0.2], seed=seed)

def build_als(params: ALSParams) -> ALS:
    return ALS(
        userCol="userId",
        itemCol="movieId",
        ratingCol="rating",
        **asdict(params)   # décompacte dataclass → kwargs
    )

def train(train_df: DataFrame, als: ALS) -> ALSModel:
    print("🤖 Entraînement du modèle ALS…")
    return als.fit(train_df)

def evaluate(model: ALSModel, test_df: DataFrame) -> float:
    print("📊 Évaluation du modèle…")
    predictions = model.transform(test_df)
    rmse = RegressionEvaluator(
        metricName="rmse",
        labelCol="rating",
        predictionCol="prediction"
    ).evaluate(predictions)
    print(f"✅ RMSE test : {rmse:.4f}")
    return rmse

def save(model: ALSModel, path: str) -> None:
    print(f"💾 Sauvegarde du modèle dans HDFS ({path})…")
    model.write().overwrite().save(path)
    print("🎉 Modèle enregistré avec succès.")

# --------------------------------- PIPELINE --------------------------------- #
def run(paths: Paths, als_params: ALSParams) -> None:
    with spark_session("TrainALSModel") as spark:
        ratings, _ = load_data(spark, paths)
        train_df, test_df = split(ratings)
        model = train(train_df, build_als(als_params))
        evaluate(model, test_df)
        save(model, paths.model)

# ----------------------------------- MAIN ----------------------------------- #
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train an ALS recommendation model.")
    parser.add_argument("--rank",      type=int,   default=12)
    parser.add_argument("--maxIter",   type=int,   default=15)
    parser.add_argument("--regParam",  type=float, default=0.05)
    parser.add_argument("--ratings",   default=Paths.ratings)
    parser.add_argument("--movies",    default=Paths.movies)
    parser.add_argument("--model",     default=Paths.model)
    args = parser.parse_args()

    run(
        paths=Paths(ratings=args.ratings, movies=args.movies, model=args.model),
        als_params=ALSParams(rank=args.rank, maxIter=args.maxIter, regParam=args.regParam)
    )