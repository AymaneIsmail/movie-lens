# ========= STAGE: BASE =========
ARG JAVA_VERSION=17
FROM eclipse-temurin:${JAVA_VERSION}-jammy

WORKDIR /root
ENV DEBIAN_FRONTEND=noninteractive

# ========= INSTALL SYSTEM PACKAGES =========
RUN apt update -q && apt install -y --no-install-recommends \
    openssh-server \
    git \
    nano \
    unzip \
    python3 \
    python3-pip \
    sudo \
    wget \
    curl \
    gnupg \
    lsb-release \
    net-tools \
    iputils-ping \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

# ========= SETUP JAVA ENV =========
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH=$PATH:$JAVA_HOME/bin

# ========= SETUP PYTHON SYMLINK (si nécessaire) =========
RUN if [ -x /usr/bin/python3.11 ]; then ln -sf /usr/bin/python3.11 /usr/bin/python; fi

# ========= INSTALL HADOOP =========
ENV HADOOP_VERSION=3.4.0
RUN wget -q https://downloads.apache.org/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzf hadoop-${HADOOP_VERSION}.tar.gz && \
    mv hadoop-${HADOOP_VERSION} /usr/local/hadoop && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

ENV HADOOP_HOME=/usr/local/hadoop
ENV HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
ENV HADOOP_HDFS_HOME=$HADOOP_HOME
ENV LD_LIBRARY_PATH=$HADOOP_HOME/lib/native
ENV PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

# ========= INSTALL SPARK =========
ENV SPARK_VERSION=3.5.1
RUN wget -q https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    tar -xzf spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    mv spark-${SPARK_VERSION}-bin-hadoop3 /usr/local/spark && \
    rm spark-${SPARK_VERSION}-bin-hadoop3.tgz

ENV SPARK_HOME=/usr/local/spark
ENV SPARK_MASTER_PORT=7077
ENV PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin

# ========= INSTALL KAFKA =========
ENV KAFKA_VERSION=3.7.2
RUN wget -q https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_2.13-${KAFKA_VERSION}.tgz && \
    tar -xzf kafka_2.13-${KAFKA_VERSION}.tgz && \
    mv kafka_2.13-${KAFKA_VERSION} /opt/kafka && \
    rm kafka_2.13-${KAFKA_VERSION}.tgz

ENV KAFKA_HOME=/opt/kafka
ENV PATH=$PATH:$KAFKA_HOME/bin

# ========= INSTALL PYTHON DEPENDENCIES =========
COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --upgrade pip && \
    pip3 install -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# ========= COPY CONFIG FILES =========
COPY config/hadoop/ $HADOOP_CONF_DIR/
COPY config/spark/ $SPARK_HOME/conf/
COPY config/ssh/ssh_config /root/.ssh/config
COPY scripts/start-cluster.sh /root/start-cluster.sh

# ========= SET PERMISSIONS & CREATE FOLDERS =========
RUN chmod 600 /root/.ssh/config && \
    mkdir -p /tmp/spark-events && chmod 777 /tmp/spark-events && \
    chmod +x /root/start-cluster.sh

RUN ssh-keygen -t rsa -f /root/.ssh/id_rsa -q -N "" \
    && cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys \
    && chmod 600 /root/.ssh/authorized_keys

# ========= EXPOSE PORTS =========
# @SOFIANE vraiment besoin ?
EXPOSE 8888 9870 8088 7077 8080 2181 9092 18080 4040
