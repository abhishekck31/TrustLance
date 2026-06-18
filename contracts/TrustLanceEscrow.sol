// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/ReentrancyGuard.sol";

/**
 * @title TrustLanceEscrow
 * @notice Core smart contract for managing escrow transactions with milestones and state transitions.
 */
contract TrustLanceEscrow is Ownable, ReentrancyGuard {

    // --- State Definitions ---
    enum EscrowState {
        Created,      // Escrow initiated but not locked
        Locked,       // Funds are held, awaiting milestone/condition check
        Released,     // Funds released successfully (milestones met)
        Disputed     // Dispute raised, process halted or pending arbitration
    }

    // --- Data Structures ---
    struct Milestone {
        uint256 milestoneId;
        uint256 amount;
        bool completed;
    }

    struct Escrow {
        uint256 escrowId;
        address payable escrowRecipient; // The party holding the funds (or manager)
        address partyA;                 // Party A (e.g., Buyer/Seller)
        address partyB;                 // Party B (e.g., Seller/Buyer)
        uint256 totalAmount;
        EscrowState currentState;
        uint256 currentMilestoneIndex;
        mapping(uint256, Milestone) milestones;
    }

    // --- State Variables ---
    mapping(uint256, Escrow) public escrows;
    uint256 public nextEscrowId;

    // --- Events ---
    event EscrowCreated(uint256 indexed escrowId, address indexed partyA, address indexed partyB, uint256 totalAmount);
    event StateUpdated(uint256 indexed escrowId, EscrowState newState);
    event MilestoneReached(uint256 indexed escrowId, uint256 milestoneId);
    event FundsReleased(uint256 indexed escrowId, uint256 amount);
    event DisputeRaised(uint256 indexed escrowId);

    // --- Modifiers ---
    modifier onlyEscrower(uint256 _escrowId) {
        require(escrows[_escrowId].partyA == msg.sender || escrows[_escrowId].partyB == msg.sender, "Caller is not an involved party.");
        _;
    }

    // --- Modifiers for State Transitions (Admin/Owner actions) ---
    modifier inState(uint256 _escrowId, EscrowState _requiredState) {
        require(escrows[_escrowId].currentState == _requiredState, "Invalid state for this action.");
        _;
    }

    // --- Constructor ---
    constructor() Ownable(msg.sender) {
        nextEscrowId = 1;
    }

    // --- Core Functions ---

    /**
     * @notice Creates a new escrow agreement.
     * @param _partyA Address of Party A.
     * @param _partyB Address of Party B.
     * @param _amount Total amount to be escrowed.
     * @param _initialMilestone The amount for the first milestone.
     */
    function createEscrow(
        address _partyA,
        address _partyB,
        uint256 _amount,
        uint256 _initialMilestone
    ) public onlyOwner {
        uint256 newId = nextEscrowId++;

        escrows[newId] = Escrow({
            escrowId: newId,
            escrowRecipient: payable(address(this)), // Contract holds funds initially
            partyA: _partyA,
            partyB: _partyB,
            totalAmount: _amount,
            currentState: EscrowState.Created,
            currentMilestoneIndex: 0,
            milestones: mapping(uint256, Milestone)
        });

        escrows[newId].milestones[1] = Milestone({
            milestoneId: 1,
            amount: _initialMilestone,
            completed: false
        });

        emit EscrowCreated(newId, _partyA, _partyB, _amount);
    }

    /**
     * @notice Allows one of the parties to lock the funds (transition from Created to Locked).
     * @dev This function is intended to be called by Party A or Party B.
     * @param _escrowId The ID of the escrow to lock.
     */
    function lockEscrow(uint256 _escrowId) public {
        require(escrows[_escrowId].currentState == EscrowState.Created, "Cannot lock an uncreated escrow.");

        // Assuming Party A initiates the lock for simplicity in this example
        escrows[_escrowId].currentState = EscrowState.Locked;
        emit StateUpdated(_escrowId, EscrowState.Locked);
    }

    /**
     * @notice Allows the parties to trigger a milestone completion and update state.
     * @dev This function simulates milestone tracking.
     * @param _escrowId The ID of the escrow.
     * @param _milestoneId The ID of the milestone reached.
     */
    function completeMilestone(uint256 _escrowId, uint256 _milestoneId) public onlyEscrower {
        require(escrows[_escrowId].currentState == EscrowState.Locked, "Cannot complete milestone in Locked state.");
        require(_milestoneId > escrows[_escrowId].currentMilestoneIndex && _milestoneId <= 100, "Invalid milestone ID.");

        Escrow storage escrow = escrows[_escrowId];
        
        if (escrow.milestones[_milestoneId].completed) {
            revert("Milestone already completed.");
        }

        // Simple logic: assume the amount associated with the milestone is paid/verified
        // In a real system, this would involve external oracle checks.
        
        escrow.milestones[_milestoneId].completed = true;
        
        if (_milestoneId == escrow.currentMilestoneIndex + 1) {
            escrow.currentMilestoneIndex = _milestoneId;
            emit MilestoneReached(_escrowId, _milestoneId);
        }

        // Check if all milestones are complete to trigger release
        if (escrow.currentMilestoneIndex >= 100) { // Assuming max 100 milestones for simplicity
             // Automatically transition to Released upon last milestone completion
            escrow.currentState = EscrowState.Released;
            emit StateUpdated(_escrowId, EscrowState.Released);
        }
    }

    /**
     * @notice Releases the escrowed funds to the designated recipient (e.g., Seller).
     * @dev This typically requires manual approval or fulfillment of all conditions by the Owner/Admin.
     * @param _escrowId The ID of the escrow.
     */
    function releaseFunds(uint256 _escrowId) public onlyOwner inState(_escrowId, EscrowState.Released) {
        Escrow storage escrow = escrows[_escrowId];

        // In a real scenario, check if all required milestone data is met before releasing.
        require(escrow.currentMilestoneIndex >= 1, "Not enough milestones completed to release.");

        uint256 releasedAmount = escrow.totalAmount;
        
        // Transfer funds to the designated recipient (e.g., Party B)
        (bool success, ) = escrow.escrowRecipient.call{value: releasedAmount}("");
        require(success, "Transfer failed.");

        emit FundsReleased(_escrowId, releasedAmount);
    }

    /**
     * @notice Initiates a dispute process for the escrow.
     * @param _escrowId The ID of the escrow to dispute.
     */
    function raiseDispute(uint256 _escrowId) public onlyOwner inState(_escrowId, EscrowState.Locked) {
        Escrow storage escrow = escrows[_escrowId];
        
        escrow.currentState = EscrowState.Disputed;
        emit DisputeRaised(_escrowId);
    }

    /**
     * @notice Allows the owner to revert state changes or manage disputes (Placeholder for arbitration logic).
     * @param _escrowId The ID of the escrow.
     */
    function resolveDispute(uint256 _escrowId) public onlyOwner inState(_escrowId, EscrowState.Disputed) {
        Escrow storage escrow = escrows[_escrowId];
        
        // Logic to handle dispute resolution (e.g., refund, force release, or revert)
        // For this core contract, we assume owner can transition it back if necessary.
        require(true, "Arbitration logic placeholder"); 

        // Example: If dispute resolves to release immediately:
        escrow.currentState = EscrowState.Released;
        emit StateUpdated(_escrowId, EscrowState.Released);
    }
}