import { RecommendationsRequest } from "@/api/recommendations";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardPagination } from "@/components/dashboard-pagination";
import { FilmList } from "@/components/film-list";
import { FilterPanel } from "@/components/filter-panel";
import { StatsCards } from "@/components/stats-card";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useDeferredValue, useState } from "react";

export function DashboardPage() {
  const [filters, setFilters] = useState<RecommendationsRequest>({
    pagesize: 10,
  });
  const [pageStack, setPageStack] = useState<(string | null)[]>([null]);
  const currentPageState = pageStack[pageStack.length - 1] ?? undefined;
  // Petite latence pour ne pas spam l'API quand l'utilisateur déplace le slider
  const deferredFilters = useDeferredValue({
    ...filters,
    pagestate: currentPageState,
  });

  const {
    data: recommendations,
    isPending,
    isError,
  } = useRecommendations(deferredFilters);

  // ---------------------- Pagination handlers ------------------------------
  const nextPageState = recommendations?.pageState ?? null;
  const hasNext = Boolean(nextPageState);
  const hasPrev = pageStack.length > 1;

  const goNext = () => {
    if (hasNext) setPageStack((s) => [...s, nextPageState]);
  };
  const goPrev = () => {
    if (hasPrev) setPageStack((s) => s.slice(0, -1));
  };

  const title = "Film Dashboard";

  if (isPending) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">Error loading films.</p>
        </div>
      </DashboardLayout>
    );
  }

  const films = recommendations.items;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">
            Manage and explore your film collection with advanced filtering.
          </p>
        </header>

        <StatsCards totalCount={recommendations.totalCount} filters={filters} />

        <section className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </section>

        <section className="rounded-lg border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Film Collection</h2>
            <span className="text-sm text-muted-foreground">
              Page {pageStack.length}
            </span>
          </div>

          <FilmList films={films} />

          <DashboardPagination
            pageStackLength={pageStack.length}
            goNext={goNext}
            goPrev={goPrev}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
