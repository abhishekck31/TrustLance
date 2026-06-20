import { PrismaClient } from '@prisma/client';
import { BigInt } from 'bigint';

const prisma = new PrismaClient();

async function main() {
  // Simulate initial data for demonstration purposes
  await prisma.TreasuryHolding.createMany({
    data: [
      { address: "0xDAOAddress1", tokenSymbol: "ETH", balance: BigInt(100000000000) }, // 100 ETH
      { address: "0xDAOAddress1", tokenSymbol: "USDC", balance: BigInt(500000000000) }, // 500M USDC
    ],
  });

  await prisma.TreasuryFlow.createMany({
    data: [
      { fromAddress: "0xDAOAddress1", toAddress: "0xWalletA", token: "ETH", amount: BigInt(10000000000) }, // Flow out 100 ETH
      { fromAddress: "0xWalletB", toAddress: "0xDAOAddress1", token: "USDC", amount: BigInt(5000000000) }, // Flow in 500M USDC
    ],
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