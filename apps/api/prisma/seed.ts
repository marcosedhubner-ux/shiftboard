import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!123", 12);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "modern-cuts-demo" },
    update: {},
    create: { businessName: "Modern Cuts Studio", slug: "modern-cuts-demo" },
  });

  const [owner, , stylistOne, stylistTwo] = await Promise.all([
    prisma.user.upsert({
      where: { email: "owner@shiftboard.dev" },
      update: {},
      create: {
        tenantId: tenant.id,
        fullName: "Jordan Blake",
        email: "owner@shiftboard.dev",
        passwordHash,
        role: "OWNER",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@shiftboard.dev" },
      update: {},
      create: {
        tenantId: tenant.id,
        fullName: "Casey Morgan",
        email: "admin@shiftboard.dev",
        passwordHash,
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "stylist1@shiftboard.dev" },
      update: {},
      create: {
        tenantId: tenant.id,
        fullName: "Sam Rivera",
        email: "stylist1@shiftboard.dev",
        passwordHash,
        role: "STAFF",
      },
    }),
    prisma.user.upsert({
      where: { email: "stylist2@shiftboard.dev" },
      update: {},
      create: {
        tenantId: tenant.id,
        fullName: "Taylor Kim",
        email: "stylist2@shiftboard.dev",
        passwordHash,
        role: "STAFF",
      },
    }),
  ]);

  const serviceSeeds = [
    { name: "Haircut", durationMinutes: 30, price: 35 },
    { name: "Beard Trim", durationMinutes: 15, price: 18 },
    { name: "Hair Color", durationMinutes: 90, price: 85 },
    { name: "Kids Cut", durationMinutes: 20, price: 22 },
  ];

  const serviceTypes = [];
  for (const service of serviceSeeds) {
    const existing = await prisma.serviceType.findFirst({
      where: { tenantId: tenant.id, name: service.name },
    });
    serviceTypes.push(
      existing ??
        (await prisma.serviceType.create({ data: { ...service, tenantId: tenant.id } }))
    );
  }

  const haircut = serviceTypes[0];
  const today = new Date();
  today.setMinutes(0, 0, 0);

  const sampleAppointments = [
    { staffId: stylistOne.id, hoursFromNow: 1, status: "SCHEDULED" as const },
    { staffId: stylistTwo.id, hoursFromNow: 3, status: "SCHEDULED" as const },
    { staffId: stylistOne.id, hoursFromNow: -3, status: "COMPLETED" as const },
  ];

  for (const [index, appt] of sampleAppointments.entries()) {
    const startTime = new Date(today.getTime() + appt.hoursFromNow * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + haircut.durationMinutes * 60_000);
    const clientEmail = `client${index + 1}@example.com`;

    const existing = await prisma.appointment.findFirst({
      where: { tenantId: tenant.id, staffId: appt.staffId, clientEmail },
    });

    if (!existing) {
      await prisma.appointment.create({
        data: {
          tenantId: tenant.id,
          staffId: appt.staffId,
          serviceTypeId: haircut.id,
          clientName: `Demo Client ${index + 1}`,
          clientEmail,
          startTime,
          endTime,
          status: appt.status,
        },
      });
    }
  }

  console.log(`Seed complete. Owner login: ${owner.email} / Passw0rd!123`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
