"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useServiceTypes } from "@/hooks/useServiceTypes";
import { useStaff } from "@/hooks/useStaff";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { ApiError } from "@/lib/apiClient";

export function NewAppointmentPanel({ selectedDate, onClose }: { selectedDate: string; onClose: () => void }) {
  const { data: staff } = useStaff();
  const { data: serviceTypes } = useServiceTypes();
  const createAppointment = useCreateAppointment();

  const [staffId, setStaffId] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [time, setTime] = useState("09:00");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    const startTime = new Date(`${selectedDate}T${time}:00`).toISOString();

    createAppointment.mutate(
      { staffId, serviceTypeId, clientName, clientEmail, startTime },
      {
        onSuccess: onClose,
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink">New appointment</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft">Staff member</label>
            <select
              required
              value={staffId}
              onChange={(event) => setStaffId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            >
              <option value="" disabled>
                Select staff
              </option>
              {staff?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft">Service</label>
            <select
              required
              value={serviceTypeId}
              onChange={(event) => setServiceTypeId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            >
              <option value="" disabled>
                Select service
              </option>
              {serviceTypes
                ?.filter((service) => service.isActive)
                .map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} &middot; {service.durationMinutes} min &middot; $
                    {Number(service.price).toFixed(2)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft">Start time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft">Client name</label>
            <input
              required
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft">Client email</label>
            <input
              type="email"
              required
              value={clientEmail}
              onChange={(event) => setClientEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-text">{errorMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
            {createAppointment.isPending ? "Booking..." : "Book appointment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
