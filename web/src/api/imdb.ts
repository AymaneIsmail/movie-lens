export interface ImdbMovie {
  "#TITLE": string;
  "#YEAR": number;
  "#IMDB_ID": string;
  "#RANK": number;
  "#ACTORS": string;
  "#AKA": string;
  "#IMDB_URL": string;
  "#IMDB_IV": string;
  "#IMG_POSTER": string;
  photo_width: number;
  photo_height: number;
}

export interface ImdbApiResponse {
  ok: boolean;
  error_code: number;
  description: ImdbMovie[];
}

export async function fetchImdbMovie(title: string): Promise<ImdbMovie | null> {
  try {
    const searchParams = new URLSearchParams({ q: title });
    const response = await fetch(
      `https://imdb.iamidiotareyoutoo.com/search?${searchParams.toString()}`
    );
    const data: ImdbApiResponse = await response.json();
    const movie = data.description.at(0);

    if (!data.ok || !movie) return null;
    return movie;
  } catch {
    return null;
  }
}
