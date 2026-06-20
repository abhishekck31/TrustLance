// Seed script for initial data setup.
import { PrismaClient } from '@prisma/client';
import { hash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.platformFeeConfig.createMany({
    data: [
      { name: "Standard Platform Fee", feePercentage: 500 }, // 5.00%
      { name: "Premium Platform Fee", feePercentage: 1000 }, // 10.00%
    ],
  });
  console.log('Database seeded with initial platform fee configurations.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });