export interface Summary {
  collectionTotal: number;
  globalTotal: number;
  avgScore: number;
  bestRank: number | null;
  uniqueGenres: number;
}

export interface SummaryRequest {
  minscore?: number;
  genres?: string[];
}

export async function fetchSummary(params: SummaryRequest): Promise<Summary> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((val) => qs.append(k, String(val)));
    else qs.append(k, String(v));
  });

  const res = await fetch(`http://localhost:3000/summary?${qs.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch summary");

  return res.json();
}
