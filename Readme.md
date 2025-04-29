# Big Data Pseudo-distributed Environment with Hadoop, Spark, Kafka, Python, and Jupyter

## 🌍 Project Overview
This project provides a ready-to-use Dockerized environment to work with:
- **Hadoop 3.3.6** (pseudo-distributed)
- **Spark 3.5.1** (standalone mode)
- **Kafka 3.6.1** (with Zookeeper)
- **Python 3** + **PySpark**
- **Jupyter Notebook**

## 📊 Architecture
- Hadoop HDFS for distributed file storage (single-node setup)
- Spark for batch and streaming data processing
- Kafka for streaming ingestion
- Python environment with Jupyter for development and experimentation

## 🔧 Project Structure
```
/
|-- data
    |-- genome_scores.csv
    |-- genome_tags.csv
    |-- link.csv
    |-- movie.csv
    |-- rating.csv
    |-- tag.csv
|-- Dockerfile
|-- compose.yml
|-- Makefile
|-- requirements.txt
|-- config/
|   |-- hadoop/
|       |-- core-site.xml
|       |-- hdfs-site.xml
|       |-- mapred-site.xml
|       |-- yarn-site.xml
|       |-- hadoop-env.sh
|       |-- log4j.properties
|       |-- slaves
|   |-- spark/
|       |-- spark-default.conf
|       |-- spark-env.sh
|       |-- workers
|   |-- ssh/
|       |-- ssh_config
|-- notebooks/
|   |-- spark_kafka_demo.ipynb
|-- scripts/
    |-- hdfs
      |-- hdfs_directory_setup.sh
      |-- import_csv_to_hdfs.sh
    |-- spark_batch_csv_count.py
    |-- start-cluster.sh
```

## 🔄 Quick Start

### 1. Build the Docker Image
```bash
make build
```

### 2. Launch the Environment
```bash
make up
```

This will start:
- Hadoop HDFS & YARN
- Spark Master + Workers
- Kafka + Zookeeper
- Jupyter Notebook (accessible on http://localhost:8888)

### 3. Access the Container
```bash
make shell
```

### 4. Shut Down
```bash
make down
```

### 5. Clean Everything (containers, images, volumes)
```bash
make clean
```

## 🎬 Download MovieLens Dataset

### Automatic Download (Kaggle)
- Use the `download_kaggle_dataset.sh` script to download and extract the MovieLens dataset from Kaggle. Before running it, make sure to enter your Kaggle credentials (`KAGGLE_USERNAME` and `KAGGLE_KEY`) in the script. You can generate an API key from your Kaggle account: [https://www.kaggle.com/settings](https://www.kaggle.com/settings).
  ```bash
  sh ./data/download_kaggle_dataset.sh
  ```

## 📂 HDFS Setup

  Before using HDFS, you need to set up the necessary directories and import your datasets. Use the provided scripts for this:

1. **Set up HDFS directories**:
   Run the `hdfs_directory_setup.sh` script to create the required directories in HDFS.
  ```bash
   sh ./scripts/hdfs/hdfs_directory_setup.sh
  ```

  2. **Import datasets into HDFS**: Use the import_csv_to_hdfs.sh script to upload your CSV files to HDFS.
   ```bash
   sh ./scripts/hdfs/import_csv_to_hdfs.sh
  ```

  ### Explanation

  ### Explanation
  Structure de Dossiers HDFS :
  / (HDFS Root)
  |-- errors/
  |   |-- 2025-04-28/      # Dossier des erreurs avec date
  |
  |-- input/               # Dossier pour les fichiers CSV
  |   |-- rating.csv       # Fichier CSV
  |   |-- movie.csv        # Fichier CSV
  |
  |-- logs/
  |   |-- 2025-04-28/      # Dossier des logs avec date
  |
  |-- processed/           # Dossier des fichiers traités

- **`hdfs_directory_setup.sh`**: This script creates the necessary directory structure in HDFS.
- **`import_csv_to_hdfs.sh`**: This script uploads your CSV files into the `/datasets` directory in HDFS.

This ensures that users know how to initialize HDFS properly before running other components of the project.

## 📄 Notebooks & Scripts
- **spark_kafka_demo.ipynb** : Connects Spark Structured Streaming to a Kafka topic and displays the streamed data.
- **spark_batch_csv_count.py** : A simple Spark batch job reading a CSV file from HDFS and counting rows.

## 🔔 Notes
- Hadoop HDFS Web UI: [http://localhost:9870](http://localhost:9870)
- Ensure you manually create Kafka topics using:
  ```bash
  kafka-topics.sh --create --topic test-topic --bootstrap-server localhost:9092
  ```
- Upload datasets to HDFS:
  ```bash
  hdfs dfs -mkdir -p /datasets
  hdfs dfs -put your_file.csv /datasets/
  ```

---

Made with ❤️ by ABDELHAY, SOFIANE et AYMANE
