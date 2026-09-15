import { z } from "zod";

export const createAppointmentSchema = z.object({
  staffId: z.string().cuid(),
  serviceTypeId: z.string().cuid(),
  clientName: z.string().min(2).max(120),
  clientEmail: z.string().email(),
  startTime: z.string().datetime(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

export const listAppointmentsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
