"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useLogout, useSession } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/schedule", label: "Schedule", roles: ["OWNER", "ADMIN", "STAFF"] },
  { href: "/staff", label: "Staff", roles: ["OWNER", "ADMIN"] },
  { href: "/services", label: "Services", roles: ["OWNER", "ADMIN"] },
  { href: "/dashboard", label: "Dashboard", roles: ["OWNER", "ADMIN"] },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  const role = data?.user.role;
  const visibleItems = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="font-serif text-lg font-bold tracking-tight text-ink">Roster</span>
          <nav className="flex gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-lg px-3 py-1.5 text-sm font-medium",
                  pathname === item.href
                    ? "bg-brass text-[#12151b]"
                    : "text-ink-soft hover:bg-surface-hover"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {data?.user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-ink">{data.user.fullName}</p>
              <p className="text-xs text-ink-soft">{data.user.role}</p>
            </div>
            <button
              onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
