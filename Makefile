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
	docker exec -it hadoop-namenode bash