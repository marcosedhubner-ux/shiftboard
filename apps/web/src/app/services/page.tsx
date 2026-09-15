"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NewServiceForm } from "@/components/services/NewServiceForm";
import { useServiceTypes } from "@/hooks/useServiceTypes";

function ServicesView() {
  const { data: serviceTypes, isLoading } = useServiceTypes();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Services</h1>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700">Add a service</h2>
        <div className="mt-4">
          <NewServiceForm />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-700">Your menu of services</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading...</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {serviceTypes?.map((service) => (
              <li key={service.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{service.name}</p>
                  <p className="text-xs text-slate-400">{service.durationMinutes} min</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">
                    ${Number(service.price).toFixed(2)}
                  </span>
                  <Badge tone={service.isActive ? "success" : "neutral"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <AuthGuard allowedRoles={["OWNER", "ADMIN"]}>
      <ServicesView />
    </AuthGuard>
  );
}
