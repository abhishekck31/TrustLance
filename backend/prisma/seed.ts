// Seed data for initial platform configuration
import { PrismaClient } from '@prisma/client';
import { crypto } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PlatformConfig...');

  // Initialize with a default fee (e.g., 100 BPS = 1%)
  await prisma.platformConfig.create({
    data: {
      feeBPS: 100,
      updatedAt: new Date(),
      ownerAddress: "0xAdminWalletAddressPlaceholder" // Placeholder, actual owner is set on chain
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });