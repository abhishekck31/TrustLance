// TrustLance Backend Seeder (Illustrative)

import { PrismaClient } from '@prisma/client';
import { hash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed an example job timeline demonstrating the required flow: Created -> Funded -> Milestone -> Approved -> Released
  await prisma.job.create({
    data: {
      creator: '0xAliceAddress123', // Placeholder address for demonstration
      projectName: 'Web3 Infrastructure Audit',
      statusId: 4, // Starting at Milestone phase (assuming Created=0, Funded=1, Milestone=2, Approved=3, Released=4)
      createdAt: new Date(),
      fundedAt: new Date(Date.now() + 86400000), // Funded 1 day later
      milestoneAt: new Date(Date.now() + 172800000), // Milestone set 2 days later
      approvedAt: new Date(Date.now() + 259200000), // Approved 3 days later
      releasedAt: new Date(), // Released now
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });