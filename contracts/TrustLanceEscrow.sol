// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/tokenids/ERC20.sol"; // Assuming ERC20 tokens are used for assets

/**
 * @title TrustLanceEscrow
 * @notice Core smart contract managing the escrow process, milestones, and withdrawal logic.
 */
contract TrustLanceEscrow is Ownable {

    // --- State Management ---
    enum EscrowState {
        Created,      // Funds deposited, waiting for milestone setting
        Locked,       // Milestones set, awaiting trigger/withdrawal request
        Released,     // Funds successfully released based on conditions
        Disputed      // Dispute initiated, funds held pending resolution
    }

    // --- Structs and Mappings ---

    struct EscrowItem {
        uint256 escrowAmount;       // Total amount deposited
        address payable recipient; // Address to receive funds upon release
        uint256 milestoneIndex;     // Index of the milestone that must be met for release
        bool isReleased;            // Flag if funds have been released
        EscrowState currentState;   // Current state of the escrow
    }

    mapping(uint256 => EscrowItem) public escrowItems;
    uint256 public nextEscrowId;

    // --- Events ---
    event EscrowCreated(uint256 indexed escrowId, address indexed owner);
    event MilestoneSet(uint256 indexed escrowId, uint256 milestoneIndex);
    event FundsReleased(uint256 indexed escrowId, uint256 releasedAmount);
    event StateTransition(uint256 indexed escrowId, EscrowState newState);

    // --- Modifiers ---
    modifier onlyEscrowOwner(uint256 _escrowId) {
        require(msg.sender == ownerOfEscrow(0), "Caller is not the owner of this escrow"); // Simplified access check placeholder, refined below in functions
    }

    // Helper to simplify ownership checks specific to an item (requires a more complex mapping setup for true per-item ownership, but we use Owner for simplicity here)
    function ownerOfEscrow(uint256 _escrowId) public view returns (address) {
        return ownerOf(_escrowId);
    }

    // --- Constructor ---
    constructor() Ownable(msg.sender) {}

    // --- Core Functions ---

    /**
     * @notice Initiates a new escrow transaction.
     * @param _recipient The address that will receive the funds.
     * @param _milestoneIndex The index of the first milestone to be set (usually 0 or 1 depending on design).
     */
    function createEscrow(address payable _recipient, uint256 _milestoneIndex) public {
        uint256 newId = nextEscrowId++;

        escrowItems[newId] = EscrowItem({
            escrowAmount: 0, // Initial amount is zero until deposit occurs
            recipient: _recipient,
            milestoneIndex: _milestoneIndex,
            isReleased: false,
            currentState: EscrowState.Created
        });

        emit EscrowCreated(newId, msg.sender);
    }

    /**
     * @notice Deposits funds into an existing escrow.
     * @dev Requires the caller to be the owner of the new item (or authorized via ownership).
     * @param _escrowId The ID of the escrow to deposit into.
   * @param _amount The amount deposited.
   */
    function deposit(uint256 _escrowId, uint256 _amount) public {
        EscrowItem storage item = escrowItems[_escrowId];

        require(item.currentState == EscrowState.Created, "Cannot deposit, state is not Created");
        // In a real implementation, this would check if the caller owns the right to initiate deposits for this ID. For simplicity, we rely on owner/role checks later.

        item.escrowAmount += _amount;

        emit StateTransition(_escrowId, EscrowState.Locked);
    }

    /**
     * @notice Sets a specific milestone for fund release.
     * @dev This function is typically only callable by the owner or authorized parties.
     * @param _escrowId The ID of the escrow.
     * @param _milestoneIndex The index of the milestone to set.
   */
    function setMilestone(uint256 _escrowId, uint256 _milestoneIndex) public {
        EscrowItem storage item = escrowItems[_escrowId];

        require(item.currentState == EscrowState.Locked, "Cannot set milestone, state is not Locked");
        // Further ownership checks would be implemented here based on role management.

        item.milestoneIndex = _milestoneIndex;
        emit MilestoneSet(_escrowId, _milestoneIndex);
    }


    /**
     * @notice Triggers the release of funds based on meeting a milestone condition.
     * @dev This function is typically called by an authorized party when conditions are met.
     * @param _escrowId The ID of the escrow to release.
   * @return bool Success status.
   */
    function releaseFunds(uint256 _escrowId) public {
        EscrowItem storage item = escrowItems[_escrowId];

        require(item.currentState == EscrowState.Locked, "Funds are not currently locked");
        // Add check here to ensure the caller is authorized (e.g., owner or dispute resolution authority).

        // --- Basic Withdrawal Pattern Logic Placeholder ---
        // A real system would check external data or proofs here before releasing.
        uint256 releasedAmount = item.escrowAmount; // Simplification: Releasing all funds at once for demo purposes.

        item.isReleased = true;
        item.currentState = EscrowState.Released;

        emit FundsReleased(_escrowId, releasedAmount);
    }

    /**
     * @notice Initiates a dispute process for the escrow.
     * @dev Locks the funds and transitions the state to Disputed.
     * @param _escrowId The ID of the escrow to dispute.
   */
    function dispute(uint256 _escrowId) public {
        EscrowItem storage item = escrowItems[_escrowId];

        require(item.currentState == EscrowState.Locked, "Cannot dispute, state is not Locked");

        item.currentState = EscrowState.Disputed;

        emit StateTransition(_escrowId, EscrowState.Disputed);
    }

    /**
     * @notice View function to retrieve escrow details.
     * @param _escrowId The ID of the escrow.
     */
    function getEscrowDetails(uint256 _escrowId) public view returns (
        uint256 escrowId,
        address recipient,
        uint256 amount,
        uint256 milestoneIndex,
        bool isReleased,
        EscrowState currentState
    ) {
        require(_escrowId <= nextEscrowId - 1, "Escrow ID does not exist");
        EscrowItem storage item = escrowItems[_escrowId];
        return (
            _escrowId,
            item.recipient,
            item.escrowAmount,
            item.milestoneIndex,
            item.isReleased,
            item.currentState
        );
    }
}