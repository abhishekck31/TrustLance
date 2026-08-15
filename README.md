# TrustLance 

TrustLance is a production-grade decentralized freelance escrow platform. Payments are locked on-chain, released via milestones, and disputes are handled transparently by a DAO.

## Features

- **🔐 Smart Escrow** — Funds locked in smart contracts, released on milestone approval via the Withdrawal Pattern.
- **⚖️ DAO Governance** — Stake-weighted voting on protocol proposals with quorum tracking and animated results.
- **💬 In-App Messaging** — Real-time client ↔ freelancer communication tied to job contexts.
- **📊 Escrow Management Dashboard** — Create, fund, and manage escrows with expandable milestone tracking.
- **🏆 Reputation System** — On-chain reputation scores with time-based decay.
- **🎖️ Soulbound Tokens (SBTs)** — Non-transferable achievement tokens minted on milestone completion.
- **🔒 Multi-Sig Admin** — Multi-signature controls replacing single-owner patterns.
- **💰 Juror Rewards** — Automated reward distribution for dispute resolution jurors.

## Architecture

This is a modern Web3 monorepo containing:
- **Contracts**: Solidity `^0.8.20`, Hardhat, OpenZeppelin. Includes Escrow, EscrowFactory, DAO Governance, Reputation, and more.
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

## API Endpoints

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | List all conversations |
| GET | `/api/messages/:conversationId` | Get messages for a conversation |
| POST | `/api/messages` | Send a new message |

### Escrows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/escrows` | List all escrows (filter by `?state=`) |
| GET | `/api/escrows/:id` | Get escrow details |
| POST | `/api/escrows` | Create a new escrow |
| PATCH | `/api/escrows/:id/release` | Release next milestone |

### Governance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/governance/proposals` | List proposals (filter by `?status=`) |
| GET | `/api/governance/proposals/:id` | Get proposal details |
| POST | `/api/governance/proposals/:id/vote` | Cast a stake-weighted vote |

## Security

Please see the [Security model](./docs/Security.md) and [Architecture overview](./docs/Architecture.md) for details on the Withdrawal Pattern and DAO governance mechanism.

