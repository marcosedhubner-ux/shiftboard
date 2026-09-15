import { prisma } from "../../db/client.js";
import type { AppointmentStatus, Prisma } from "@prisma/client";

const appointmentInclude = {
  staff: { select: { id: true, fullName: true } },
  serviceType: true,
} satisfies Prisma.AppointmentInclude;

export function findByTenant(tenantId: string, from?: Date, to?: Date) {
  return prisma.appointment.findMany({
    where: {
      tenantId,
      ...(from || to
        ? {
            startTime: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    include: appointmentInclude,
    orderBy: { startTime: "asc" },
  });
}

export function findActiveForStaffOnDay(tenantId: string, staffId: string, dayStart: Date, dayEnd: Date) {
  return prisma.appointment.findMany({
    where: {
      tenantId,
      staffId,
      status: { not: "CANCELLED" },
      startTime: { lt: dayEnd },
      endTime: { gt: dayStart },
    },
  });
}

export function findById(tenantId: string, id: string) {
  return prisma.appointment.findFirst({ where: { id, tenantId }, include: appointmentInclude });
}

export function create(data: Prisma.AppointmentUncheckedCreateInput) {
  return prisma.appointment.create({ data, include: appointmentInclude });
}

export function updateStatus(id: string, status: AppointmentStatus) {
  return prisma.appointment.update({ where: { id }, data: { status }, include: appointmentInclude });
}
