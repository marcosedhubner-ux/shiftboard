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
        <label className="block text-sm font-medium text-ink-soft">Full name</label>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft">Temporary password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft">Role</label>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "ADMIN" | "STAFF")}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
        >
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {errorMessage && (
        <p className="sm:col-span-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-text">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="sm:col-span-2 rounded-lg bg-success-soft px-3 py-2 text-sm text-success-text">
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
