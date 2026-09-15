import { prisma } from "../../db/client.js";
import { ConflictError, ForbiddenError } from "../../domain/errors.js";
import { hashPassword } from "../../utils/password.js";
import { toPublicUser } from "../../utils/userMapper.js";
import type { InviteStaffInput } from "./staff.schema.js";
import type { AuthTokenPayload } from "../auth/auth.service.js";

export function listStaff(tenantId: string) {
  return prisma.user
    .findMany({
      where: { tenantId },
      orderBy: { fullName: "asc" },
    })
    .then((users) => users.map(toPublicUser));
}

export async function inviteStaff(input: InviteStaffInput, requester: AuthTokenPayload) {
  if (requester.role === "ADMIN" && input.role !== "STAFF") {
    throw new ForbiddenError("Admins can only add staff members, not other admins");
  }

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      role: input.role,
      passwordHash,
      tenantId: requester.tenantId,
    },
  });

  return toPublicUser(user);
}
