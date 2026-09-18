"use client";

import { Badge } from "@/components/ui/Badge";
import { useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import type { Appointment, UserRole } from "@/lib/types";

const STATUS_TONE: Record<Appointment["status"], "success" | "warning" | "danger" | "neutral"> = {
  SCHEDULED: "warning",
  COMPLETED: "success",
  CANCELLED: "neutral",
  NO_SHOW: "danger",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function AppointmentCard({
  appointment,
  currentUserId,
  role,
}: {
  appointment: Appointment;
  currentUserId: string;
  role: UserRole;
}) {
  const updateStatus = useUpdateAppointmentStatus();
  const canManage = role !== "STAFF" || appointment.staffId === currentUserId;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">
          {formatTime(appointment.startTime)} &ndash; {formatTime(appointment.endTime)}
        </span>
        <Badge tone={STATUS_TONE[appointment.status]}>{appointment.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-ink">{appointment.serviceType.name}</p>
      <p className="text-xs text-ink-soft">{appointment.clientName}</p>

      {canManage && appointment.status === "SCHEDULED" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "COMPLETED" })}
            className="text-xs font-medium text-success-text hover:underline"
          >
            Mark completed
          </button>
          <button
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "NO_SHOW" })}
            className="text-xs font-medium text-danger-text hover:underline"
          >
            No-show
          </button>
          <button
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "CANCELLED" })}
            className="text-xs font-medium text-ink-soft hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
