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
      <h1 className="text-2xl font-bold text-slate-900">Team</h1>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700">Add a team member</h2>
        <div className="mt-4">
          <InviteStaffForm />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700">Everyone on your team</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading...</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {staff?.map((member) => (
              <li key={member.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{member.fullName}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
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
