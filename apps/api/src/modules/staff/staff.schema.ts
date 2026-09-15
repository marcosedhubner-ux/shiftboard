import { z } from "zod";

export const inviteStaffSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["ADMIN", "STAFF"]),
});

export type InviteStaffInput = z.infer<typeof inviteStaffSchema>;
