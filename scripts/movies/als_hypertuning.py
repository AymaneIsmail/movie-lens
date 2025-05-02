# --------------------------------------------------------------------------------------
# Modifications apportées pour éviter l'erreur "java.lang.OutOfMemoryError: Java heap space":
# 1. Configuration des ressources Spark :
#    - Réduction de la mémoire du driver à 3 Go (`spark.driver.memory`).
#    - Allocation de 10 exécutants avec 2 cœurs chacun et 1 Go de mémoire par exécutant 
#      (`spark.executor.instances`, `spark.executor.cores`, `spark.executor.memory`).
# 2. Activation de la sérialisation Kryo pour une gestion plus efficace de la mémoire 
#    (`spark.serializer`).
# 3. Définition d'un répertoire de checkpoint pour limiter la longueur de la lignée des RDDs 
#    et éviter les fuites de mémoire (`spark.sparkContext.setCheckpointDir("/tmp")`).
# 4. Ajustement du nombre de partitions des données pour une meilleure parallélisation 
#    (`ratings.repartition(200)`).
# --------------------------------------------------------------------------------------

from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.tuning import ParamGridBuilder, CrossValidator

# ————————————————
hdfs_prefix = "hdfs:///"  

# Chemins relatifs
ratings_path = f"{hdfs_prefix}/processed/rating.csv"
movies_path  = f"{hdfs_prefix}/processed/movie.csv"

# Train/test split
train_ratio = 0.8
# ————————————————

def main():
    print(f"► ratings = {ratings_path}")
    print(f"► movies  = {movies_path or '— pas de metadata —'}")
    print(f"► Train/Test split = {train_ratio:.2f}/{1-train_ratio:.2f}\n")

    # 1. Démarrage Spark
    spark = SparkSession.builder \
        .appName("ALS Hyperparameter Tuning") \
        .config("spark.executor.instances", "10") \
        .config("spark.executor.cores", "2") \
        .config("spark.executor.memory", "1g") \
        .config("spark.driver.memory", "3g") \
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
        .getOrCreate()

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
    ).repartition(200)

    # 3. Lecture des films si définis
    if movies_path:
        movies = spark.read.option("header", True).csv(movies_path)
        print("Aperçu des films :")
        movies.show(5, truncate=False)

    # 4. Split train/test
    train, test = ratings.randomSplit([train_ratio, 1-train_ratio], seed=42)
    print(f"Count → train: {train.count()}, test: {test.count()}")

    # 5. Modèle ALS de base
    als = ALS(
        userCol="userId",
        itemCol="movieId",
        ratingCol="rating",
        coldStartStrategy="drop",
        nonnegative=True
    )

    # 6. Grille d'hyperparamètres
    param_grid = ParamGridBuilder() \
        .addGrid(als.rank, [8, 10, 12]) \
        .addGrid(als.regParam, [0.05, 0.1, 0.2]) \
        .addGrid(als.maxIter, [10, 15]) \
        .build()

    # 7. Évaluateur RMSE
    evaluator = RegressionEvaluator(
        metricName="rmse",
        labelCol="rating",
        predictionCol="prediction"
    )

    # 8. CrossValidator
    crossval = CrossValidator(
        estimator=als,
        estimatorParamMaps=param_grid,
        evaluator=evaluator,
        numFolds=3,
        parallelism=2
    )

    # 9. Entraînement + sélection des meilleurs hyperparamètres
    cv_model = crossval.fit(train)
    best_model = cv_model.bestModel

    print("\n✔️ Meilleurs hyperparamètres trouvés :")
    print("  → rank     =", best_model.rank)
    print("  → regParam =", best_model._java_obj.parent().getRegParam())
    print("  → maxIter  =", best_model._java_obj.parent().getMaxIter())

    # 10. Évaluation finale sur test
    preds = best_model.transform(test)
    rmse = evaluator.evaluate(preds)
    print(f"\n📉 RMSE sur le test set = {rmse:.4f}")

    spark.stop()

if __name__ == "__main__":
    main()
