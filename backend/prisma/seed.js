// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting idempotent DB bootstrap...");

  // --- Admin Seed ---
  const adminUsername = "superadmin";
  const adminPassword = "Admin@123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: adminHash,
      role: "superadmin",
    },
  });
  console.log("✔ Admin account ready:", admin.username);

  // --- Reserve Accounts Seed ---
  const reserveCurrencies = ["USD", "KES", "USDT"];

  for (const currency of reserveCurrencies) {
    await prisma.reserveAccount.upsert({
      where: { currency },
      update: {},
      create: {
        currency,
        balance: 0,
      },
    });
  }
  console.log("✔ Reserve accounts ready");

  // --- Example User Seed ---
  const userHash = await bcrypt.hash("User@123", 10);

  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      fullName: "Demo User",
      email: "demo@example.com",
      passwordHash: userHash,
      isVerified: true,
    },
  });
  console.log("✔ Demo user created");

  console.log("🌱 Bootstrapping done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
