# System Architecture

This document describes the high-level architecture of TrustLance, including the separation of on-chain and off-chain responsibilities.

The architecture prioritizes:
- Security of funds
- Transparency of critical actions
- Scalability and cost efficiency


## High-Level Components

TrustLance consists of four major layers:

1. Frontend (Web Application)
2. Smart Contracts (Blockchain Layer)
3. Backend Services (Off-chain Processing)
4. Storage Layer (Decentralized + Traditional)


## Frontend Layer

The frontend is a web-based client responsible for user interaction and transaction initiation.

### Responsibilities
- Wallet connection and network validation
- Job creation and milestone visualization
- Triggering smart contract transactions
- Displaying real-time escrow and dispute status

### Technologies
- Next.js
- Tailwind CSS
- Ethers.js / Wagmi


## Smart Contract Layer

Smart contracts enforce trustless execution of payments and dispute states.

### Responsibilities
- Escrow fund locking and release
- Role-based access control
- Milestone validation
- Dispute state management

### Core Contracts
- Escrow Contract
- (Post-MVP) DAO Dispute Contract

### Design Principles
- Minimal storage usage
- Deterministic execution
- No external dependencies

## Backend Services

Backend services handle off-chain operations that are inefficient or unnecessary on-chain.

### Responsibilities
- Indexing blockchain events
- Caching job and escrow states
- User metadata management
- Notification handling

### Technologies
- Node.js / FastAPI
- PostgreSQL
- Redis


## Storage Layer

TrustLance uses a hybrid storage model to balance decentralization and performance.

### On-Chain Storage
- Escrow states
- Job references (IPFS hashes)
- Dispute flags

### Off-Chain Storage
- Job descriptions
- Milestone details
- Work submission proofs

### Technologies
- IPFS for decentralized content
- PostgreSQL for indexed queries


## End-to-End Data Flow

1. Client creates a job via frontend
2. Job metadata is uploaded to IPFS
3. IPFS hash is stored on-chain in escrow contract
4. Client funds escrow
5. Freelancer submits work reference
6. Client approves milestone
7. Smart contract releases funds
8. Backend indexes events for UI updates



## Trust Boundaries

- Smart contracts are the single source of truth for funds
- Backend services are untrusted and replaceable
- Frontend only initiates signed transactions
- All critical state changes occur on-chain

