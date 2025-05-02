import * as cassandra from "cassandra-driver";
import { env } from "@/env.js";

export const client = new cassandra.Client({
  contactPoints: [`${env.CASSANDRA_HOST}:${env.CASSANDRA_PORT}`],
  localDataCenter: env.CASSANDRA_DC,
  keyspace: env.CASSANDRA_KEYSPACE,
});