import {
  fetchRecommendations,
  RecommendationsRequest,
} from "@/api/recommendations";
import { useQuery } from "@tanstack/react-query";

export function useRecommendations(req: RecommendationsRequest) {
  return useQuery({
    queryKey: ["recommendations", req],
    queryFn: () =>
      fetchRecommendations({
        ...req,
        pagesize: req.pagesize ?? 10,
      }),
    staleTime: 30_000, // 30s cache
    retry: 1,
  });
}
