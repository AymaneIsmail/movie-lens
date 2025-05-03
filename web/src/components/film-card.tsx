import { useState } from "react"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface FilmCardProps {
  title: string
  genres: string[]
  score: number
  rank: number
  imageUrl: string
}

export default function FilmCard({ title, genres, score, rank, imageUrl }: FilmCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2">
          <div className="bg-background/90 text-foreground font-medium rounded-md px-2 py-1 text-xs shadow-sm">
            Rank #{rank}
          </div>
        </div>

        <div className="absolute top-2 right-2">
          <div className="bg-yellow-500/90 text-yellow-950 font-medium rounded-md px-2 py-1 flex items-center gap-1 text-xs shadow-sm">
            <Star className="h-3 w-3 fill-current" />
            <span>{score.toFixed(1)}</span>
          </div>
        </div>

        {/* Info overlay that slides up on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent flex flex-col justify-end p-4 transition-all duration-500 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-[30%] opacity-90"}`}
        >
          <h3 className="text-foreground text-lg font-bold mb-2 line-clamp-2">{title}</h3>
          <div className="flex flex-wrap gap-1 mb-3">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {genres.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{genres.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats that animate in on hover */}
          <div
            className={`grid gap-2 transition-all duration-700 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-yellow-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(score / 10) * 100}%`, transitionDelay: "200ms" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Score</span>
              <span>{score}/10</span>
            </div>

            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (1 / rank) * 100 * 5)}%`, transitionDelay: "400ms" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rank</span>
              <span>#{rank}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
