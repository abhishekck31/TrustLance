import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.hiringOpportunity.createMany({
    data: [
      { title: "Senior Blockchain Developer", description: "Develop smart contracts and DeFi protocols.", location: "Remote", type: "Full-time", salary: 150000.00 },
      { title: "Frontend Web3 Specialist", description: "Build engaging dApps with React and Web3 libraries.", location: "New York", type: "Full-time", salary: 120000.00 },
      { title: "Contract Solidity Auditor", description: "Review security of existing smart contracts.", location: "London", type: "Contract", salary: 80000.00 },
      { title: "Community Manager (Crypto)", description: "Manage Discord/Telegram communities for Web3 projects.", location: "Remote", type: "Full-time", salary: 60000.00 },
    ],
  })
  console.log('Seeding complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })