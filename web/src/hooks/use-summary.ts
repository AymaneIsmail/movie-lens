import { useQuery } from "@tanstack/react-query";
import { fetchSummary } from "@/api/summary";
import { RecommendationsRequest } from "@/api/recommendations";

export function useSummary(filters: RecommendationsRequest) {
  return useQuery({
    queryKey: ["recommendations", "summary", filters],
    queryFn: () =>
      fetchSummary({
        minscore: filters.minscore,
      }),
    staleTime: 30_000,
  });
}
