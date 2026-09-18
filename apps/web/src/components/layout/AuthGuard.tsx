"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/types";
import { AppSidebar } from "./AppSidebar";

export function AuthGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data?.user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(data.user.role)) {
      router.replace("/schedule");
    }
  }, [isLoading, isError, data, allowedRoles, router]);

  if (isLoading || !data?.user || !allowedRoles.includes(data.user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-ink-soft">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppSidebar />
      <main className="min-h-screen pl-60">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
