# Smart Contract Data Modeling

This document defines the storage structure and state management design of the TrustLance escrow system.

The goal is to:
- Minimize gas usage
- Maintain security
- Ensure clear state transitions
- Prevent invalid state manipulation


## Enums

### JobStatus

- Open
- Funded
- InProgress
- Completed
- Disputed
- Resolved
- Cancelled

Purpose:
Defines the lifecycle state of a job.


### MilestoneStatus

- Pending
- Submitted
- Approved
- Rejected


### DisputeStatus

- None
- Raised
- Voting
- Resolved

### Milestone

- uint256 amount
- MilestoneStatus status
- string submissionHash (IPFS reference)


### Job

- address client
- address freelancer
- uint256 totalAmount
- uint256 releasedAmount
- JobStatus status
- DisputeStatus disputeStatus
- string metadataHash (IPFS reference)
- Milestone[] milestones


### Dispute (Post-MVP)

- address raisedBy
- uint256 timestamp
- bool resolvedInFavorOfFreelancer
- uint256 votesForFreelancer
- uint256 votesForClient

## Storage Layout

mapping(uint256 => Job) public jobs;
uint256 public jobCounter;

Purpose:
- Each job is identified by an incremental job ID
- Mapping allows O(1) access

## Access Control Rules

- Only client can fund escrow
- Only assigned freelancer can submit work
- Only client can approve milestones
- Either party can raise dispute
- Funds can only move via contract logic

## State Transition Rules

Open → Funded → InProgress → Completed

If dispute raised:
Any state → Disputed → Resolved

Invalid transitions are rejected using require() checks.

## Gas Optimization Considerations

- Use uint256 consistently to avoid conversion cost
- Use calldata for external function parameters
- Store minimal strings on-chain (IPFS hashes only)
- Avoid unnecessary nested mappings
