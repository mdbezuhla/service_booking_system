import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = `file:${path.resolve(process.cwd(), "prisma/dev.db")}`;

const adapter = new PrismaLibSql({
  url: process.env.LIBSQL_DATABASE_URL || dbUrl,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@glamour.com" },
    update: {},
    create: {
      email: "admin@glamour.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      provider: "CREDENTIALS",
    },
  });

  const userHash = await bcrypt.hash("user1234", 12);
  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      name: "Test User",
      passwordHash: userHash,
      role: "USER",
      provider: "CREDENTIALS",
    },
  });

  const cuts = await prisma.category.upsert({
    where: { slug: "haircuts" },
    update: {},
    create: { name: "Haircuts", slug: "haircuts", order: 1 },
  });

  const colouring = await prisma.category.upsert({
    where: { slug: "colouring" },
    update: {},
    create: { name: "Colouring", slug: "colouring", order: 2 },
  });

  const treatments = await prisma.category.upsert({
    where: { slug: "treatments" },
    update: {},
    create: { name: "Treatments", slug: "treatments", order: 3 },
  });

  const mensHaircut = await prisma.service.create({
    data: {
      name: "Men's Haircut",
      description: "Classic or modern men's haircut tailored to your style. Includes wash, cut, and styling.",
      price: 30,
      duration: 30,
      categoryId: cuts.id,
    },
  });

  const womensHaircut = await prisma.service.create({
    data: {
      name: "Women's Cut & Style",
      description: "Full haircut and blow-dry styling. Our stylists will consult with you to find the perfect look.",
      price: 55,
      duration: 60,
      categoryId: cuts.id,
    },
  });

  const highlights = await prisma.service.create({
    data: {
      name: "Full Highlights",
      description: "Complete highlights using premium colour products for a natural, sun-kissed look.",
      price: 120,
      duration: 120,
      categoryId: colouring.id,
    },
  });

  const balayage = await prisma.service.create({
    data: {
      name: "Balayage",
      description: "Hand-painted balayage for a seamless, natural gradient. Includes toner and styling.",
      price: 150,
      duration: 150,
      categoryId: colouring.id,
    },
  });

  const keratinTreatment = await prisma.service.create({
    data: {
      name: "Keratin Treatment",
      description: "Smoothing keratin treatment to eliminate frizz and add shine. Lasts up to 3 months.",
      price: 200,
      duration: 120,
      categoryId: treatments.id,
    },
  });

  const deepConditioning = await prisma.service.create({
    data: {
      name: "Deep Conditioning",
      description: "Intensive moisture treatment to restore dry, damaged hair. Includes scalp massage.",
      price: 45,
      duration: 45,
      categoryId: treatments.id,
    },
  });

  const sophie = await prisma.staff.create({
    data: { name: "Sophie Chen", bio: "Senior stylist with 10 years of experience specialising in precision cuts and creative colouring." },
  });

  const marcus = await prisma.staff.create({
    data: { name: "Marcus Rivera", bio: "Expert in men's grooming and contemporary fades. Known for attention to detail." },
  });

  const elena = await prisma.staff.create({
    data: { name: "Elena Brooks", bio: "Colour specialist with a passion for balayage and vivid transformations." },
  });

  await prisma.staffService.createMany({
    data: [
      { staffId: sophie.id, serviceId: womensHaircut.id },
      { staffId: sophie.id, serviceId: highlights.id },
      { staffId: sophie.id, serviceId: keratinTreatment.id },
      { staffId: marcus.id, serviceId: mensHaircut.id },
      { staffId: marcus.id, serviceId: womensHaircut.id },
      { staffId: elena.id, serviceId: highlights.id },
      { staffId: elena.id, serviceId: balayage.id },
      { staffId: elena.id, serviceId: deepConditioning.id },
    ],
  });

  const today = new Date();
  const slots = [];

  for (let day = 1; day <= 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);

    for (const staff of [sophie, marcus, elena]) {
      for (let hour = 9; hour < 17; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);

        slots.push({
          staffId: staff.id,
          startTime,
          endTime,
        });
      }
    }
  }

  await prisma.timeSlot.createMany({ data: slots });

  console.log("Seed completed successfully!");
  console.log(`Admin account: admin@glamour.com / admin123`);
  console.log(`Test user: user@test.com / user1234`);
  console.log(`Created ${slots.length} time slots for the next 7 days`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
