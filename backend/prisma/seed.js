import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();

  await prisma.service.createMany({
    data: [
      { name: "Corte de cabelo", durationMinutes: 30, price: 40.0 },
      { name: "Barba", durationMinutes: 20, price: 25.0 },
      { name: "Corte + Barba", durationMinutes: 45, price: 60.0 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });