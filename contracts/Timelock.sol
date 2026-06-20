// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Timelock
 * @notice A basic implementation of a Timelock contract to delay governance actions.
 */
contract Timelock {
    address public owner;
    uint256 public timelock;
    address public executor;

    // Events
    event TimelockUpdated(uint256 newTimelock);
    event ActionExecuted(uint256 actionId, address executor);

    /**
     * @dev Constructor for the Timelock contract.
     * @param _initialTimelock The initial delay period in seconds.
     * @param _executor The address that will be allowed to execute actions.
     */
    constructor(uint256 _initialTimelock, address _executor) {
        owner = msg.sender;
        timelock = _initialTimelock;
        executor = _executor;
    }

    // --- Modifiers ---

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyExecutor() {
        require(msg.sender == executor, "Only the designated executor can call this function");
        _;
    }

    // --- Functions ---

    /**
     * @dev Allows the owner to update the timelock delay.
     * @param _newTimelock The new delay period in seconds.
     */
    function setTimelock(uint256 _newTimelock) public onlyOwner {
        timelock = _newTimelock;
        emit TimelockUpdated(timelock);
    }

    /**
     * @dev Allows the owner to set the executor address.
     * @param _newExecutor The new address for execution.
     */
    function setExecutor(address _newExecutor) public onlyOwner {
        executor = _newExecutor;
    }

    /**
     * @dev Allows a user to propose an action (e.g., a transaction to be executed).
     * @param _action The data payload of the action to be executed later.
     */
    function proposeAction(bytes memory _action) public {
        require(block.timestamp >= timelock, "Timelock is not active");
        // In a real system, this would store the proposed action in storage indexed by a unique ID.
        // For simplicity here, we simulate storing the action based on block timestamp/nonce if possible,
        // but for a full implementation, mappings to actions would be required.
        // Placeholder logic: Assume an external mechanism handles logging of proposed actions linked to this address.
    }

    /**
     * @dev Allows the executor to execute a previously proposed action once the timelock has passed.
     * @param _actionId The ID of the action to execute. (Placeholder: In a real system, this would check if the action is valid and pending execution).
     */
    function executeAction(uint256 _actionId) public onlyExecutor {
        // Real implementation would involve checking storage for proposed actions linked to _actionId
        // and verifying that block.timestamp >= timelock at the time of proposal.

        emit ActionExecuted(_actionId, msg.sender);
    }

    /**
     * @dev Returns the current timelock delay in seconds.
     */
    function getTimelock() public view returns (uint256) {
        return timelock;
    }
}