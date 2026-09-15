export type UserRole = "OWNER" | "ADMIN" | "STAFF";
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface ServiceType {
  id: string;
  name: string;
  durationMinutes: number;
  price: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  staffId: string;
  staff: { id: string; fullName: string };
  serviceTypeId: string;
  serviceType: ServiceType;
  clientName: string;
  clientEmail: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export interface WeeklySummary {
  totalBooked: number;
  completedCount: number;
  noShows: number;
  estimatedRevenue: number;
  busiestStaff: { name: string; count: number } | null;
}
