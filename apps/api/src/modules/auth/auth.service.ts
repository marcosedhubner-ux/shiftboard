import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/client.js";
import { env } from "../../config/env.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../domain/errors.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { toPublicUser } from "../../utils/userMapper.js";
import type { LoginInput, RegisterTenantInput } from "./auth.schema.js";

export interface AuthTokenPayload {
  userId: string;
  tenantId: string;
  role: "OWNER" | "ADMIN" | "STAFF";
}

function slugify(businessName: string): string {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = crypto.randomBytes(3).toString("hex");
  return `${base}-${suffix}`;
}

export async function registerTenant(input: RegisterTenantInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  const tenant = await prisma.tenant.create({
    data: {
      businessName: input.businessName,
      slug: slugify(input.businessName),
      users: {
        create: {
          fullName: input.ownerFullName,
          email: input.email,
          passwordHash,
          role: "OWNER",
        },
      },
    },
    include: { users: true },
  });

  const owner = tenant.users[0];
  if (!owner) {
    throw new Error("Owner user was not created");
  }

  const token = signToken({ userId: owner.id, tenantId: tenant.id, role: "OWNER" });
  return { token, user: toPublicUser(owner), tenant: { id: tenant.id, businessName: tenant.businessName } };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new UnauthorizedError();
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError();
  }

  const token = signToken({ userId: user.id, tenantId: user.tenantId, role: user.role });
  return { token, user: toPublicUser(user) };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User");
  }
  return toPublicUser(user);
}

export function signToken(payload: AuthTokenPayload): string {
  const options = { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions;
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
