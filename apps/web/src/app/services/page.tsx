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
      <h1 className="font-serif text-2xl font-bold text-ink">Services</h1>

      <Card>
        <h2 className="text-sm font-semibold text-ink-soft">Add a service</h2>
        <div className="mt-4">
          <NewServiceForm />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink-soft">Your menu of services</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-ink-soft">Loading...</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {serviceTypes?.map((service) => (
              <li key={service.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-ink">{service.name}</p>
                  <p className="text-xs text-ink-soft">{service.durationMinutes} min</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-ink">
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
