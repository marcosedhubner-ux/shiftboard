import { prisma } from "../../db/client.js";

function startOfWeek(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  const diffToMonday = (day + 6) % 7;
  result.setDate(result.getDate() - diffToMonday);
  return result;
}

export async function getWeeklySummary(tenantId: string) {
  const weekStart = startOfWeek(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const appointments = await prisma.appointment.findMany({
    where: { tenantId, startTime: { gte: weekStart, lt: weekEnd } },
    include: { serviceType: true, staff: { select: { id: true, fullName: true } } },
  });

  const totalBooked = appointments.filter((a) => a.status !== "CANCELLED").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED");
  const noShows = appointments.filter((a) => a.status === "NO_SHOW").length;

  const estimatedRevenue = completed.reduce((sum, a) => sum + Number(a.serviceType.price), 0);

  const countByStaff = new Map<string, { name: string; count: number }>();
  for (const appointment of appointments) {
    if (appointment.status === "CANCELLED") continue;
    const existing = countByStaff.get(appointment.staffId);
    if (existing) {
      existing.count += 1;
    } else {
      countByStaff.set(appointment.staffId, { name: appointment.staff.fullName, count: 1 });
    }
  }

  const busiestStaff = Array.from(countByStaff.values()).sort((a, b) => b.count - a.count)[0] ?? null;

  return { totalBooked, completedCount: completed.length, noShows, estimatedRevenue, busiestStaff };
}
