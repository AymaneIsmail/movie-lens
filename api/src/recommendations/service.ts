import type { QueryOptions } from "cassandra-driver";
import type {
  GetRecommendationsRequest,
  GetRecommendationsResponse,
  QueryWithParams,
} from "@/recommendations/types.js";
import { client } from "@/database.js";
import { mapResultSetToRecommendationResponse } from "@/recommendations/mappers.js";

function buildQueryOptions(req: GetRecommendationsRequest): QueryOptions {
  return {
    prepare: true,
    fetchSize: req.pagesize,
    pageState: req.pagestate,
  };
}

function buildRecommendationsQuery(
  req: GetRecommendationsRequest
): QueryWithParams {
  let query = "SELECT * FROM recommendations";
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

  return { query, params };
}

export async function getRecommendations(
  req: GetRecommendationsRequest
): Promise<GetRecommendationsResponse> {
  const { query, params } = buildRecommendationsQuery(req);
  console.log({ req, query, params });
  const options = buildQueryOptions(req);

  const result = await client.execute(query, params, options);

  return mapResultSetToRecommendationResponse(result);
}
