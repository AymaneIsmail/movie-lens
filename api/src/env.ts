import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3000),
    CASSANDRA_HOST: z.string().default("localhost"),
    CASSANDRA_PORT: z.coerce.number().default(9042),
    CASSANDRA_DC: z.string().default("datacenter1"),
    CASSANDRA_KEYSPACE: z.string().default("reco"),
  },
  runtimeEnv: process.env,
});
