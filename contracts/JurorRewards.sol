// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JurorRewards {
    address public owner;
    uint256 public nextRewardId;

    struct JurorData {
        uint256 id;
        address jurorAddress;
        uint256 awardedAmount;
        bool hasClaimed;
    }

    mapping(uint256, JurorData) public jurors;

    event RewardDistributed(uint256 jurorId, uint256 amount);

    constructor() {
        owner = msg.sender;
        nextRewardId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @dev Manages the process of claiming rewards for a specific juror based on finalized results.
     * This function simulates the reward distribution mechanism triggered by the backend/admin.
     * @param _jurorId The ID of the juror to award.
     * @param _amount The amount to distribute.
     */
    function distributeReward(uint256 _jurorId, uint256 _amount) public onlyOwner {
        require(_jurorId > 0 && _amount > 0, "Invalid ID or amount");
        require(!jurors[_jurorId].hasClaimed, "Reward already distributed for this juror");

        jurors[_jurorId].awardedAmount = _amount;
        jurors[_jurorId].hasClaimed = true;

        emit RewardDistributed(_jurorId, _amount);
    }

    /**
     * @dev Allows the juror to claim their awarded rewards.
     * Assumes rewards are paid in native currency or a specific ERC20 token (simplified here for demonstration).
     * In a real system, this would involve token transfers handled by an external escrow/payout contract.
     */
    function claimReward(uint256 _jurorId) public {
        require(_jurorId > 0 && !jurors[_jurorId].hasClaimed, "Invalid or unclaimed reward");

        // In a real system: check if the distribution was authorized/verified off-chain.
        // For this simulation, we assume successful state change is sufficient.
        
        uint256 amount = jurors[_jurorId].awardedAmount;
        
        // *** IMPORTANT NOTE ***
        // Real token transfer logic (e.g., calling IERC20(recipient).transfer(msg.sender, amount)) 
        // must be implemented by an external mechanism or a complex setup involving an ERC20 contract integration.
        
        jurors[_jurorId].hasClaimed = true; // Mark as claimed on-chain

        revert(); // Reverting the claim logic for simplicity in this abstract example, actual transfer omitted.
    }

    // Placeholder functions (Owner access)
    function setNextRewardId(uint256 _newId) public onlyOwner {
        nextRewardId = _newId;
    }
}