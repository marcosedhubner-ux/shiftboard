import { prisma } from "../../db/client.js";
import * as appointmentsRepository from "./appointments.repository.js";
import { NotFoundError, ForbiddenError } from "../../domain/errors.js";
import { findConflict, SchedulingConflictError } from "../../domain/appointmentConflict.js";
import type { CreateAppointmentInput, UpdateAppointmentStatusInput } from "./appointments.schema.js";
import type { AuthTokenPayload } from "../auth/auth.service.js";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + 1);
  return next;
}

export async function createAppointment(input: CreateAppointmentInput, tenantId: string) {
  const serviceType = await prisma.serviceType.findFirst({
    where: { id: input.serviceTypeId, tenantId, isActive: true },
  });
  if (!serviceType) {
    throw new NotFoundError("Service type");
  }

  const staff = await prisma.user.findFirst({ where: { id: input.staffId, tenantId } });
  if (!staff) {
    throw new NotFoundError("Staff member");
  }

  const startTime = new Date(input.startTime);
  const endTime = new Date(startTime.getTime() + serviceType.durationMinutes * 60_000);

  const dayStart = startOfDay(startTime);
  const dayEnd = endOfDay(endTime);
  const staffAppointmentsThatDay = await appointmentsRepository.findActiveForStaffOnDay(
    tenantId,
    input.staffId,
    dayStart,
    dayEnd
  );

  const conflict = findConflict({ startTime, endTime }, staffAppointmentsThatDay);
  if (conflict) {
    throw new SchedulingConflictError(conflict.startTime, conflict.endTime);
  }

  return appointmentsRepository.create({
    tenantId,
    staffId: input.staffId,
    serviceTypeId: input.serviceTypeId,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    startTime,
    endTime,
  });
}

export async function updateAppointmentStatus(
  id: string,
  tenantId: string,
  input: UpdateAppointmentStatusInput,
  requester: AuthTokenPayload
) {
  const appointment = await appointmentsRepository.findById(tenantId, id);
  if (!appointment) {
    throw new NotFoundError("Appointment");
  }

  if (requester.role === "STAFF" && appointment.staffId !== requester.userId) {
    throw new ForbiddenError("You can only update your own appointments");
  }

  return appointmentsRepository.updateStatus(id, input.status);
}

export function listAppointments(tenantId: string, from?: string, to?: string) {
  return appointmentsRepository.findByTenant(
    tenantId,
    from ? new Date(from) : undefined,
    to ? new Date(to) : undefined
  );
}
