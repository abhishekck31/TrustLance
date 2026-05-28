# Security Model

This document outlines the security practices and threat mitigations implemented in the TrustLance smart contracts.

## 1. Withdrawal Pattern (Pull over Push)
In earlier versions, the `approveMilestone` function transferred ETH directly to the freelancer using `.call{value: amount}("")`. This is a known anti-pattern (Push) that can lead to reentrancy attacks or denial-of-service (if the receiving contract reverts).

**Mitigation:** 
The contract now uses a Pull pattern. Funds are credited to the freelancer's `balances` mapping. They must call the `withdraw()` function in a separate transaction to claim their funds.

## 2. Reentrancy Protection
All state-changing functions that interact with external contracts or transfer Ether are protected by OpenZeppelin's `ReentrancyGuard` (`nonReentrant` modifier).

## 3. Storage Packing
The `Job` and `Milestone` structs have been carefully packed.
- `uint96` is used for amounts (sufficient for up to ~79B Ether).
- `uint32` is used for timestamps.
- `uint16` for counts.
This ensures variables fit into single 32-byte storage slots, minimizing `SLOAD` and `SSTORE` gas costs.

## 4. O(1) Completion Detection
Instead of looping through all milestones to check if the job is completed during `approveMilestone`, the contract now tracks `completedMilestones` and compares it to `milestoneCount`. This removes potential out-of-gas errors if a job has many milestones.

## 5. Emergency Administration
The owner (multisig recommended) can pause the contract via `pause()`. During a paused state, no new jobs can be created and no funds can be moved via normal flows, but an `emergencyWithdraw()` function allows the owner to recover funds in the event of a critical zero-day exploit.
