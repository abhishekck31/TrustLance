import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Seed data for demonstration purposes
  await prisma.freelancer.createMany({
    data: [
      { name: "Alice Developer", bio: "Expert in Web3 and Solidity development.", primarySkill: "Solidity", rating: 950 },
      { name: "Bob Designer", bio: "UI/UX specialist focusing on mobile apps.", primarySkill: "UI/UX Design", rating: 880 },
      { name: "Charlie Writer", bio: "SEO and technical content creation for crypto projects.", primarySkill: "Content Writing", rating: 920 },
      { name: "Dana Engineer", bio: "Backend infrastructure and database setup.", primarySkill: "Node.js", rating: 750 },
    ],
  });

  console.log('Database seeded successfully.');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });