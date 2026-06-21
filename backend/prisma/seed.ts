import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Mock Data Seeding ---
  await prisma.freelancer.createMany({
    data: [
      { name: "Alice Developer", bio: "Expert in Solidity and smart contracts.", skill: "Solidity", rating: 5 },
      { name: "Bob Designer", bio: "Creative UI/UX designer focused on aesthetics.", skill: "UI/UX", rating: 4 },
      { name: "Charlie Writer", bio: "Professional technical documentation writer.", skill: "Writing", rating: 5 },
      { name: "Diana Tester", bio: "Rigorous security testing specialist.", skill: "Security Audits", rating: 4 },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });