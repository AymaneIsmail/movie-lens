#!/bin/bash
# Role: namenode, datanode, zookeeper, kafka
ROLE=$1

echo "🔑 Starting SSH service..."
service ssh start

if [ "$ROLE" = "namenode" ]; then
    if [ ! -d "/home/$HDFS_NAMENODE_USER/hadoop/dfs/name" ]; then
        echo "📦 Formatting HDFS..."
        hdfs namenode -format -force
    else
        echo "📁 HDFS already formatted, skipping."
    fi

    echo "🚀 Starting HDFS..."
    $HADOOP_HOME/sbin/start-dfs.sh

    echo "🚀 Starting YARN..."
    $HADOOP_HOME/sbin/start-yarn.sh

    echo "🔍 Starting Spark..."
    $SPARK_HOME/sbin/start-master.sh

    echo "📊 Starting Spark History Server..."
    $SPARK_HOME/sbin/start-history-server.sh

    echo "📓 Starting Jupyter Notebook..."
    jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token=''

elif [ "$ROLE" = "datanode" ]; then
    echo "🚀 Starting DataNode..."
    hdfs datanode
    $SPARK_HOME/sbin/start-worker.sh spark://namenode:7077

elif [ "$ROLE" = "zookeeper" ]; then
    echo "🔌 Starting Zookeeper..."
    $KAFKA_HOME/bin/zookeeper-server-start.sh $KAFKA_HOME/config/zookeeper.properties

elif [ "$ROLE" = "kafka" ]; then
    echo "🦄 Starting Kafka..."
    $KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties

else
    echo "❌ Unknown role: $ROLE"
    exit 1
fi

tail -f /dev/null
