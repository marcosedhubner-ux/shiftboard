"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useInviteStaff } from "@/hooks/useStaff";
import { ApiError } from "@/lib/apiClient";

export function InviteStaffForm() {
  const inviteStaff = useInviteStaff();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    inviteStaff.mutate(
      { fullName, email, password, role },
      {
        onSuccess: () => {
          setSuccessMessage(`${fullName} was added to the team.`);
          setFullName("");
          setEmail("");
          setPassword("");
        },
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-slate-700">Full name</label>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Temporary password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Role</label>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "ADMIN" | "STAFF")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        >
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {errorMessage && (
        <p className="sm:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="sm:col-span-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={inviteStaff.isPending}>
          {inviteStaff.isPending ? "Adding..." : "Add to team"}
        </Button>
      </div>
    </form>
  );
}
