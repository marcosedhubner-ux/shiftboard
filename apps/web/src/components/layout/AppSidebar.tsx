"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useLogout, useSession } from "@/hooks/useAuth";

const NAV_ITEMS = [
  {
    href: "/schedule",
    label: "Schedule",
    roles: ["OWNER", "ADMIN", "STAFF"],
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="14" height="13" rx="1.5" />
        <path d="M3 8h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/staff",
    label: "Staff",
    roles: ["OWNER", "ADMIN"],
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
        <circle cx="7.5" cy="6.5" r="2.75" />
        <path d="M2.5 17c.5-3.5 2.6-5.25 5-5.25s4.5 1.75 5 5.25" strokeLinecap="round" />
        <path d="M13 4.2c1.2.2 2.1 1.25 2.1 2.55 0 1.3-.9 2.35-2.1 2.55M15.6 11.9c1.9.55 3.1 2.05 3.4 5.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/services",
    label: "Services",
    roles: ["OWNER", "ADMIN"],
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 3l6 6-8 8-6-6 8-8z" strokeLinejoin="round" />
        <circle cx="7.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["OWNER", "ADMIN"],
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.5 16.5v-6M9 16.5v-11M14.5 16.5v-8.5" strokeLinecap="round" />
        <path d="M3 16.5h14" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const SIDEBAR_WIDTH = "w-60";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  const role = data?.user.role;
  const visibleItems = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));

  return (
    <aside className={clsx(SIDEBAR_WIDTH, "fixed inset-y-0 left-0 flex flex-col border-r border-line bg-surface")}>
      <div className="border-b border-line px-6 py-6">
        <span className="font-serif text-xl font-bold tracking-tight text-ink">Roster</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 border-l-2 border-b border-line/60 px-6 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-l-brass bg-brass-soft text-brass"
                  : "border-l-transparent text-ink-soft hover:bg-surface-hover hover:text-ink"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {data?.user && (
        <div className="border-t border-line px-6 py-4">
          <p className="truncate text-sm font-medium text-ink">{data.user.fullName}</p>
          <p className="text-xs text-ink-soft">{data.user.role}</p>
          <button
            onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
            className="mt-3 text-sm font-medium text-ink-soft hover:text-brass"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
