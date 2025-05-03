import { useState, useEffect } from "react"
import { Film } from "lucide-react"
import type { Recommendation } from "@/api/types"
import FilmCard from "./film-card"

// Fonction pour récupérer l'affiche du film
const fetchPoster = async (title: string) => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY
    const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`)
    console.log(apiKey)
    console.log(response)
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'affiche du film")
  }

  const data = await response.json()
  console.log(data) // Affiche les données récupérées pour le débogage
  if (data.Response === "False") {
    throw new Error("Film non trouvé")
  }

  return data.Poster // Retourne l'URL de l'affiche
}

export default function FilmList({ films }: { films: Recommendation[] }) {
  const [posters, setPosters] = useState<{ [key: string]: string }>({}) // Un état pour stocker les affiches des films
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer les affiches des films après que les films soient chargés
  useEffect(() => {
    const loadPosters = async () => {
        console.log('Loading posters...')
      setLoading(true)
      try {
        const newPosters: { [key: string]: string } = {}
        for (const film of films) {
            console.log(`Fetching poster for ${film.title}...`)
          try {
            const poster = await fetchPoster(film.title)
            console.log(`Poster URL: ${poster}`)
            newPosters[film.movieid] = poster
          } catch (err: any) {
            console.error(`Error fetching poster for ${film.title}: ${err.message}`)
            newPosters[film.movieid] = "/placeholder.svg"
          }
        }
        setPosters(newPosters)
        setLoading(false)
      } catch (err: any) {
        setError("Erreur lors de la récupération des affiches")
        setLoading(false)
      }
    }

    loadPosters()
  }, [films])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="rounded-full bg-muted p-3">
            <Film className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Loading...</h3>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center text-red-500">
          <h3 className="mt-4 text-lg font-semibold">Error: {error}</h3>
        </div>
      </div>
    )
  }

  if (films.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Film className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No films found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {films.map((film) => (
        <FilmCard
          key={film.movieid}
          title={film.title}
          genres={film.genres}
          score={film.score}
          rank={film.rank}
          imageUrl={posters[film.movieid] || "/placeholder.svg"} // Utilise l'image récupérée ou une image par défaut
        />
      ))}
    </div>
  )
}
