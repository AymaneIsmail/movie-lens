# Movie Lens Recommendations

## 🌍 Project Overview

This project provides a complete pseudo-distributed environment for Big Data processing, enabling:

* **Batch & streaming** data processing
* **Machine Learning model training (ALS)**
* **Real-time recommendations with Kafka & Cassandra**
* **Exploration and prototyping using Jupyter notebooks**

### Technologies Included

* **Hadoop 3.3.6** (HDFS, YARN)
* **Spark 3.5.1** (Standalone)
* **Kafka 3.6.1 + Zookeeper**
* **Python 3 + PySpark**
* **Cassandra** (NoSQL)
* **Jupyter Notebook**

---

## 📊 Architecture Overview

### Data Flow

```
[Kafka Producer] --> [Kafka Topic] --> [Spark Structured Streaming] --> [ALS Model Prediction] --> [Cassandra]
                                               \
                                                └--> [Jupyter Notebook] --> [Exploration/Analysis]
```

### Accessible Ports

| Service       | URL / Port                                       | Description                    |
| ------------- | ------------------------------------------------ | ------------------------------ |
| Jupyter       | [http://localhost:8888](http://localhost:8888)   | Python interactive development |
| Spark UI      | [http://localhost:4040](http://localhost:4040)   | Spark driver UI (batch jobs)   |
| Spark History | [http://localhost:18080](http://localhost:18080) | Historical Spark jobs          |
| Kafka UI      | [http://localhost:8085](http://localhost:8085)   | Kafka monitoring (if enabled)  |

---

## 📁 Project Structure

```
/
|-- data/                         # Raw CSV data mounted into containers
|-- Dockerfile                    # Hadoop/Spark base image
|-- compose.yml                   # Docker Compose configuration
|-- Makefile                      # CLI tasks (see below)
|-- requirements.txt              # Python dependencies

|-- config/
|   |-- hadoop/                   # Hadoop configuration
|   |-- spark/                    # Spark configuration (spark-defaults.conf, etc.)
|   |-- ssh/                      # SSH config

|-- notebooks/                    # Jupyter notebooks
|   |-- spark_kafka_demo.ipynb

|-- scripts/
    |-- demo/
    |   |-- kafka_producer.py      # Simulate streaming ingestion from CSV
    |-- movies/
    |   |-- als_kafka_streaming.py # Real-time inference from Kafka + Cassandra
    |   |-- als_training.py        # Training the ALS recommender model
    |   |-- als_hypertuning.py     # ALS parameter hypertuning
    |-- cassanda-configure.sh      # Initialize Cassandra tables
    |-- hdfs-clean.sh              # Cleanup HDFS directory tree
    |-- hdfs-configure.sh          # Initialize HDFS directory tree
    |-- hdfs-download-log.sh       # Download latest log file
    |-- hdfs-upload-csv.sh         # Upload CSV files to HDFS
    |-- hdfs-utils.sh              # Common HDFS configuration and utils
    |-- kafka-topics.sh            # Initialize Kafka topics
    |-- service-start.sh           # Cluster entrypoint per service
    |-- service-wait.sh            # Wait until a service is ready
```

### HDFS Folder Structure

```
/ (HDFS root)
|-- input/              # Ingested movie/rating CSV files
|-- models/             # Saved Spark ML models (ALS)
|-- logs/               # Logs generated during processing
|-- processed/          # Moved files after processing
|-- errors/             # Files with errors
|-- tmps/               # Temporary checkpoint data
```

---

## ⚒️ Setup & Commands

### 1. Build Docker Image

```bash
make build
```

### 2. Start the Cluster

```bash
make up
```

* Starts all services in detached mode

### 3. Initialize HDFS + Cassandra + Upload Data

```bash
make init
```

* Creates HDFS folders
* Uploads data from `/data` to `/input` in HDFS
* Creates Cassandra keyspace + table

### 4. Shutdown the Cluster

```bash
make down
```

### 5. Cleanup Everything

```bash
make clean
```

* Removes containers, volumes, and networks

### 6. Shell Access (for debugging)

```bash
make shell
```

* Open a shell inside the NameNode container

---

## 🔧 HDFS Management Scripts

### Configure Folder Structure

```bash
make hdfs-configure
```

Runs `hdfs-configure.sh` to create:

* Test the HDFS connection
* `/input`, `/logs`, `/models`, etc.

### Clean Up All HDFS Folders

```bash
make hdfs-clean
```

Deletes all contents via `hdfs-clean.sh`

### Upload CSV Files

```bash
make hdfs-upload-csv
```

Pushes all `.csv` files from local `/data/` to HDFS `/input/` with logging

### Download HDFS Log

```bash
make hdfs-download-log
```

Downloads the latest log file from `/logs` into local `/data/`

---

## 📓 Cassandra Management

### Create Keyspace and Table

```bash
make cassandra-configure
```

* Keyspace: `reco`
* Table: `recommendations(userId, movieId, score, title, genres)`
* Uses `PRIMARY KEY (userId, movieId)` to enable upserts

---

## 🧰 Model & Streaming Jobs

### Train ALS Model (batch)

```bash
make als-train
```

* Reads `/input/rating.csv`
* Saves ALS model to HDFS under `/models/als`

### Simulate Real-Time Ratings (Kafka Producer)

```bash
make kafka-produce
```

* Reads historical ratings line-by-line and pushes to Kafka topic
* Topic: `movielens_ratings`

### Start Real-Time Inference Engine (Kafka + ALS + Cassandra)

```bash
make kafka-stream
```

* Consumes Kafka ratings
* Loads ALS model
* Predicts Top-N recommendations per user
* Joins movie metadata
* Saves recommendations to Cassandra in table `recommendations`

---

## 📽️ Jupyter Notebook Access

Once the cluster is up, access Jupyter via:

```
http://localhost:8888
```

Use it to:

* Explore HDFS data
* Load Spark models
* Query Cassandra
* Visualize recommendations

---

## 💾 Dataset: MovieLens

You can use the built-in downloader to fetch the dataset directly from Kaggle:

```bash
sh ./data/download_kaggle_dataset.sh
```

Make sure to set your Kaggle credentials (`KAGGLE_USERNAME`, `KAGGLE_KEY`) in the script or environment.

Dataset includes:

* `ratings.csv`
* `movies.csv`
* `tags.csv`
* etc.

---

Made with ❤️ by ABDELHAY, SOFIANE & AYMANE
