// This contract manages juror participation and reward distribution.
// Implements basic tracking and a mechanism for distributing rewards based on votes.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JurorRewards is Ownable {
    // --- State Variables ---
    struct Juror {
        uint256 id;
        address jurorAddress;
        uint256 votesReceived;
        bool hasClaimed;
    }

    mapping(uint256, Juror) public jurors;
    uint256 public nextJurorId = 1;

    // Mapping to store total rewards allocated per juror ID (simplified for this example)
    mapping(uint256, uint256) public totalRewardsAllocated;

    // --- Events ---
    event JurorRegistered(uint256 id, address indexed jurorAddress);
    event RewardDistributed(uint256 jurorId, uint256 amount, address indexed recipient);

    // --- Modifiers ---
    modifier onlyJuror(uint256 _id) {
        require(jurors[_id].jurorAddress == msg.sender, "Caller is not the registered juror.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner(), "Only the owner can perform this action.");
        _;
    }

    // --- Constructor ---
    constructor() Ownable(msg.sender) {}

    // --- Core Functions ---

    /**
     * Registers a new juror and allocates initial potential rewards.
     * @param _jurorAddress The address of the participant.
     * @param _initialReward The base reward amount allocated to this juror.
     */
    function registerJuror(address _jurorAddress, uint256 _initialReward) public onlyOwner {
        uint256 newId = nextJurorId;
        jurors[newId] = Juror(newId, _jurorAddress, 0, false);
        totalRewardsAllocated[newId] = _initialReward;
        nextJurorId++;
        emit JurorRegistered(newId, _jurorAddress);
    }

    /**
     * Records a vote from a juror.
     * @param _jurorId The ID of the juror casting the vote.
     * @param _voteCount The number of votes this juror has accrued.
     */
    function recordVote(uint256 _jurorId, uint256 _voteCount) public {
        require(_jurorId > 0 && _jurorId < nextJurorId, "Invalid Juror ID");
        // In a real system, we would check ownership/eligibility here.
        jurors[_jurorId].votesReceived = _voteCount;
    }

    /**
     * Automates the distribution of rewards to eligible jurors.
     * This function simulates the automation trigger for payouts.
     * @param _jurorId The ID of the juror to pay.
     */
    function distributeReward(uint256 _jurorId) public onlyOwner {
        require(_jurorId > 0 && _jurorId < nextJurorId, "Invalid Juror ID");
        Juror storage juror = jurors[_jurorId];

        // Automation Logic Check: Ensure the reward hasn't been claimed and votes are sufficient.
        // (Simplified check: If they have voted and haven't claimed)
        require(!juror.hasClaimed, "Reward already distributed.");
        require(juror.votesReceived > 0, "Juror has no recorded votes to claim.");

        // --- Payout Mechanism ---
        // In a real scenario, this would transfer tokens from the contract's balance.
        // For demonstration, we simulate updating state.
        uint256 rewardAmount = totalRewardsAllocated[_jurorId];

        // NOTE: Actual ERC20 token transfer logic is omitted here as it requires external checks (IERC20) and might require a dedicated distribution vault.
        // We emit an event to confirm the intent of automation.
        emit RewardDistributed(_jurorId, rewardAmount, juror.jurorAddress);

        jurors[_jurorId].hasClaimed = true;
    }

    /**
     * Allows the owner to set or adjust the base rewards for a specific batch/juror group.
     */
    function setRewardAllocation(uint256 _jurorId, uint256 _newAmount) public onlyOwner {
        require(_jurorId > 0 && _jurorId < nextJurorId, "Invalid Juror ID");
        totalRewardsAllocated[_jurorId] = _newAmount;
    }
}