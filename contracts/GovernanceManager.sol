// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title GovernanceManager
 * @notice Acts as the main interface for treasury governance and interaction.
 */
contract GovernanceManager {
    address public treasury;
    address public allocationContract;

    constructor(address _treasury, address _allocationContract) {
        treasury = _treasury;
        allocationContract = _allocationContract;
    }

    /**
     * @notice Allows the manager to propose a new spending allocation.
     * @param _description Description of the proposal.
     * @param _amount Amount to allocate.
     * @param _recipient Recipient address.
     */
    function initiateProposal(string calldata _description, uint256 _amount, address _recipient) public {
        // Delegate the proposal creation to the specific contract
        allocationContract.proposeAllocation(_description, _amount, _recipient);
    }

    /**
     * @notice Allows governance to cast a vote on an allocation.
     * @param _allocationId The ID of the proposal.
     * @param _vote True for approval, False for rejection.
     */
    function castVote(uint256 _allocationId, bool _vote) public {
        // Delegate the voting action to the specific contract
        allocationContract.vote(_allocationId, _vote);
    }

    /**
     * @notice Allows interaction with an ERC721 (or similar asset) for fund transfer if needed.
     * This is a placeholder for actual treasury movement logic.
     */
    function transferTreasuryFunds(address _recipient, uint256 _amount) public {
        require(msg.sender == treasury, "Only the Treasury contract can move funds");
        // In a real system, this would interact with the actual ERC20/ERC721 token holdings.
        // Placeholder: Assume sufficient balance exists for demonstration purposes.
        // require(balanceOf(address(this)) >= _amount, "Insufficient treasury balance");
    }
}