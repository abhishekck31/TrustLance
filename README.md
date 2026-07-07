# TrustLance 

TrustLance is a production-grade decentralized freelance escrow platform. Payments are locked on-chain, released via milestones, and disputes are handled transparently by a DAO.

## Architecture

This is a modern Web3 monorepo containing:
- **Contracts**: Solidity `^0.8.20`, Hardhat, OpenZeppelin. Includes Escrow and DAO.
- **Frontend**: Next.js App Router, Tailwind CSS, Wagmi/RainbowKit.
- **Backend**: Node.js, Express, Prisma (PostgreSQL), Redis.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Smart Contracts**
   ```bash
   npm run test:contracts
   cd contracts && npx hardhat run scripts/deploy.js --network amoy
   ```

3. **Backend**
   ```bash
   cd backend
   npm run db:push
   npm run dev
   ```

4. **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## Security

Please see the [Security model](./docs/Security.md) and [Architecture overview](./docs/Architecture.md) for details on the Withdrawal Pattern and DAO governance mechanism.
