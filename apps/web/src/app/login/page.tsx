"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/apiClient";

const DEMO_ACCOUNTS = [
  { role: "Owner", email: "owner@shiftboard.dev" },
  { role: "Admin", email: "admin@shiftboard.dev" },
  { role: "Staff", email: "stylist1@shiftboard.dev" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    login.mutate(
      { email, password },
      {
        onSuccess: () => router.push("/"),
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-bg lg:grid-cols-2">
      <div className="roster-lines relative hidden overflow-hidden bg-bg lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="relative z-10">
          <span className="font-serif text-2xl font-bold text-ink">Roster</span>
        </div>
        <div className="relative z-10 space-y-4">
          <p className="max-w-md text-3xl font-semibold leading-tight text-ink">
            Staff scheduling that refuses to double-book someone, even when two requests land in
            the same second.
          </p>
          <p className="max-w-sm text-sm text-ink-soft">
            One calendar per business, isolated from every other tenant on the platform, with
            conflict-free scheduling built into every booking.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Use your team account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-text">
                {errorMessage}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            New business?{" "}
            <Link href="/register" className="font-medium text-brass hover:underline">
              Create your workspace
            </Link>
          </p>

          <div className="mt-8 rounded-lg border border-dashed border-line p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Demo accounts (password: Passw0rd!123)
            </p>
            <ul className="mt-2 space-y-1">
              {DEMO_ACCOUNTS.map((account) => (
                <li key={account.email} className="flex justify-between text-xs text-ink-soft">
                  <span>{account.role}</span>
                  <span className="font-mono">{account.email}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
