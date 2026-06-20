// Seed data for initial dashboard load (mocking the calculated health metrics)
import { PrismaClient } from '@prisma/client';
import { BigInt } from 'bigint';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Platform Health Data...');

  // Mock data for a specific platform
  const mockData = {
    platformName: 'TrustLance Platform',
    tvl: BigInt(154321098765), // Example TVL in smallest units (e.g., Wei * 10^18)
    totalDisputes: BigInt(450),
    completedDisputes: BigInt(360),
  };

  await prisma.platformHealthData.upsert({
    where: { platformName: mockData.platformName },
    update: {
      tvl: mockData.tvl,
      totalDisputes: mockData.totalDisputes,
      completedDisputes: mockData.completedDisputes,
      disputeCompletionRate: (mockData.completedDisputes * 100n) / mockData.totalDisputes,
    },
    create: {
      platformName: mockData.platformName,
      tvl: mockData.tvl,
      totalDisputes: mockData.totalDisputes,
      completedDisputes: mockData.completedDisputes,
      disputeCompletionRate: (mockData.completedDisputes * 100n) / mockData.totalDisputes,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });