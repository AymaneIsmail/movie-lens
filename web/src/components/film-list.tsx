import { Film } from "lucide-react";
import FilmCard from "./film-card";
import { useMoviePosters } from "@/hooks/use-movie-posters";
import { Recommendation } from "@/api/recommendations";

interface FilmListProps {
  films: Recommendation[];
}

export function FilmList({ films }: FilmListProps) {
  const { posters, isLoading, isError } = useMoviePosters(films);

  if (isLoading) {
    return <Placeholder message="Loading…" />;
  }

  if (isError) {
    return (
      <Placeholder
        message="Erreur lors de la récupération des affiches"
        isError
      />
    );
  }

  if (films.length === 0) {
    return (
      <Placeholder
        message="No films found"
        subtitle="Try adjusting your filters to find what you're looking for."
      />
    );
  }

  // ------------------------ Render normal ------------------------------------
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {films.map((film) => (
        <FilmCard
          key={film.movieid}
          title={film.title}
          genres={film.genres}
          score={film.score}
          rank={film.rank}
          imageUrl={posters[film.movieid] ?? "/placeholder.svg"}
        />
      ))}
    </div>
  );
}

interface PlaceholderProps {
  message: string;
  subtitle?: string;
  isError?: boolean;
}

function Placeholder({ message, subtitle, isError }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-2 max-w-sm mx-auto">
      <div
        className={`rounded-full p-3 ${isError ? "bg-red-100" : "bg-muted"}`}
      >
        <Film
          className={`h-6 w-6 ${
            isError ? "text-red-500" : "text-muted-foreground"
          }`}
        />
      </div>
      <h3 className="mt-2 text-lg font-semibold {isError ? 'text-red-500' : ''}">
        {message}
      </h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
