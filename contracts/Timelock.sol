// exact code implementation here
pragma solidity ^0.8.20;

/**
 * @title Timelock
 * @notice Implements a basic timelock mechanism to delay critical governance actions.
 */
contract Timelock {
    struct TimelockAction {
        uint256 executionTime; // Timestamp when the action is allowed to execute
        address target;        // Address to receive the execution call
        bytes callData;       // The data to be executed (e.g., function signature and arguments)
    }

    mapping(uint256 => TimelockAction) public timelocks;
    uint256 public nextTimelockId = 1;

    event TimelockSet(uint256 indexed timelockId, uint256 delay);
    event ActionQueued(uint256 indexed timelockId, address indexed target, bytes callData);
    event ActionExecuted(uint256 indexed timelockId, bool success);

    /**
     * @notice Sets a new timelock delay.
     * @param _delay The number of blocks to wait before execution.
     */
    function setTimelock(uint256 _delay) public {
        require(_delay > 0, "Delay must be positive");
        timelocks[nextTimelockId] = TimelockAction({
            executionTime: block.timestamp + _delay,
            target: address(0), // Target set later during proposal phase
            callData: bytes(0)
        });
        nextTimelockId++;
        emit TimelockSet(nextTimelockId - 1, _delay);
    }

    /**
     * @notice Proposes an action to be executed after the specified delay.
     * @param _timelockId The ID of the timelock to control.
     * @param _target The address to execute the action on.
     * @param _callData The data (function call) to be executed.
     */
    function proposeAction(
        uint256 _timelockId,
        address _target,
        bytes memory _callData
    ) public {
        require(_timelockId > 0 && _timelockId < nextTimelockId, "Invalid Timelock ID");
        require(block.timestamp >= timelocks[_timelockId].executionTime, "Action not yet ready");

        timelocks[_timelockId].target = _target;
        timelocks[_timelockId].callData = _callData;

        emit ActionQueued(_timelockId, _target, _callData);
    }

    /**
     * @notice Executes the queued action if the time has passed.
     * @param _timelockId The ID of the timelock to execute.
     */
    function executeAction(uint256 _timelockId) public {
        require(_timelockId > 0 && _timelockId < nextTimelockId, "Invalid Timelock ID");
        
        // Check if execution time has passed
        require(block.timestamp >= timelocks[_timelockId].executionTime, "Execution not yet permitted");

        // Execute the call on the target address
        (bool success, ) = timelocks[_timelockId].target.call(_timelocks[_timelockId].callData);
        
        emit ActionExecuted(_timelockId, success);
    }
}