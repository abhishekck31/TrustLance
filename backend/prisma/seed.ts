import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create initial users (assuming we have some way to map these to wallet addresses later)
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: { name: 'Alice' },
    create: { email: 'user1@example.com' }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: { name: 'Bob' },
    create: { email: 'user2@example.com' }
  });

  // Create initial jobs
  const job1 = await prisma.job.create({
    data: { title: 'Senior Solidity Developer', description: 'Expert in smart contracts and DeFi.' }
  });

  const job2 = await prisma.job.create({
    data: { title: 'Frontend Next.js Engineer', description: 'Building scalable user interfaces.' }
  });

  // Save bookmarks for Alice (user1)
  await prisma.bookmark.create({
    data: {
      userId: user1.id,
      jobId: job1.id,
      jobTitle: job1.title,
      savedAt: new Date(),
    },
  });

  await prisma.bookmark.create({
    data: {
      userId: user1.id,
      jobId: job2.id,
      jobTitle: job2.title,
      savedAt: new Date(),
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