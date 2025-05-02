export interface Recommendation {
  userid: string;
  movieid: string;
  score: number;
  rank: number;
  title: string;
  genres: string[];
}

export interface PaginationRequest {
  pagesize: number;
  pagestate?: string;
}

export interface GetRecommendationsRequest extends PaginationRequest {
  userid?: number;
  movieid?: number;
  minscore?: number;
}

export interface GetRecommendationsResponse {
  items: Recommendation[];
  pageState: string | null;
}

export interface QueryWithParams {
  query: string;
  params: unknown[];
}
