import { PrismaClient } from '@prisma/client';
import { hash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Simulate creating a user and their bookmarks for testing the relational structure
  const userId1 = 1;
  const userId2 = 2;

  await prisma.user.create({
    data: {
      id: userId1,
      email: 'user1@example.com',
      username: 'dev_user',
    },
  });

  await prisma.user.create({
    data: {
      id: userId2,
      email: 'user2@example.com',
      username: 'fav_user',
    },
  });

  // Seed bookmarks linked to User 1
  await prisma.bookmark.createMany({
    data: [
      {
        userId: userId1,
        title: "Web3 Developer Role",
        url: "https://example.com/job1",
        isJob: true,
      },
      {
        userId: userId1,
        title: "Awesome NFT Collection",
        url: "https://example.com/favs",
        isJob: false,
      }
    ],
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