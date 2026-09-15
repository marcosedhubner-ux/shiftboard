import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Appointment, AppointmentStatus } from "@/lib/types";

interface CreateAppointmentInput {
  staffId: string;
  serviceTypeId: string;
  clientName: string;
  clientEmail: string;
  startTime: string;
}

export function useAppointments(from: string, to: string) {
  return useQuery({
    queryKey: ["appointments", from, to],
    queryFn: () =>
      apiClient.get<{ appointments: Appointment[] }>(
        `/appointments?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      ),
    select: (data) => data.appointments,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) =>
      apiClient.post<{ appointment: Appointment }>("/appointments", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      apiClient.patch<{ appointment: Appointment }>(`/appointments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
