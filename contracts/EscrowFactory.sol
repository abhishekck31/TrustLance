// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EscrowFactory
 * @notice Factory contract for deploying and tracking TrustLance escrow instances.
 * @dev Uses a lightweight pattern where each escrow is tracked in a mapping
 *      rather than deploying separate contracts, keeping gas costs low.
 */
contract EscrowFactory is Ownable {

    // --- Structs ---

    struct EscrowInstance {
        uint256 id;
        address client;
        address payable freelancer;
        uint256 totalAmount;
        uint256 fundedAmount;
        uint256 milestoneCount;
        uint256 releasedMilestones;
        EscrowState state;
        uint256 createdAt;
    }

    enum EscrowState {
        Created,
        Funded,
        Active,
        Completed,
        Disputed,
        Cancelled
    }

    // --- State ---

    mapping(uint256 => EscrowInstance) public escrows;
    mapping(address => uint256[]) public clientEscrows;
    mapping(address => uint256[]) public freelancerEscrows;
    uint256 public nextEscrowId;
    uint256 public totalEscrowsCreated;
    uint256 public totalValueLocked;

    // --- Events ---

    event EscrowDeployed(
        uint256 indexed escrowId,
        address indexed client,
        address indexed freelancer,
        uint256 totalAmount,
        uint256 milestoneCount
    );

    event EscrowFunded(uint256 indexed escrowId, uint256 amount);
    event MilestoneReleased(uint256 indexed escrowId, uint256 milestoneIndex, uint256 amount);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId, address initiator);
    event EscrowCancelled(uint256 indexed escrowId);

    // --- Constructor ---

    constructor() Ownable(msg.sender) {}

    // --- Core Functions ---

    /**
     * @notice Creates a new escrow instance between a client and freelancer.
     * @param _freelancer Address of the freelancer to receive funds.
     * @param _totalAmount Total escrow value in wei.
     * @param _milestoneCount Number of milestones for staged release.
     * @return escrowId The unique ID of the newly created escrow.
     */
    function createEscrow(
        address payable _freelancer,
        uint256 _totalAmount,
        uint256 _milestoneCount
    ) external returns (uint256 escrowId) {
        require(_freelancer != address(0), "EscrowFactory: Invalid freelancer address");
        require(_freelancer != msg.sender, "EscrowFactory: Client and freelancer must differ");
        require(_totalAmount > 0, "EscrowFactory: Amount must be positive");
        require(_milestoneCount > 0 && _milestoneCount <= 20, "EscrowFactory: Invalid milestone count");

        escrowId = nextEscrowId++;

        escrows[escrowId] = EscrowInstance({
            id: escrowId,
            client: msg.sender,
            freelancer: _freelancer,
            totalAmount: _totalAmount,
            fundedAmount: 0,
            milestoneCount: _milestoneCount,
            releasedMilestones: 0,
            state: EscrowState.Created,
            createdAt: block.timestamp
        });

        clientEscrows[msg.sender].push(escrowId);
        freelancerEscrows[_freelancer].push(escrowId);
        totalEscrowsCreated++;

        emit EscrowDeployed(escrowId, msg.sender, _freelancer, _totalAmount, _milestoneCount);

        return escrowId;
    }

    /**
     * @notice Funds an existing escrow with ETH.
     * @param _escrowId The escrow to fund.
     */
    function fundEscrow(uint256 _escrowId) external payable {
        EscrowInstance storage escrow = escrows[_escrowId];

        require(escrow.client == msg.sender, "EscrowFactory: Only client can fund");
        require(escrow.state == EscrowState.Created || escrow.state == EscrowState.Funded, "EscrowFactory: Cannot fund in current state");
        require(msg.value > 0, "EscrowFactory: Must send value");

        escrow.fundedAmount += msg.value;
        totalValueLocked += msg.value;

        if (escrow.fundedAmount >= escrow.totalAmount) {
            escrow.state = EscrowState.Active;
        } else {
            escrow.state = EscrowState.Funded;
        }

        emit EscrowFunded(_escrowId, msg.value);
    }

    /**
     * @notice Releases payment for the next milestone to the freelancer.
     * @param _escrowId The escrow to release from.
     */
    function releaseMilestone(uint256 _escrowId) external {
        EscrowInstance storage escrow = escrows[_escrowId];

        require(escrow.client == msg.sender, "EscrowFactory: Only client can release");
        require(escrow.state == EscrowState.Active, "EscrowFactory: Escrow is not active");
        require(escrow.releasedMilestones < escrow.milestoneCount, "EscrowFactory: All milestones released");

        uint256 milestonePayment = escrow.totalAmount / escrow.milestoneCount;
        escrow.releasedMilestones++;

        // Withdraw pattern: update state before transfer
        if (escrow.releasedMilestones == escrow.milestoneCount) {
            escrow.state = EscrowState.Completed;
            emit EscrowCompleted(_escrowId);
        }

        totalValueLocked -= milestonePayment;

        // Transfer funds to freelancer
        (bool success, ) = escrow.freelancer.call{value: milestonePayment}("");
        require(success, "EscrowFactory: Transfer failed");

        emit MilestoneReleased(_escrowId, escrow.releasedMilestones, milestonePayment);
    }

    /**
     * @notice Raises a dispute on an active escrow.
     * @param _escrowId The escrow to dispute.
     */
    function raiseDispute(uint256 _escrowId) external {
        EscrowInstance storage escrow = escrows[_escrowId];

        require(
            msg.sender == escrow.client || msg.sender == escrow.freelancer,
            "EscrowFactory: Only parties can dispute"
        );
        require(escrow.state == EscrowState.Active, "EscrowFactory: Can only dispute active escrows");

        escrow.state = EscrowState.Disputed;

        emit EscrowDisputed(_escrowId, msg.sender);
    }

    // --- View Functions ---

    /**
     * @notice Returns all escrow IDs for a given client address.
     */
    function getClientEscrows(address _client) external view returns (uint256[] memory) {
        return clientEscrows[_client];
    }

    /**
     * @notice Returns all escrow IDs for a given freelancer address.
     */
    function getFreelancerEscrows(address _freelancer) external view returns (uint256[] memory) {
        return freelancerEscrows[_freelancer];
    }

    /**
     * @notice Returns full details of an escrow.
     */
    function getEscrowDetails(uint256 _escrowId) external view returns (
        uint256 id,
        address client,
        address freelancer,
        uint256 totalAmount,
        uint256 fundedAmount,
        uint256 milestoneCount,
        uint256 releasedMilestones,
        EscrowState state,
        uint256 createdAt
    ) {
        EscrowInstance storage e = escrows[_escrowId];
        return (
            e.id, e.client, e.freelancer, e.totalAmount, e.fundedAmount,
            e.milestoneCount, e.releasedMilestones, e.state, e.createdAt
        );
    }
}
