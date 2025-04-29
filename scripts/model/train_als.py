from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator

# ————————————————
# À configurer : préfixe HDFS
#   ""             → Spark utilise le fs par défaut (HDFS sur ton cluster Yarn)
#   "hdfs:///"     → abréviation pour le NameNode configuré
#   "hdfs://nn:9000" → URI complet si tu veux pointer sur un NN en particulier
hdfs_prefix = "hdfs:///"  

# Chemins relatifs après ce préfixe
ratings_path = f"{hdfs_prefix}/processed/rating.csv"
movies_path  = f"{hdfs_prefix}/processed/movie.csv"   # ou "" si tu n'en as pas besoin

# Hyperparamètres ALS
rank      = 12
regParam  = 0.05
maxIter   = 15

# Train/test split
train_ratio = 0.8
# ————————————————

def main():
    print(f"► ratings = {ratings_path}")
    print(f"► movies  = {movies_path or '— pas de metadata —'}")
    print(f"► ALS params → rank={rank}, regParam={regParam}, maxIter={maxIter}")
    print(f"► Train/Test split = {train_ratio:.2f}/{1-train_ratio:.2f}\n")

    # 1. Démarrage Spark
    spark = SparkSession.builder \
        .appName("ALSRecommender") \
        .config("spark.executor.instances", "10") \
        .config("spark.executor.cores", "2") \
        .config("spark.executor.memory", "1g") \
        .config("spark.driver.memory", "3g") \
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
        .getOrCreate()

    # Set checkpoint directory
    spark.sparkContext.setCheckpointDir("/tmp")

    # 2. Lecture des ratings
    ratings = (
        spark.read
             .option("header", True)
             .option("inferSchema", True)
             .csv(ratings_path)
             .selectExpr(
                 "cast(userId  as int)    as userId",
                 "cast(movieId as int)    as movieId",
                 "cast(rating  as float)  as rating"
             )
    )
    ratings = ratings.repartition(200)  # Adjust the number of partitions as needed

    # 3. Lecture des films si défini
    if movies_path:
        movies = spark.read.option("header", True).csv(movies_path)
        print("Aperçu des films :")
        movies.show(5, truncate=False)

    # 4. Train / test split
    train, test = ratings.randomSplit([train_ratio, 1-train_ratio], seed=42)
    print(f"Count → train: {train.count()}, test: {test.count()}")

    # 5. Configuration & entraînement ALS
    als = ALS(
        userCol="userId",
        itemCol="movieId",
        ratingCol="rating",
        rank=rank,
        regParam=regParam,
        maxIter=maxIter,
        coldStartStrategy="drop"
    )
    model = als.fit(train)

    # 6. Prédictions & RMSE
    preds = model.transform(test)
    metrics = ["rmse", "mae", "r2"]
    evaluator = RegressionEvaluator(labelCol="rating", predictionCol="prediction")

    print("\nÉvaluation du modèle :")
    for metric in metrics:
        evaluator.setMetricName(metric)
        score = evaluator.evaluate(preds)
        print(f"{metric.upper()} = {score:.4f}")

    spark.stop()

if __name__ == "__main__":
    main()