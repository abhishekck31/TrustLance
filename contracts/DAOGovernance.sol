// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DAOGovernance
 * @notice Foundation contract for managing staked token voting on escrow disputes.
 * Assumes interaction with an underlying ERC20 token (e.g., 'governanceToken').
 */
contract DAOGovernance is Ownable, ReentrancyGuard {

    // --- State Variables ---

    // Mapping to track user stakes for voting weight calculation
    mapping(address => uint256) public stakedBalances;

    // Mapping to track open disputes
    struct Dispute {
        uint256 id;
        address initiator;
        uint256 disputeAmount; // The amount in tokens being disputed
        uint256 deadline;
        bool isOpen;
        uint256 totalVotesFor;
        uint256 totalVotesAgainst;
        address juror;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public nextDisputeId = 1;

    // --- Events ---
    event DisputeCreated(uint256 disputeId, address initiator);
    event VoteCast(uint256 disputeId, address voter, bool support);
    event DisputeResolved(uint256 disputeId, bool success);

    // --- Modifiers ---

    modifier onlyStaked(address user) {
        require(stakedBalances[user] > 0, "DAOGovernance: Must have staked tokens to vote.");
        _;
    }

    modifier onlyJuror(uint256 disputeId) {
        Dispute memory dispute = disputes[disputeId];
        require(dispute.juror == msg.sender, "DAOGovernance: Caller is not the assigned juror.");
        _;
    }

    // --- Core Functions ---

    /**
     * @notice Allows a user to stake tokens, which determines their voting weight pool.
     * @dev In a full implementation, this would interact with the ERC20 token balance and approve/transfer tokens.
     *      For simplicity here, we assume an external staking mechanism updates this internal state based on token transfers.
     * @param amount The amount of governance tokens staked.
     */
    function stake(uint256 amount) public {
        require(amount > 0, "DAOGovernance: Amount must be positive.");
        stakedBalances[msg.sender] += amount;
    }

    /**
     * @notice Initiates a new escrow dispute for resolution by jurors.
     * @param _disputeAmount The value being disputed (e.g., collateral, damages).
     * @param _deadline The time limit for voting.
     */
    function createDispute(uint256 _disputeAmount, uint256 _deadline) public {
        require(_disputeAmount > 0 && _deadline > block.timestamp, "DAOGovernance: Invalid dispute parameters.");

        uint256 newDisputeId = nextDisputeId++;

        disputes[newDisputeId] = Dispute({
            id: newDisputeId,
            initiator: msg.sender,
            disputeAmount: _disputeAmount,
            deadline: _deadline,
            isOpen: true,
            totalVotesFor: 0,
            totalVotesAgainst: 0,
            juror: address(0) // Juror is assigned later, or determined by staking mechanism
        });

        emit DisputeCreated(newDisputeId, msg.sender);
    }

    /**
     * @notice Allows a juror to vote on an open dispute.
     * @dev The weight of the vote is proportional to the staked tokens held by the voter.
     * @param _disputeId The ID of the dispute to vote on.
     * @param _support True if voting in favor, False if voting against.
     */
    function vote(uint256 _disputeId, bool _support) public onlyStaked {
        Dispute storage dispute = disputes[_disputeId];

        require(dispute.isOpen && block.timestamp < dispute.deadline, "DAOGovernance: Voting is closed or deadline passed.");

        // --- Juror Assignment Logic (Simplified Placeholder): ---
        // In a production system, juror assignment would be complex (e.g., random selection from staked pool)
        // For this draft, we assume the caller *must* be the assigned juror for simplicity of voting execution,
        // or that subsequent setup assigns jurors externally based on stake weighting.
        require(dispute.juror == msg.sender, "DAOGovernance: You are not the assigned juror for this dispute.");


        // --- Voting Weight Calculation (Stake-Weighted Voting) ---
        uint256 voterStake = stakedBalances[msg.sender];

        // The weight calculation mechanism must be strictly defined here.
        // Simple Stake-Weighted Vote: Votes are weighted by stake.
        if (_support) {
            dispute.totalVotesFor += voterStake;
        } else {
            dispute.totalVotesAgainst += voterStake;
        }

        emit VoteCast(_disputeId, msg.sender, _support);
    }


    /**
     * @notice Resolves an escrow dispute and finalizes the outcome.
     * @param _disputeId The ID of the dispute to resolve.
     * @param _success True if the dispute was successfully resolved by the votes.
     */
    function resolveDispute(uint256 _disputeId, bool _success) public {
        Dispute storage dispute = disputes[_disputeId];

        require(dispute.isOpen, "DAOGovernance: Dispute is not open.");
        require(block.timestamp <= dispute.deadline, "DAOGovernance: Resolution deadline passed.");

        // Check if resolution mechanism was met (e.g., majority of juror votes)
        if (_success) {
            dispute.totalVotesFor = 1; // Placeholder for actual tally logic
            dispute.totalVotesAgainst = 0;
        } else {
            dispute.totalVotesFor = 0;
            dispute.totalVotesAgainst = 1;
        }

        dispute.isOpen = false;

        emit DisputeResolved(_disputeId, _success);
    }

    // --- View Functions ---

    /**
     * @notice Retrieves the current staked balance for an address.
     */
    function getStakedBalance(address user) public view returns (uint256) {
        return stakedBalances[user];
    }

    /**
     * @notice Retrieves details of a specific dispute.
     */
    function getDisputeDetails(uint256 _disputeId) public view returns (
        uint256 id,
        address initiator,
        uint256 amount,
        uint256 deadline,
        bool isOpen,
        uint256 votesFor,
        uint256 votesAgainst,
        address juror
    ) {
        Dispute storage dispute = disputes[_disputeId];
        return (
            dispute.id,
            dispute.initiator,
            dispute.disputeAmount,
            dispute.deadline,
            dispute.isOpen,
            dispute.totalVotesFor,
            dispute.totalVotesAgainst,
            dispute.juror
        );
    }
}