// This contract is designed to emit events indicating suspicious activity that the backend should monitor.
pragma solidity ^0.8.20;

contract SecurityMonitor {
    event SuspiciousActivityDetected(address indexed user, string reason, uint256 value);

    // Placeholder function for simulating a monitored action or event emission
    function flagSuspicion(address target, string reason, uint256 amount) public {
        emit SuspiciousActivityDetected(msg.sender, reason, amount);
    }
}