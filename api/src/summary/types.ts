export interface Summary {
  collectionTotal: number;
  globalTotal: number;
  avgScore: number;
  bestRank: number | null;
  uniqueGenres: number;
}

export interface SummaryRequest {
  minscore: number;
  genres: string[];
  userId?: string;
}
