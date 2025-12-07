import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/bcrypt.js";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("admin123");

  await prisma.user.upsert({
    where: { email: "admin@library.com" },
    update: {},
    create: {
      email: "admin@library.com",
      password: adminPassword,
      name: "Super Admin",
      role: "ADMIN",
    },
  });

  console.log("Admin seeded");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());