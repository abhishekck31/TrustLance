// This contract manages the overall treasury and governance allocation system.
pragma solidity ^0.8.20;

contract Treasury {
    address public owner;
    uint256 public totalSupply;

    // State tracking for allocations and voting
    struct Allocation {
        uint256 id;
        address recipient;
        uint256 amount;
        uint256 votingDeadline;
        uint256 votesFor;
        uint256 votesAgainst;
        bool isAllocated;
    }

    // Mapping of allocation ID to the specific allocation details
    mapping(uint256 => Allocation) public allocations;
    
    // Mapping of addresses to their votes for a specific allocation (simplification: one vote per user)
    mapping(uint256 => mapping(address => bool)) public votedFor;

    event AllocationCreated(uint256 id, address recipient, uint256 amount, uint256 votingDeadline);
    event VoteCast(uint256 allocationId, address voter, bool voteFor);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalSupply = 0;
    }

    modifier onlyAllocatable(uint256 _allocationId) {
        require(allocations[_allocationId].isAllocated, "Allocation not yet finalized");
        _;
    }

    // --- Allocation Functions ---

    function createAllocation(
        address _recipient,
        uint256 _amount,
        uint256 _votingPeriod
    ) public onlyOwner {
        uint256 newId = allocations.size() + 1;
        allocations[newId] = Allocation(
            newId,
            _recipient,
            _amount,
            block.timestamp + _votingPeriod, // Deadline calculation
            0,
            0,
            false
        );
        totalSupply += _amount;
        emit AllocationCreated(newId, _recipient, _amount, allocations[newId].votingDeadline);
    }

    // --- Voting Functions ---

    function vote(uint256 _allocationId, bool _voteFor) public {
        Allocation storage alloc = allocations[_allocationId];
        require(alloc.id != 0, "Invalid allocation ID");
        require(!alloc.isAllocated, "Voting is closed for this allocation");

        // Check if the voter has already voted
        require(!votedFor[alloc.id][msg.sender], "Voter has already cast a vote");

        if (_voteFor) {
            alloc.votesFor += 1;
            votedFor[alloc.id][msg.sender] = true;
        } else {
            alloc.votesAgainst += 1;
            // In this simple model, 'votes against' is implicitly the lack of a vote for.
            // A more complex system would track total votes cast vs required majority.
            votedFor[alloc.id][msg.sender] = true; // Mark as voted (against)
        }

        emit VoteCast(_allocationId, msg.sender, _voteFor);
    }

    // --- Execution Functions ---

    function finalizeAllocation(uint256 _allocationId) public onlyOwner {
        require(!allocations[_allocationId].isAllocated, "Allocation already finalized");
        
        Allocation storage alloc = allocations[_allocationId];
        
        // Simple majority vote check (requires a more robust mechanism in production)
        uint256 totalVotes = alloc.votesFor + alloc.votesAgainst; // Simplified count based on recorded votes against/for

        if ((alloc.votesFor > alloc.votesAgainst) || (alloc.votesFor > 0 && alloc.votesAgainst == 0)) {
            allocations[_allocationId].isAllocated = true;
            // Logic to distribute funds would go here in a real scenario
        } else {
             revert("Allocation failed: No clear majority reached");
        }
    }

    // --- View Functions ---

    function getAllocationDetails(uint256 _allocationId) public view returns (
        address recipient,
        uint256 amount,
        uint256 votingDeadline,
        uint256 votesFor,
        uint256 votesAgainst,
        bool isAllocated
    ) {
        Allocation storage alloc = allocations[_allocationId];
        return (
            alloc.recipient,
            alloc.amount,
            alloc.votingDeadline,
            alloc.votesFor,
            alloc.votesAgainst,
            alloc.isAllocated
        );
    }
}