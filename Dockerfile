FROM ubuntu:22.04

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    openjdk-11-jdk \
    python3 \
    python3-pip \
    wget \
    curl \
    git \
    net-tools \
    iputils-ping \
    nano \
    gnupg \
    lsb-release \
    openssh-client \
    openssh-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Définir JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# Installer Hadoop
ENV HADOOP_VERSION=3.3.6
RUN wget https://downloads.apache.org/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xvzf hadoop-${HADOOP_VERSION}.tar.gz && \
    mv hadoop-${HADOOP_VERSION} /opt/hadoop && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

ENV HADOOP_HOME=/opt/hadoop
ENV PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

# Installer Spark
ENV SPARK_VERSION=3.5.1
RUN wget https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    tar -xvzf spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    mv spark-${SPARK_VERSION}-bin-hadoop3 /opt/spark && \
    rm spark-${SPARK_VERSION}-bin-hadoop3.tgz

ENV SPARK_HOME=/opt/spark
ENV PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin

# Installer Kafka
ENV KAFKA_VERSION=3.7.2
RUN wget https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_2.13-${KAFKA_VERSION}.tgz && \
    tar -xvzf kafka_2.13-${KAFKA_VERSION}.tgz && \
    mv kafka_2.13-${KAFKA_VERSION} /opt/kafka && \
    rm kafka_2.13-${KAFKA_VERSION}.tgz

ENV KAFKA_HOME=/opt/kafka
ENV PATH=$PATH:$KAFKA_HOME/bin

# Copier requirements.txt en avance pour profiter du cache Docker
COPY requirements.txt /tmp/requirements.txt

# Installer les paquets Python
RUN pip3 install --upgrade pip && \
    pip3 install -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# Copier les fichiers de configuration Hadoop
COPY config/hadoop/core-site.xml $HADOOP_HOME/etc/hadoop/core-site.xml
COPY config/hadoop/hdfs-site.xml $HADOOP_HOME/etc/hadoop/hdfs-site.xml
COPY config/hadoop/mapred-site.xml $HADOOP_HOME/etc/hadoop/mapred-site.xml
COPY config/hadoop/yarn-site.xml $HADOOP_HOME/etc/hadoop/yarn-site.xml

# Créer les dossiers pour Hadoop
RUN mkdir -p /opt/hadoop_data/hdfs/namenode && \
    mkdir -p /opt/hadoop_data/hdfs/datanode

# Exposer les ports nécessaires
EXPOSE 8888

# Démarrer Jupyter Notebook
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--allow-root", "--NotebookApp.token=''", "--NotebookApp.password=''"]
