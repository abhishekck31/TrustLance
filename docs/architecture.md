# Architecture Overview

## 1. Smart Contract Layer (`contracts/`)
The source of truth for funds and state transitions.

- **Escrow.sol**: Implements the state machine (`Open -> Funded -> InProgress -> Completed`). Uses the **Pull-over-Push withdrawal pattern** where funds are credited to an internal `balances` mapping instead of being sent directly during state changes. This neutralizes reentrancy vectors.
- **TrustLanceDAO.sol**: Handles dispute resolution. Jurors stake `TLG` tokens. In disputes, they vote for either the freelancer or the client. The winning side receives the remaining funds. 

## 2. Backend Layer (`backend/`)
- Acts as a high-performance read-replica of the blockchain state.
- **Ethers.js listeners** index events (`JobCreated`, `EscrowFunded`, etc.) into a PostgreSQL database (via Prisma).
- Redis caches frequent queries like public job listings.

## 3. Frontend Layer (`frontend/`)
- **Next.js App Router**: Optimized React framework.
- **Wagmi & RainbowKit**: Provides robust wallet connection states, handling multiple chains and wallets cleanly.
- Uses IPFS to upload `metadataHash` (job details) and `submissionHash` (milestone proofs) directly to Pinata/Web3.Storage.
