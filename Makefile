PROJECT_NAME=bigdata-env

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

init-hdfs:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs/init_hdfs_dirs.sh

clean-hdfs:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs/clean_hdfs_dirs.sh

upload-csv:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs/upload_csv_to_hdfs.sh

get-upload-log:
	docker exec -it hadoop-namenode bash /root/scripts/hdfs/download_latest_hdfs_log.sh