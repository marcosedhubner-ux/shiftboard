"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { useWeeklySummary } from "@/hooks/useAnalytics";

function DashboardView() {
  const { data, isLoading } = useWeeklySummary();

  if (isLoading || !data) {
    return <p className="text-sm text-ink-soft">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">This week</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Booked" value={String(data.totalBooked)} />
        <StatCard label="Completed" value={String(data.completedCount)} />
        <StatCard label="No-shows" value={String(data.noShows)} />
        <StatCard label="Estimated revenue" value={`$${data.estimatedRevenue.toFixed(2)}`} />
      </div>

      <Card accent className="mt-6">
        <h2 className="text-sm font-semibold text-ink-soft">Busiest team member</h2>
        {data.busiestStaff ? (
          <p className="mt-3 text-sm text-ink">
            <span className="font-semibold text-ink">{data.busiestStaff.name}</span> with{" "}
            {data.busiestStaff.count} appointments this week
          </p>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">No appointments booked this week yet.</p>
        )}
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["OWNER", "ADMIN"]}>
      <DashboardView />
    </AuthGuard>
  );
}
