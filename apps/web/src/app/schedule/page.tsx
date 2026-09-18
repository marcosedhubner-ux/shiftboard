"use client";

import { useMemo, useState } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { StaffColumn } from "@/components/schedule/StaffColumn";
import { NewAppointmentPanel } from "@/components/schedule/NewAppointmentPanel";
import { useRealtime } from "@/hooks/useRealtime";
import { useAppointments } from "@/hooks/useAppointments";
import { useStaff } from "@/hooks/useStaff";
import { useSession } from "@/hooks/useAuth";

function todayIsoDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function ScheduleView() {
  useRealtime();
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState(todayIsoDate());
  const [isBooking, setIsBooking] = useState(false);

  const { from, to } = useMemo(() => {
    const start = new Date(`${selectedDate}T00:00:00`);
    const end = new Date(`${selectedDate}T23:59:59.999`);
    return { from: start.toISOString(), to: end.toISOString() };
  }, [selectedDate]);

  const { data: appointments, isLoading } = useAppointments(from, to);
  const { data: staff } = useStaff();

  const canBook = session?.user.role === "OWNER" || session?.user.role === "ADMIN";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Schedule</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="mt-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
          />
        </div>
        {canBook && <Button onClick={() => setIsBooking(true)}>New appointment</Button>}
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-soft">Loading schedule...</p>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {staff?.map((member) => (
            <StaffColumn
              key={member.id}
              staff={member}
              appointments={appointments ?? []}
              currentUserId={session?.user.id ?? ""}
              role={session?.user.role ?? "STAFF"}
            />
          ))}
        </div>
      )}

      {isBooking && <NewAppointmentPanel selectedDate={selectedDate} onClose={() => setIsBooking(false)} />}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <AuthGuard allowedRoles={["OWNER", "ADMIN", "STAFF"]}>
      <ScheduleView />
    </AuthGuard>
  );
}
