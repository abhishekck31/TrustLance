// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JurorReward
 * @notice Contract to manage juror registration and reward distribution.
 */
contract JurorReward is Ownable {
    struct Juror {
        uint256 id;
        address jurorAddress;
        uint256 rewardAmount;
        bool hasClaimed;
    }

    mapping(uint256, Juror) public jurors;
    uint256 public nextJurorId;

    // Events
    event JurorRegistered(uint256 jurorId, address indexed jurorAddress);
    event RewardDistributed(uint256 jurorId, uint256 amount, bool success);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address initialTokenAddress) Ownable(msg.sender) {
        // We need an external mechanism (like a backend admin or a separate contract) 
        // to manage the initial setup/payouts, but we initialize structure here.
    }

    /**
     * @notice Registers a new juror and sets their reward amount.
     * @param _rewardAmount The amount this juror is eligible for.
     */
    function registerJuror(uint256 _rewardAmount) public onlyOwner returns (uint256) {
        uint256 newId = nextJurorId++;
        jurors[newId] = Juror(newId, msg.sender, _rewardAmount, false);
        emit JurorRegistered(newId, msg.sender);
        return newId;
    }

    /**
     * @notice Allows the owner to mark a juror as having claimed their reward.
     * @param _jurorId The ID of the juror.
     */
    function markRewardClaimed(uint256 _jurorId) public onlyOwner {
        require(jurors[_jurorId].id != 0, "Juror does not exist");
        jurors[_jurorId].hasClaimed = true;
    }

    /**
     * @notice Allows the owner to distribute the reward to a specific address.
     * This function simulates the backend orchestrating the final distribution step.
     * @param _jurorId The ID of the juror to pay.
     * @param _payoutAddress The address to send tokens to.
     */
    function distributeReward(uint256 _jurorId, address _payoutAddress) public onlyOwner {
        require(jurors[_jurorId].id != 0, "Juror does not exist");
        require(!jurors[_jurorId].hasClaimed, "Reward already claimed");

        uint256 amount = jurors[_jurorId].rewardAmount;
        
        // In a real system, this would call an ERC20 transfer. 
        // For this simulation, we assume the caller (owner/backend) handles the actual token transfer via external calls or delegation in a real deployment context.
        
        emit RewardDistributed(_jurorId, amount, true);
        // A robust implementation would require the contract to hold/manage tokens if it were the ERC20 itself. 
        // Since this is a simple ledger for automation trigger, we focus on the state change event.
    }

    /**
     * @notice Retrieves juror data (read-only for verification).
     */
    function getJurorData(uint256 _jurorId) public view returns (uint256, address, uint256, bool) {
        Juror storage j = jurors[_jurorId];
        return (j.id, j.jurorAddress, j.rewardAmount, j.hasClaimed);
    }
}