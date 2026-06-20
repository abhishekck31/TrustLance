// Script to populate initial data
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create initial Categories
  const categories = ['Design', 'Dev', 'AI', 'Marketing'];
  const categoryRecords = await prisma.Category.createMany({
    data: categories.map(cat => ({ name: cat })),
  });
  console.log(`Created ${categoryRecords.count} categories.`);

  // 2. Create initial Users (Mocks for sellers)
  const users = [];
  for (let i = 0; i < 3; i++) {
    const walletAddress = randomBytes(32).toString('hex');
    users.push({
      email: `seller${i}@example.com`,
      username: `seller_${i}`,
      walletAddress: walletAddress,
    });
  }

  const userRecords = await prisma.User.createMany({
    data: users,
  });
  console.log(`Created ${userRecords.count} users.`);

  // 3. Create initial Listings
  const categoryNames = ['Design', 'Dev', 'AI', 'Marketing'];
  const listingData = [];

  for (let i = 0; i < 5; i++) {
    const randomCat = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const randomSeller = users[Math.floor(Math.random() * users.length)].walletAddress;
    const price = parseFloat((Math.random() * 1000).toFixed(2));

    listingData.push({
      title: faker.commerce.productName(),
      categoryName: randomCat,
      price: price,
      sellerAddress: randomSeller,
    });
  }

  await prisma.Listing.createMany({
    data: listingData.map(data => ({
        title: data.title,
        categoryName: data.categoryName,
        price: data.price,
        sellerAddress: data.sellerAddress,
        status: 'active',
    })),
  });

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });