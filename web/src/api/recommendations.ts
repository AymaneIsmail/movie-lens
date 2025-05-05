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

export interface RecommendationsRequest {
  userid?: number;
  movieid?: number;
  minscore?: number;
  pagesize: number;
  pagestate?: string;
}

export interface RecommendationsResponse {
  items: Recommendation[];
  totalCount: number;
  pageState: string | null;
}

export async function fetchRecommendations(
  params: RecommendationsRequest
): Promise<RecommendationsResponse> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((val) => qs.append(k, String(val)));
    else qs.append(k, String(v));
  });

  const res = await fetch(
    `http://localhost:3000/recommendations?${qs.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch recommendations");

  return res.json();
}
