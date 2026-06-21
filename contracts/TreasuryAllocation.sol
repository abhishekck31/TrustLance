// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TreasuryAllocation
 * @notice Manages governance voting and allocation of treasury funds.
 */
contract TreasuryAllocation is Ownable, ReentrancyGuard {
    address public treasuryAddress;
    address public governance;

    struct Allocation {
        uint256 id;
        string description;
        uint256 amount; // Amount to be allocated (in native token, assumed)
        address recipient;
        uint256 voteCount;
        bool executed;
    }

    mapping(uint256 => Allocation) public allocations;
    uint256 public nextAllocationId = 1;

    event AllocationCreated(uint256 allocationId, string description, uint256 amount);
    event Voted(uint256 allocationId, address voter, bool vote);
    event AllocationExecuted(uint256 allocationId, address);

    modifier onlyGovernance() {
        require(msg.sender == governance, "Caller is not the designated governance contract");
        _;
    }

    constructor(address _treasury, address _governance) {
        treasuryAddress = _treasury;
        governance = _governance;
    }

    /**
     * @notice Allows the governance body to propose a new allocation.
     * @param _description Description of the proposed spending.
     * @param _amount The amount to be allocated from the treasury.
     * @param _recipient The address to receive the funds.
     */
    function proposeAllocation(string calldata _description, uint256 _amount, address _recipient) public onlyGovernance {
        require(_amount > 0, "Amount must be greater than zero");
        require(msg.sender == governance, "Only governance can propose allocations");

        uint256 newId = nextAllocationId++;
        allocations[newId] = Allocation(newId, _description, _amount, _recipient, 0, false);
        emit AllocationCreated(newId, _description, _amount);
    }

    /**
     * @notice Allows governance members to vote on a specific allocation proposal.
     * @param _allocationId The ID of the allocation to vote on.
     * @param _vote True for approval, False for rejection.
     */
    function vote(uint256 _allocationId, bool _vote) public {
        require(_allocationId > 0 && _allocationId < nextAllocationId, "Invalid allocation ID");
        require(!allocations[_allocationId].executed, "Allocation already executed or voting is closed");

        // Simple check: Only allow the governance contract itself to vote for simplicity in this example
        require(msg.sender == governance, "Only governance can vote on allocations");

        allocations[_allocationId].voteCount += 1;
        allocations[_allocationId].vote = _vote; // Storing vote result directly

        // Simple execution logic: If majority agrees (simplified here to require full 'governance' vote)
        if (_vote) {
            executeAllocation(_allocationId, allocations[_allocationId].recipient);
        }
    }

    /**
     * @notice Executes the allocation if enough votes are secured.
     * (Simplified: requires a majority of governance approval, here simplified to check if *any* vote is cast if we treat governance as the sole voting body).
     */
    function executeAllocation(uint256 _allocationId, address _recipient) internal {
        // In a real system, this would involve checking actual token balances or complex DAO voting logic.
        // For demonstration, we assume the successful vote leads to execution.
        allocations[_allocationId].executed = true;
        emit AllocationExecuted(_allocationId, _recipient);
    }

    /**
     * @notice Allows the treasury owner (or a designated manager) to set the treasury address.
     */
    function setTreasury(address _newTreasury) public onlyOwner {
        treasuryAddress = _newTreasury;
    }
}