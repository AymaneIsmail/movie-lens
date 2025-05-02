import type { types } from "cassandra-driver";
import type { GetRecommendationsResponse, Recommendation } from "@/recommendations/types.js";

export function mapResultSetToRecommendations(
  resultSet: types.ResultSet
): Recommendation[] {
  return resultSet.rows.map((row) => ({
    userid: row.userid,
    movieid: row.movieid,
    score: row.score,
    rank: row.rank,
    title: row.title,
    genres: row.genres.split("|"),
  }));
}

export function mapResultSetToRecommendationResponse(
  resultSet: types.ResultSet
): GetRecommendationsResponse {
  return {
    items: mapResultSetToRecommendations(resultSet),
    pageState: resultSet.pageState ?? null,
  };
}
