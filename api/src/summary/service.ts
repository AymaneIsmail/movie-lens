import { client } from "@/database.js";
import type { Summary, SummaryRequest } from "@/summary/types.js";

export async function getSummary(req: SummaryRequest): Promise<Summary> {
  const { minscore, genres = [] } = req;

  // ① filtre WHERE selon minscore / genres
  let where = "WHERE score >= ?";
  const params: unknown[] = [minscore];

  if (req.userId) {
    where += " AND userId = ?";
    params.push(req.userId);
  }

  // TODO: Cannot use CONTAINS on non-collection column genres. Passer la colonne genres en set<text> dans la base de données
  // if (Array.isArray(genres) && genres.length) {
  //   where += " AND genres CONTAINS ?"; // indexé sur set<text>
  //   params.push(genres[0]); // boucle si plusieurs
  // }

  const totalQ = await client.execute(
    `SELECT count(*) FROM recommendations ${where} ALLOW FILTERING`,
    params,
    { prepare: true }
  );
  const total = totalQ.first()["count"];

  // moyenne + min(rank)
  const aggQ = await client.execute(
    `SELECT avg(score) AS avgScore, max(score) AS bestRank FROM recommendations ${where} ALLOW FILTERING`,
    params,
    { prepare: true }
  );

  const genreQ = await client.execute(
    `SELECT genres FROM recommendations ${where} ALLOW FILTERING`,
    params,
    { prepare: true }
  );

  const genreSet = new Set<string>();
  genreQ.rows.forEach((r) =>
    r["genres"].split("|").forEach((g: string) => genreSet.add(g))
  );

  // total global (sans WHERE) pour « out of X »
  const globalTotalQ = await client.execute(
    "SELECT count(*) FROM recommendations",
    [],
    { prepare: true }
  );
  const globalTotal = globalTotalQ.first()["count"];

  return {
    collectionTotal: total,
    globalTotal,
    avgScore: aggQ.first()["avgscore"] ?? 0,
    bestRank: aggQ.first()["bestrank"] ?? null,
    uniqueGenres: genreSet.size,
  };
}
