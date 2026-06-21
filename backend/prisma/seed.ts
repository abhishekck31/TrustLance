import { PrismaClient } from '@prisma/client';
import { hash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.PlatformHealth.create({
    data: {
      tvl: 150000000.75, // Mock TVL
      totalDisputes: 42, // Mock Disputes
      completionRate: 0.65, // Mock Completion Rate
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });