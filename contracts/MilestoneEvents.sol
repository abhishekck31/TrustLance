// Defining the necessary events for triggering notifications

pragma solidity ^0.8.20;

contract MilestoneEvents {
    event MilestoneSubmitted(address indexed freelancer, uint256 milestoneId, uint256 amount);
    event EscrowFunded(address indexed client, address indexed freelancer, uint256 escrowAmount);
}