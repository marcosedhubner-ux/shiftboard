import { AppointmentCard } from "./AppointmentCard";
import type { Appointment, StaffMember, UserRole } from "@/lib/types";

export function StaffColumn({
  staff,
  appointments,
  currentUserId,
  role,
}: {
  staff: StaffMember;
  appointments: Appointment[];
  currentUserId: string;
  role: UserRole;
}) {
  const staffAppointments = appointments
    .filter((appointment) => appointment.staffId === staff.id)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="flex min-w-[260px] flex-1 flex-col">
      <div className="border-b border-line pb-2">
        <h3 className="font-serif text-sm font-semibold text-ink">{staff.fullName}</h3>
        <p className="text-xs text-ink-soft">{staffAppointments.length} booked</p>
      </div>

      {staffAppointments.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-lg border border-dashed border-line px-3 py-6 text-center">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-5 w-5 text-brass/45"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="14" height="13" rx="1.5" />
            <path d="M3 8h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-ink-soft">No appointments</p>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {staffAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              currentUserId={currentUserId}
              role={role}
            />
          ))}
        </div>
      )}
    </div>
  );
}
