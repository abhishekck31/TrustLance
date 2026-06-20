// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GovernanceVoting
 * @notice Manages the voting mechanism for treasury allocations, separate from the Treasury contract itself.
 */
contract GovernanceVoting {
    address public treasury;
    mapping(uint256 => bool) public allocationVotes; // allocationId => hasVoted (simplification)

    event VoteCast(uint256 indexed allocationId, address indexed voter, bool vote);

    constructor(address _treasuryAddress) {
        treasury = _treasuryAddress;
    }

    /**
     * @notice Allows a governance body to record a vote for an allocation.
     * @param _allocationId The ID of the allocation being voted on.
     * @param _vote The result of the vote (true/false).
     */
    function castVote(uint256 _allocationId, bool _vote) public {
        // In a real system: Check if voter is authorized and has not already voted.
        require(_allocationId > 0, "Invalid allocation ID.");

        // Simple recording for demonstration
        allocationVotes[_allocationId] = _vote;

        emit VoteCast(_allocationId, msg.sender, _vote);
    }

    /**
     * @notice Checks if a specific allocation has been approved by the governance majority.
     * @param _allocationId The ID to check.
     * @return _isApproved True if the vote passed (simplified logic).
     */
    function checkApproval(uint256 _allocationId) public view returns (bool) {
        // Simplification: Assume a simple majority rule where at least one relevant vote passes.
        // Real DAO logic would involve complex quorum checks and token weight calculations.
        return allocationVotes[_allocationId] ? true : false;
    }
}