import { PrismaClient, Role, Segment } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin Visit Flow",
      email: "admin@gmail.com",
      password,
      role: Role.ADMIN,
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: "sales@gmail.com" },
    update: {},
    create: {
      name: "Sales Demo",
      email: "sales@gmail.com",
      password,
      role: Role.SALES,
    },
  });

  const entities = [
    {
      name: "Kantor Layanan Melati",
      type: "Instansi",
      segment: Segment.B2G,
      region: "Bandung",
    },
    {
      name: "Toko Sinar Jaya",
      type: "Perusahaan",
      segment: Segment.B2B,
      region: "Jakarta",
    },
    {
      name: "Dinas Pelayanan Kota",
      type: "Instansi",
      segment: Segment.B2G,
      region: "Semarang",
    },
    {
      name: "CV Berkah Abadi",
      type: "Perusahaan",
      segment: Segment.B2B,
      region: "Kudus",
    },
  ];

  for (const entity of entities) {
    const existing = await prisma.entity.findFirst({
      where: { name: entity.name, type: entity.type },
    });
    if (!existing) await prisma.entity.create({ data: entity });
  }

  const allEntities = await prisma.entity.findMany();
  for (const [index, entity] of allEntities.entries()) {
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() + index);
    await prisma.activity.upsert({
      where: { id: `seed-activity-${index + 1}` },
      update: {},
      create: {
        id: `seed-activity-${index + 1}`,
        entityId: entity.id,
        salesId: sales.id,
        segment: entity.segment,
        visitDate,
      },
    });
  }

  console.log(`Seed completed. Admin: ${admin.email}; Sales: ${sales.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
