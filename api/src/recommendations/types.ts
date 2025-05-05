export interface Recommendation {
  userid: string;
  movieid: string;
  score: number;
  rank: number;
  title: string;
  genres: string[];
  imdbid: string;
  tmdbid: string;
}

export interface PaginationRequest {
  pagesize: number;
  pagestate?: string;
}

export interface RecommendationsRequest extends PaginationRequest {
  userid?: number;
  movieid?: number;
  minscore?: number;
}

export interface RecommendationsResponse {
  items: Recommendation[];
  totalCount: number;
  pageState: string | null;
}

export interface QueryWithParams {
  query: string;
  params: unknown[];
}
