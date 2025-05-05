import type { types } from "cassandra-driver";
import type { RecommendationsResponse, Recommendation } from "@/recommendations/types.js";

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
    imdbid: row.imdbid,
    tmdbid: row.tmdbid,
  }));
}

export function mapResultSetToRecommendationResponse(
  resultSet: types.ResultSet,
  totalCount: number
): RecommendationsResponse {
  return {
    items: mapResultSetToRecommendations(resultSet),
    totalCount,
    pageState: resultSet.pageState ?? null,
  };
}
