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
        <p className="mt-3 rounded-lg border border-dashed border-line p-3 text-xs text-ink-soft">
          No appointments
        </p>
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
