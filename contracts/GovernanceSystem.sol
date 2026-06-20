// A contract to handle the overall governance and interaction with the Treasury.
pragma solidity ^0.8.20;

import "./Treasury.sol";

contract GovernanceSystem {
    address public treasuryAddress;
    Treasury public treasury;

    event TreasuryInitialized(address indexed treasuryAddr);

    constructor(address _treasuryAddr) {
        treasuryAddress = _treasuryAddr;
        treasury = Treasury(_treasuryAddr);
    }

    modifier onlyOracle() {
        // In a real system, this would check if the caller is an authorized governance member.
        // Placeholder for demonstration: allow owner/deployer to act as oracle temporarily.
        require(msg.sender == address(0), "Not authorized"); // Restrict heavily unless explicitly defined
        _;
    }

    function initialize() public {
        emit TreasuryInitialized(treasuryAddress);
    }

    // Delegation function to allow governance actions
    function callTreasury(
        uint256 _allocationId,
        bool _voteFor
    ) public onlyOracle {
        treasury.vote(_allocationId, _voteFor);
    }

    // Function to finalize an allocation (only callable by a designated admin/majority group)
    function executeAllocation(uint256 _allocationId) public {
        require(msg.sender == treasuryAddress || msg.sender == address(0), "Only Treasury can finalize"); // Simplified ownership check for demo
        treasury.finalizeAllocation(_allocationId);
    }

    // View function to retrieve current allocation status
    function getAllocationStatus(uint256 _allocationId) public view returns (
        address recipient,
        uint256 amount,
        uint256 deadline,
        uint256 votesFor,
        uint256 votesAgainst,
        bool isAllocated
    ) {
        return treasury.getAllocationDetails(_allocationId);
    }
}