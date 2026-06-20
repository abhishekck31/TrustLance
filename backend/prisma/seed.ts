import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Example of seeding initial data (simulating a contract being added)
  await prisma.contractRiskAssessment.create({
    data: {
      contractAddress: '0xabc123def456', // Placeholder address
      ownerAddress: faker.internet.userName(),
      deployTime: Date.now() - Math.floor(Math.random() * 86400000), // Within last 24 hours
      contractName: 'SuspiciousToken_' + faker.finance.word(),
      riskScore: Math.floor(Math.random() * 100),
      isSuspicious: Math.random() > 0.8,
    },
  });

  console.log('Seeding complete.');
}

main().catch(e => {
  console.error('Error during seeding:', e);
});