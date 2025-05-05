build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

clean:
	docker compose down --rmi all --volumes --remove-orphans
	docker system prune -af

shell:
	docker exec -it hadoop-namenode sh

init: hdfs-configure hdfs-upload-csv cassandra-configure
	@echo "HDFS and Cassandra initialized."

hdfs-configure:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs-configure.sh

hdfs-clean:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs-clean.sh

hdfs-upload-csv:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs-upload-csv.sh

hdfs-download-log:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs-download-log.sh

cassandra-configure:
	docker exec -it cassandra bash /root/scripts/cassandra-configure.sh

als-train:
	docker exec -it hadoop-namenode python3 /root/scripts/movies/als_training.py

kafka-run: kafka-produce kafka-stream
	@echo "Kafka producer and stream started."

kafka-produce:
	docker exec -it hadoop-namenode python3 /root/scripts/demo/kafka_producer.py

kafka-stream:
	docker exec -it hadoop-namenode python3 /root/scripts/movies/als_kafka_streaming.py