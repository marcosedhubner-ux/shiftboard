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
    <div className="flex min-w-[260px] flex-1 flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{staff.fullName}</h3>
        <p className="text-xs text-slate-400">{staffAppointments.length} booked</p>
      </div>

      {staffAppointments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
          No appointments
        </p>
      ) : (
        staffAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            currentUserId={currentUserId}
            role={role}
          />
        ))
      )}
    </div>
  );
}
