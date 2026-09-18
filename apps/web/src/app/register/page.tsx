"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterTenant } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/apiClient";

export default function RegisterPage() {
  const router = useRouter();
  const registerTenant = useRegisterTenant();
  const [businessName, setBusinessName] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    registerTenant.mutate(
      { businessName, ownerFullName, email, password },
      {
        onSuccess: () => router.push("/"),
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-bold text-ink">Create your workspace</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Set up your business — you&apos;ll be the owner account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft" htmlFor="businessName">
              Business name
            </label>
            <input
              id="businessName"
              required
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft" htmlFor="ownerFullName">
              Your name
            </label>
            <input
              id="ownerFullName"
              required
              value={ownerFullName}
              onChange={(event) => setOwnerFullName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
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
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-text">{errorMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={registerTenant.isPending}>
            {registerTenant.isPending ? "Creating workspace..." : "Create workspace"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brass hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
