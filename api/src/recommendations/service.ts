import type { QueryOptions } from "cassandra-driver";
import type {
  RecommendationsRequest,
  RecommendationsResponse,
  QueryWithParams,
} from "@/recommendations/types.js";
import { client } from "@/database.js";
import { mapResultSetToRecommendationResponse } from "@/recommendations/mappers.js";

function buildQueryOptions(req: RecommendationsRequest): QueryOptions {
  return {
    prepare: true,
    fetchSize: req.pagesize,
    pageState: req.pagestate,
  };
}

function buildRecommendationsQuery(
  req: RecommendationsRequest,
  type: "recommendations" | "count" = "recommendations"
): QueryWithParams {
  let query = "SELECT * FROM recommendations";

  if (type === "count") {
    query = "SELECT count(*) FROM recommendations";
  }

  const params: unknown[] = [];
  const where: string[] = [];

  if (req.userid !== undefined) {
    where.push(`userid = ?`);
    params.push(req.userid);
  }

  if (req.movieid !== undefined) {
    where.push(`movieid = ?`);
    params.push(req.movieid);
  }

  if (req.minscore !== undefined) {
    where.push(`score >= ?`);
    params.push(req.minscore);
  }

  if (where.length > 0) {
    query = `${query} WHERE ${where.join(" AND ")}`;
  }

  if (req.userid !== undefined) {
    query = `${query} ORDER BY rank ASC`;
  }

  // enlever en prod
  query = `${query} ALLOW FILTERING`;

  return { query, params };
}

async function getRecommendationsTotalCount(
  req: RecommendationsRequest
): Promise<number> {
  const { query, params } = buildRecommendationsQuery(req, "count");
  const result = await client.execute(query, params, { prepare: true });
  return result.first()["count"];
}

export async function getRecommendations(
  req: RecommendationsRequest
): Promise<RecommendationsResponse> {
  const { query, params } = buildRecommendationsQuery(req);
  const options = buildQueryOptions(req);

  const result = await client.execute(query, params, options);
  const totalCount = await getRecommendationsTotalCount(req);

  return mapResultSetToRecommendationResponse(result, totalCount);
}
