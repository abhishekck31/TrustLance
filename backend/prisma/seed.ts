import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Categories
  await prisma.category.createMany({
    data: [
      { name: 'Design' },
      { name: 'Development' },
      { name: 'AI' },
      { name: 'Marketing' },
    ],
  });

  // Seed Sample Listings (Requires linking to actual addresses/contracts for production)
  // For this seed, we simulate data that would be populated by the blockchain later.
  await prisma.listing.createMany({
    data: [
      { categoryId: 1, title: 'UI/UX Design Service', price: 500.00, sellerAddress: '0xSellerA1234567890abcdefgh', status: 'Active' },
      { categoryId: 2, title: 'Full Stack Dev Gig', price: 1500.00, sellerAddress: '0xSellerB1234567890abcdefgh', status: 'Active' },
      { categoryId: 3, title: 'Custom AI Model Training', price: 800.00, sellerAddress: '0xSellerC1234567890abcdefgh', status: 'Draft' },
    ],
  });

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });