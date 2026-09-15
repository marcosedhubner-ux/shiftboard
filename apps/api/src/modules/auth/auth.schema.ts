import { z } from "zod";

export const registerTenantSchema = z.object({
  businessName: z.string().min(2).max(120),
  ownerFullName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterTenantInput = z.infer<typeof registerTenantSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
