"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { InviteStaffForm } from "@/components/staff/InviteStaffForm";
import { useStaff } from "@/hooks/useStaff";

function StaffView() {
  const { data: staff, isLoading } = useStaff();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-ink">Team</h1>

      <Card>
        <h2 className="text-sm font-semibold text-ink-soft">Add a team member</h2>
        <div className="mt-4">
          <InviteStaffForm />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink-soft">Everyone on your team</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-ink-soft">Loading...</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {staff?.map((member) => (
              <li key={member.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-ink">{member.fullName}</p>
                  <p className="text-xs text-ink-soft">{member.email}</p>
                </div>
                <Badge tone="info">{member.role}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default function StaffPage() {
  return (
    <AuthGuard allowedRoles={["OWNER", "ADMIN"]}>
      <StaffView />
    </AuthGuard>
  );
}
