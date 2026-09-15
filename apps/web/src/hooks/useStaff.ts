import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { StaffMember } from "@/lib/types";

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => apiClient.get<{ staff: StaffMember[] }>("/staff"),
    select: (data) => data.staff,
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { fullName: string; email: string; password: string; role: "ADMIN" | "STAFF" }) =>
      apiClient.post<{ user: StaffMember }>("/staff", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
