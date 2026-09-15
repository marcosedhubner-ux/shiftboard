import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { WeeklySummary } from "@/lib/types";

export function useWeeklySummary() {
  return useQuery({
    queryKey: ["analytics", "weekly-summary"],
    queryFn: () => apiClient.get<WeeklySummary>("/analytics/weekly-summary"),
    refetchInterval: 30_000,
  });
}
