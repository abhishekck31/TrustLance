// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {

    enum EscrowState {
        Created,
        Locked,
        Released,
        Disputed
    }

    struct EscrowItem {
        address payable receiver;
        address payable escrowAgent;
        uint256 amount;
        EscrowState state;
    }

    mapping(uint256, EscrowItem) public escrowItems;
    uint256 public nextId = 1;

    event EscrowCreated(uint256 indexed id, address indexed receiver, address indexed agent, uint256 amount);
    event EscrowLocked(uint256 indexed id);
    event EscrowReleased(uint256 indexed id);
    event EscrowDisputed(uint256 indexed id);

    /**
     * @dev Creates a new escrow instance. Only the creator can initiate.
     * @param _receiver The address that will receive the funds upon release.
     * @param _agent The address acting as the escrow agent.
     * @param _amount The amount to be held in escrow.
     */
    function createEscrow(address payable _receiver, address payable _agent, uint256 _amount) public {
        require(_receiver != address(0), "Receiver cannot be zero address");
        require(_agent != address(0), "Agent cannot be zero address");
        require(_amount > 0, "Amount must be greater than zero");

        uint256 id = nextId++;
        escrowItems[id] = EscrowItem({
            receiver: _receiver,
            escrowAgent: _agent,
            amount: _amount,
            state: EscrowState.Created
        });

        emit EscrowCreated(id, _receiver, _agent, _amount);
    }

    /**
     * @dev Locks the escrow after creation by the agent or receiver.
     * For simplicity, we allow either party to lock it initially.
     * In a real system, this would likely be strictly controlled by an admin role.
     * @param _id The ID of the escrow to lock.
     */
    function lockEscrow(uint256 _id) public {
        require(_id > 0 && _id < nextId, "Invalid Escrow ID");
        EscrowItem storage item = escrowItems[_id];
        require(item.state == EscrowState.Created, "Cannot lock an uncreated escrow");

        item.state = EscrowState.Locked;
        emit EscrowLocked(_id);
    }

    /**
     * @dev Releases the funds to the receiver. Requires the state to be Locked.
     * @param _id The ID of the escrow to release.
     */
    function releaseEscrow(uint256 _id) public {
        require(_id > 0 && _id < nextId, "Invalid Escrow ID");
        EscrowItem storage item = escrowItems[_id];

        require(item.state == EscrowState.Locked, "Escrow must be locked to be released");

        // In a real implementation, the contract would hold the funds (e.g., via a separate Vault or direct transfer mechanism).
        // For this foundational step, we simulate the state change.
        
        item.state = EscrowState.Released;
        emit EscrowReleased(_id);
    }

    /**
     * @dev Marks the escrow as disputed.
     * @param _id The ID of the escrow to dispute.
     */
    function disputeEscrow(uint256 _id) public {
        require(_id > 0 && _id < nextId, "Invalid Escrow ID");
        EscrowItem storage item = escrowItems[_id];

        // Only allow disputes if the escrow is currently locked or released (depending on dispute rules).
        // Here we allow disputes if it's not already disputed.
        require(item.state == EscrowState.Locked || item.state == EscrowState.Released, "Cannot dispute a Created escrow directly");

        item.state = EscrowState.Disputed;
        emit EscrowDisputed(_id);
    }

    /**
     * @dev View function to check the status of an escrow item.
     * @param _id The ID of the escrow item.
     * @return The details of the escrow.
     */
    function getEscrowDetails(uint256 _id) public view returns (
        address receiver,
        address agent,
        uint256 amount,
        EscrowState state
    ) {
        require(_id > 0 && _id < nextId, "Invalid Escrow ID");
        EscrowItem storage item = escrowItems[_id];
        return (
            item.receiver,
            item.escrowAgent,
            item.amount,
            item.state
        );
    }
}