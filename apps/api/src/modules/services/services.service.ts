import { prisma } from "../../db/client.js";
import { NotFoundError } from "../../domain/errors.js";
import type { CreateServiceTypeInput, UpdateServiceTypeInput } from "./services.schema.js";

export function listServiceTypes(tenantId: string) {
  return prisma.serviceType.findMany({ where: { tenantId }, orderBy: { name: "asc" } });
}

export function createServiceType(input: CreateServiceTypeInput, tenantId: string) {
  return prisma.serviceType.create({ data: { ...input, tenantId } });
}

export async function updateServiceType(id: string, tenantId: string, input: UpdateServiceTypeInput) {
  const existing = await prisma.serviceType.findFirst({ where: { id, tenantId } });
  if (!existing) {
    throw new NotFoundError("Service");
  }

  return prisma.serviceType.update({ where: { id }, data: input });
}
