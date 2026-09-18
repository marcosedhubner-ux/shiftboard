"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateServiceType } from "@/hooks/useServiceTypes";
import { ApiError } from "@/lib/apiClient";

export function NewServiceForm() {
  const createServiceType = useCreateServiceType();
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    createServiceType.mutate(
      { name, durationMinutes, price },
      {
        onSuccess: () => {
          setName("");
          setDurationMinutes(30);
          setPrice(0);
        },
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-ink-soft">Name</label>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft">Duration (minutes)</label>
        <input
          type="number"
          required
          min={5}
          max={480}
          value={durationMinutes}
          onChange={(event) => setDurationMinutes(Number(event.target.value))}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft">Price (USD)</label>
        <input
          type="number"
          required
          min={0}
          step="0.01"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        />
      </div>

      {errorMessage && (
        <p className="sm:col-span-3 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-text">{errorMessage}</p>
      )}

      <div className="sm:col-span-3">
        <Button type="submit" disabled={createServiceType.isPending}>
          {createServiceType.isPending ? "Adding..." : "Add service"}
        </Button>
      </div>
    </form>
  );
}
