"use client";

import clsx from "clsx";
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
    <div
      className={clsx(
        "group relative -mx-2 rounded-md px-2 py-3 pl-4",
        "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-surface-hover",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brass opacity-0",
          "transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none"
        )}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">
          {formatTime(appointment.startTime)} &ndash; {formatTime(appointment.endTime)}
        </span>
        <Badge tone={STATUS_TONE[appointment.status]}>{appointment.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-ink">{appointment.serviceType.name}</p>
      <p className="text-xs text-ink-soft">{appointment.clientName}</p>

      {canManage && appointment.status === "SCHEDULED" && (
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "COMPLETED" })}
            className="rounded text-xs font-medium text-success-text underline-offset-2 transition-colors duration-300 ease-out hover:text-success hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 motion-reduce:transition-none"
          >
            Mark completed
          </button>
          <button
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "NO_SHOW" })}
            className="rounded text-xs font-medium text-danger-text underline-offset-2 transition-colors duration-300 ease-out hover:text-danger hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 motion-reduce:transition-none"
          >
            No-show
          </button>
          <button
            onClick={() => updateStatus.mutate({ id: appointment.id, status: "CANCELLED" })}
            className="rounded text-xs font-medium text-ink-soft underline-offset-2 transition-colors duration-300 ease-out hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 motion-reduce:transition-none"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
