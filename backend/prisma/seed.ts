import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Audit Findings...');

  const findings = [];

  // Generate 10 sample findings
  for (let i = 1; i <= 10; i++) {
    findings.push({
      title: faker.lorem.words(3) + " Vulnerability",
      description: faker.lorem.sentence(),
      severity: faker.helpers.arrayElement(['Critical', 'High', 'Medium', 'Low']),
      status: faker.helpers.arrayElement(['Open', 'In Progress', 'Resolved', 'Closed']),
      reportedBy: faker.person.fullName(),
      dateReported: faker.date.past(),
    });
  }

  await prisma.auditFinding.createMany({
    data: findings,
  });

  console.log(`Seeded ${findings.length} audit findings.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });