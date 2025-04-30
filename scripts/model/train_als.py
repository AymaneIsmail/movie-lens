from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator

# 1. Initialisation de la session Spark
spark = SparkSession.builder \
    .appName("MovieLens ALS") \
    .config("spark.executor.memory", "4g") \
    .getOrCreate()

# 2. Chargement des données depuis HDFS
ratings_path = "hdfs:///processed/clean_rating.csv"
ratings = spark.read.csv(ratings_path, header=True, inferSchema=True)

# 3. Préparation des données
print("Schéma des données:")
ratings.printSchema()

print("\nAperçu des données:")
ratings.show(5)

# 4. Split train/test
(train, test) = ratings.randomSplit([0.8, 0.2], seed=42)

# 5. Configuration et entraînement du modèle ALS
als = ALS(
    rank=12,
    maxIter=15,
    regParam=0.2,
    userCol="userId",
    itemCol="movieId",
    ratingCol="rating",
    coldStartStrategy="drop"
)

model = als.fit(train)

# 6. Prédictions sur le test set
predictions = model.transform(test)

# 7. Évaluation du modèle
evaluator = RegressionEvaluator(
    metricName="rmse", 
    labelCol="rating", 
    predictionCol="prediction"
)

rmse = evaluator.evaluate(predictions)
print(f"\nRMSE du modèle: {rmse:.4f}")

# 8. Exemple de prédictions
print("\nExemple de prédictions:")
predictions.select("userId", "movieId", "rating", "prediction").show(10)

# 9. Recommandations utilisateur
user_recs = model.recommendForAllUsers(10)
print("\nRecommandations pour quelques utilisateurs:")
user_recs.show(5, truncate=False)

# 10. Recommandations films
item_recs = model.recommendForAllItems(10)
print("\nRecommandations pour quelques films:")
item_recs.show(5, truncate=False)

# Optionnel: Sauvegarde du modèle
# model.save("hdfs:///models/als_model")