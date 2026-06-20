// Seed data for initial setup (optional, but good practice).
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.securityAlert.createMany({
    data: [
      { blockchain: 'Ethereum', address: '0xAbC123...', reason: 'High frequency transaction detected', amount: 10000 },
      { blockchain: 'Ethereum', address: '0xXyZ987...', reason: 'Unusual large transfer', amount: 500000 },
    ],
  });
  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });