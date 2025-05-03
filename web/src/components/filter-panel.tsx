"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export interface Filters {
  genres: string[]
  minScore: number
}

interface FilterPanelProps {
  filters: Filters
  onChange: (f: Filters) => void
}

const allGenres = ["Drama", "Action", "Crime", "Thriller", "Sci-Fi", "Comedy", "Romance", "Horror"]

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const toggleGenre = (genre: string) => {
    const genres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre]
    onChange({ ...filters, genres })
  }

  const handleScoreChange = (value: number[]) => {
    onChange({ ...filters, minScore: value[0] })
  }

  const clearFilters = () => {
    onChange({ genres: [], minScore: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Genres</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  Select Genres
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Film Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allGenres.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre}
                    checked={filters.genres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                  >
                    {genre}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.genres.length > 0 ? (
              filters.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                  <span className="ml-1 rounded-full bg-muted-foreground/20 px-1 text-xs">×</span>
                </Badge>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No genres selected</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="minScore" className="text-sm font-medium">
              Minimum Score: <span className="font-bold text-primary">{filters.minScore}</span>
            </label>
            <span className="text-xs text-muted-foreground">0-10</span>
          </div>
          <Slider
            id="minScore"
            min={0}
            max={10}
            step={0.5}
            value={[filters.minScore]}
            onValueChange={handleScoreChange}
            className="py-2"
          />
        </div>
      </div>

      {(filters.genres.length > 0 || filters.minScore > 0) && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
