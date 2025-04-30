from contextlib import contextmanager
from pyspark.sql import SparkSession

@contextmanager
def spark_session(app_name="Notebook"):
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