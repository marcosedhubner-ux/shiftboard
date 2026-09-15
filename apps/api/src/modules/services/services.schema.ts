import { z } from "zod";

export const createServiceTypeSchema = z.object({
  name: z.string().min(2).max(120),
  durationMinutes: z.number().int().min(5).max(480),
  price: z.number().positive().max(100000),
});

export const updateServiceTypeSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  durationMinutes: z.number().int().min(5).max(480).optional(),
  price: z.number().positive().max(100000).optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceTypeInput = z.infer<typeof createServiceTypeSchema>;
export type UpdateServiceTypeInput = z.infer<typeof updateServiceTypeSchema>;
