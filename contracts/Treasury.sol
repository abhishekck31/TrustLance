// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/ReentrancyGuard.sol";

/**
 * @title Treasury
 * @notice Manages the treasury funds and implements governance-controlled allocation voting.
 */
contract Treasury is Ownable, ReentrancyGuard {

    // State variables
    IERC20 public treasuryToken; // The main token held in the treasury (e.g., DAI, USDC)

    struct Allocation {
        uint256 amount;       // Amount allocated
        address recipient;   // Address receiving the funds
        uint256 voteCount;    // Total votes cast
        bool isAllocated;    // Whether this allocation is active
    }

    mapping(uint256 => Allocation) public allocations;
    uint256 public nextAllocationId = 1;
    uint256 public totalSupply; // Total amount of treasury token available (or tracked for simplicity)

    // Events
    event AllocationAdded(uint256 indexed allocationId, address indexed recipient, uint256 amount);
    event VoteCast(uint256 indexed allocationId, address indexed voter, bool vote);
    event FundsDisbursed(uint256 indexed allocationId, uint256 amount);

    constructor(address _treasuryTokenAddress) {
        treasuryToken = IERC20(_treasuryTokenAddress);
    }

    // --- Modifiers ---

    modifier onlyGovernor() {
        // Placeholder: In a real system, this would check against a DAO governance contract
        require(msg.sender == owner, "Only the owner (governor) can call this.");
        _;
    }

    // --- Core Functions ---

    /**
     * @notice Allows the owner/governor to propose a new allocation.
     * @param _recipient The address to receive the funds.
     * @param _amount The amount to allocate from the treasury.
     */
    function proposeAllocation(address _recipient, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Allocation amount must be positive.");
        require(treasuryToken.balanceOf(address(this)) >= _amount, "Insufficient treasury balance.");

        // Simplified: In a real system, this would involve a formal proposal and voting mechanism.
        uint256 newId = nextAllocationId++;
        allocations[newId] = Allocation({
            amount: _amount,
            recipient: _recipient,
            voteCount: 0, // Initial votes are zero
            isAllocated: false
        });

        // Transfer funds immediately upon proposal (simplified for this example)
        treasuryToken.transfer(_recipient, _amount);

        emit AllocationAdded(newId, _recipient, _amount);
    }

    /**
     * @notice Allows governance to vote on a specific allocation.
     * @param _allocationId The ID of the allocation to vote on.
     * @param _vote True for approval, False for rejection.
     */
    function voteOnAllocation(uint256 _allocationId, bool _vote) public {
        require(_allocationId > 0 && _allocationId < nextAllocationId, "Invalid allocation ID.");
        Allocation storage alloc = allocations[_allocationId];

        // Check if the allocation is still pending voting
        require(!alloc.isAllocated, "Allocation is already finalized or settled.");

        // Simple vote mechanism (for demonstration)
        alloc.voteCount += 1;

        // In a full DAO system, we would require the voter to be a member, and check for unique votes.
        emit VoteCast(_allocationId, msg.sender, _vote);

        // Placeholder for actual outcome handling: If majority is reached, mark as allocated.
        // (This complex logic is often delegated to a separate governance contract)
    }

    /**
     * @notice Allows the owner/governor to finalize and disburse an allocation if votes pass.
     * @param _allocationId The ID of the allocation to fund.
     */
    function finalizeAndDisburse(uint256 _allocationId) public onlyOwner {
        require(_allocationId > 0 && _allocationId < nextAllocationId, "Invalid allocation ID.");
        Allocation storage alloc = allocations[_allocationId];

        // NOTE: A real implementation requires checking the aggregated vote result here.
        // For this demo, we assume a successful vote if called by owner.
        require(!alloc.isAllocated, "Allocation already finalized.");

        // Transfer funds (In a production system, we would calculate based on weighted votes)
        treasuryToken.transfer(alloc.recipient, alloc.amount);

        alloc.isAllocated = true;

        emit FundsDisbursed(_allocationId, alloc.amount);
    }

    /**
     * @notice Get the current status of all allocations.
     */
    function getAllAllocations() public view returns (Allocation[] memory) {
        uint256 numAllocations = nextAllocationId - 1;
        Allocation[] memory result = new Allocation[](numAllocations);
        for (uint256 i = 0; i < numAllocations; i++) {
            result[i] = allocations[i];
        }
        return result;
    }

    /**
     * @notice Get the total number of pending allocations.
     */
    function pendingAllocationsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextAllocationId; i++) {
            if (!allocations[i].isAllocated) {
                count++;
            }
        }
        return count;
    }

}