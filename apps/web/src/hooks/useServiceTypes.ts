import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ServiceType } from "@/lib/types";

export function useServiceTypes() {
  return useQuery({
    queryKey: ["service-types"],
    queryFn: () => apiClient.get<{ serviceTypes: ServiceType[] }>("/service-types"),
    select: (data) => data.serviceTypes,
  });
}

export function useCreateServiceType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; durationMinutes: number; price: number }) =>
      apiClient.post<{ serviceType: ServiceType }>("/service-types", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-types"] });
    },
  });
}
