import { fetchImdbMovie } from "@/api/imdb";
import { Recommendation } from "@/api/recommendations";
import { useQueries } from "@tanstack/react-query";

export function useMoviePosters(movies: Recommendation[]) {
  const queries = useQueries({
    queries: movies.map((movie) => ({
      queryKey: ["poster", movie.title],
      queryFn: () => fetchImdbMovie(movie.title),
      staleTime: 1000 * 60 * 60, // 1h cache
      retry: 1,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const posters: Record<string, string> = {};
  queries.forEach((q, idx) => {
    const film = movies[idx];
    if (q.data) {
      // Priorité à l'affiche haute définition si dispo, sinon URL IMDb
      posters[film.movieid] = q.data["#IMG_POSTER"] || q.data["#IMDB_URL"];
    } else {
      posters[film.movieid] = "/placeholder.svg";
    }
  });

  return { posters, isLoading, isError };
}
