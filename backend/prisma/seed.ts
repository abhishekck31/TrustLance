import { PrismaClient } from '@prisma/client';
import { hash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.proposal.create({
    data: {
      title: "Initial AI Governance Proposal",
      description: "This is the detailed proposal text for governance.",
      status: "DRAFT",
      body: "The full text of the complex governance proposal that needs summarization by the AI assistant.",
      aiSummary: null,
    },
  });
  console.log('Database seeded successfully.');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });