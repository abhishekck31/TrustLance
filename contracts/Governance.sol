// This contract stores the governance voting results and emits events for updates.
pragma solidity ^0.8.20;

contract Governance {
    address public owner;
    mapping(uint256 => mapping(address => uint256)) public votes; // voteId => voter => votes_cast (e.g., 1 for Yes, 0 for No)
    uint256 public nextVoteId = 1;

    event VoteCast(uint256 indexed voteId, address indexed voter, uint256 choice);
    event ResultsUpdated(uint256 indexed voteId, uint256 totalYes, uint256 totalNo);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function castVote(uint256 _voteId, uint256 _choice) public {
        require(_voteId != 0, "Invalid vote ID");
        require(_choice == 1 || _choice == 0, "Choice must be 1 (Yes) or 0 (No)");
        require(votes[_voteId][msg.sender] == 0, "Already voted");

        votes[_voteId][msg.sender] = _choice;
        emit VoteCast(_voteId, msg.sender, _choice);
    }

    function getResults(uint256 _voteId) public view returns (uint256 totalYes, uint256 totalNo) {
        uint256 yesCount = 0;
        uint256 noCount = 0;

        // In a real scenario, we would iterate over all voters. For simplicity in this example:
        // We assume there's a way to query the votes mapped against that specific vote ID.
        // Since mapping storage doesn't easily allow counting directly without iterating over potentially many users who might not have voted, 
        // for this demo, we'll simulate the count based on known interactions or rely on a more robust tally mechanism if deployed fully.
        // For demonstration purposes: let's assume only the votes cast matter for the result calculation.

        // A more realistic implementation would involve tracking total participation separately.
        // Let's simplify the visible output structure: If we focus on the animation, the crucial part is the data emission.
        
        // --- Simplified Tally Mock for Demo ---
        // In a full setup, this query would iterate over all entries in the 'votes' mapping for _voteId.
        for (address voter = 0; voter != address(0); voter++) { // This loop is inefficient but shows intent
             if (votes[_voteId][voter] == 1) {
                 totalYes++;
             } else if (votes[_voteId][voter] == 0) {
                 totalNo++;
             }
        }
        // --- End Simplified Tally Mock ---

        emit ResultsUpdated(_voteId, totalYes, totalNo);
        return (totalYes, totalNo);
    }
}