"use client"

import { useState } from "react"
import { fakeRecommendations } from "@/api/fakeData"
import DashboardLayout from "@/components/dashboard-layout"
import FilterPanel, { type Filters } from "@/components/filter-panel"
import FilmList from "@/components/film-list"
import StatsCards from "@/components/stats-card"

export default function DashboardPage() {
  const [filters, setFilters] = useState<Filters>({
    genres: [],
    minScore: 0,
  })

  const filtered = fakeRecommendations.filter((film) => {
    const matchesGenres = filters.genres.length === 0 || film.genres.some((g) => filters.genres.includes(g))
    return matchesGenres && film.score >= filters.minScore
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Film Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage and explore your film collection with advanced filtering.</p>
        </div>

        <StatsCards films={fakeRecommendations} filtered={filtered} />

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Film Collection</h2>
            <span className="text-sm text-muted-foreground">
              Showing {filtered.length} of {fakeRecommendations.length} films
            </span>
          </div>
          <FilmList films={filtered} />
        </div>
      </div>
    </DashboardLayout>
  )
}
