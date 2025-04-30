from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.sql.functions import col
from pyspark.sql.types import StructType, StructField, IntegerType, FloatType, StringType

# ====================== INITIALISATION ======================
spark = SparkSession.builder \
    .appName("TrainALSModel") \
    .master("spark://namenode:7077") \
    .config("spark.cassandra.connection.host", "cassandra") \
    .config("spark.executor.memory", "2g") \
    .config("spark.driver.memory", "2g") \
    .config("spark.executor.cores", "2") \
    .getOrCreate()
    
# ====================== CHARGEMENT DES DONNÉES ======================
ratings_schema = StructType([
    StructField("userId", IntegerType(), True),
    StructField("movieId", IntegerType(), True),
    StructField("rating", FloatType(), True),
    StructField("timestamp", StringType(), True),
])

movies_schema = StructType([
    StructField("movieId", IntegerType(), True),
    StructField("title", StringType(), True),
    StructField("genres", StringType(), True),
])

print("📥 Lecture des fichiers CSV depuis HDFS...")

ratings_df = spark.read.csv("hdfs:///input/rating.csv", header=True, schema=ratings_schema)
movies_df = spark.read.csv("hdfs:///input/movie.csv", header=True, schema=movies_schema)

# ====================== DIVISION TRAIN / TEST ======================
train_df, test_df = ratings_df.randomSplit([0.8, 0.2], seed=42)

# ====================== ENTRAÎNEMENT ======================
print("🤖 Entraînement du modèle ALS...")

als = ALS(
    userCol="userId",
    itemCol="movieId",
    ratingCol="rating",
    nonnegative=True,
    implicitPrefs=False,
    coldStartStrategy="drop",  # pour éviter les NaN en test
    rank=12,
    maxIter=15,
    regParam=0.05
)

model = als.fit(train_df)

# ====================== ÉVALUATION ======================
print("📊 Évaluation du modèle...")

predictions = model.transform(test_df)

evaluator = RegressionEvaluator(
    metricName="rmse",
    labelCol="rating",
    predictionCol="prediction"
)
rmse = evaluator.evaluate(predictions)

print(f"✅ RMSE sur l'ensemble test : {rmse:.4f}")

# ====================== ENREGISTREMENT ======================
print("💾 Sauvegarde du modèle dans HDFS (/models/als)...")

model.write().overwrite().save("hdfs:///models/als")

print("🎉 Modèle entraîné et sauvegardé avec succès.")