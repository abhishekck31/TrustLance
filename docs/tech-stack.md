# Technology Stack

This document defines the final technology choices for TrustLance.

All stack decisions prioritize:
- Security
- Developer productivity
- Web3 industry relevance
- Resume value

## Blockchain Layer

### Network
- Polygon Amoy Testnet (for development)
- Polygon Mainnet (future production)

Reason:
- Low gas fees
- EVM compatible
- Widely adopted in Web3 ecosystem

### Smart Contract Language
- Solidity ^0.8.x

Reason:
- Industry standard for EVM
- Built-in overflow protection

### Development Framework
- Hardhat

Reason:
- Strong testing ecosystem
- Gas reporting
- Scriptable deployments

### Libraries
- OpenZeppelin Contracts
- dotenv

## Frontend Layer

### Framework
- Next.js (App Router)

Reason:
- Production-ready
- Full-stack flexibility
- Resume value

### Styling
- Tailwind CSS

Reason:
- Fast UI development
- Clean utility-based styling

### Web3 Integration
- Ethers.js
- Wagmi
- RainbowKit

Reason:
- Industry standard wallet connection
- Clean React hooks for blockchain interaction


## Backend Layer

### Runtime
- Node.js

### Framework
- Express.js (lightweight REST API)

### Database
- PostgreSQL

Reason:
- Structured relational data
- Reliable indexing

### Caching
- Redis

Reason:
- Fast event state retrieval
- Reduces RPC calls


## Storage Strategy

### On-Chain Storage
- Escrow states
- Milestone statuses
- Dispute flags
- IPFS hash references

### Off-Chain Storage
- Full job descriptions
- Work proofs
- User metadata

### Decentralized Storage
- IPFS


## Repository Structure

trustlance/
├── contracts/
├── frontend/
├── backend/
├── scripts/
├── tests/
├── docs/


## Version Lock

- Node.js v20+
- Solidity ^0.8.20
- Hardhat latest stable
- Next.js latest stable
- PostgreSQL v15+


## Non-Negotiable Engineering Principles

- All fund logic must remain on-chain
- Backend cannot override smart contract state
- No admin wallet with unilateral control
- Security over feature speed
