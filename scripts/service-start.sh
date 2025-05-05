#!/bin/bash
# service: namenode, datanode, zookeeper, kafka, jupyter
SERVICE=$1

echo "🔑 Starting SSH service..."
service ssh start

if [ "$SERVICE" = "namenode" ]; then
    if [ ! -f "/home/root/hadoop/dfs/name/current/VERSION" ]; then
        echo "📦 Formatting HDFS..."
        hdfs namenode -format -force
    fi

    echo "🚀 Starting HDFS..."
    $HADOOP_HOME/sbin/start-dfs.sh

    echo "🚀 Starting YARN (ResourceManager + NodeManagers)..."
    $HADOOP_HOME/sbin/start-yarn.sh

    if ! hdfs dfs -test -d "/shared/spark-logs"; then
        echo "📂 Creating Spark History directory in HDFS..."
        hdfs dfs -mkdir -p "/shared/spark-logs"
        hdfs dfs -chmod 777 "/shared/spark-logs"
    fi

    echo "📊 Starting Spark History Server..."
    $SPARK_HOME/sbin/start-history-server.sh

elif [ "$SERVICE" = "datanode" ]; then
    echo "🚀 Starting DataNode..."
    hdfs datanode &

    echo "⏳ Waiting for NameNode..."
    /root/service-wait.sh namenode 9000 60

    echo "🚀 Starting NodeManager..."
    $HADOOP_HOME/sbin/yarn-daemon.sh start nodemanager

elif [ "$SERVICE" = "zookeeper" ]; then
    echo "🔌 Starting Zookeeper..."
    $KAFKA_HOME/bin/zookeeper-server-start.sh $KAFKA_HOME/config/zookeeper.properties

elif [ "$SERVICE" = "kafka" ]; then
    echo "🦄 Starting Kafka..."
    $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties \
        --override zookeeper.connect=zookeeper:2181 \
        --override listeners=PLAINTEXT://0.0.0.0:9092 \
        --override advertised.listeners=PLAINTEXT://kafka:9092 &

    KAFKA_PID=$!

    echo "⏳ Waiting for Kafka to be ready..."
    sleep 15

    echo "🛠 Creating Kafka topics..."
    /root/kafka-topics.sh

    wait $KAFKA_PID

elif [ "$SERVICE" = "jupyter" ]; then
    echo "📓 Starting Jupyter Notebook..."
    jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token=''

else
    echo "❌ Unknown service: $SERVICE"
    exit 1
fi

tail -f /dev/null
