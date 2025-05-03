import { BarChart3, Film, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Recommendation } from "@/api/types"

export default function StatsCards({
  films,
  filtered,
}: {
  films: Recommendation[]
  filtered: Recommendation[]
}) {
  const avgScore = filtered.length ? filtered.reduce((sum, film) => sum + film.score, 0) / filtered.length : 0

  const topRanked = filtered.length
    ? filtered.reduce((min, film) => (film.rank < min ? film.rank : min), Number.POSITIVE_INFINITY)
    : 0

  const uniqueGenres = new Set<string>()
  filtered.forEach((film) => film.genres.forEach((genre) => uniqueGenres.add(genre)))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Films</CardTitle>
          <Film className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filtered.length}</div>
          <p className="text-xs text-muted-foreground mt-1">out of {films.length} in collection</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgScore.toFixed(1)}</div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
            <div className="h-full rounded-full bg-yellow-500" style={{ width: `${(avgScore / 10) * 100}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Ranked</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{topRanked === Number.POSITIVE_INFINITY ? "-" : topRanked}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {topRanked === Number.POSITIVE_INFINITY
              ? "No films in selection"
              : `Top ${Math.round((topRanked / films.length) * 100)}% of all films`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Genres</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueGenres.size}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {uniqueGenres.size === 1 ? "genre" : "unique genres"} in selection
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
