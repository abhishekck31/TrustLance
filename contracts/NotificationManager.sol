// Define a basic contract structure for handling notification events, though in a full system, this would interface with an off-chain notification service.
pragma solidity ^0.8.20;

contract NotificationManager {
    event NotificationSent(address indexed recipient, string message, uint256 timestamp);

    function sendNotification(address recipient, string memory message) public {
        emit NotificationSent(recipient, message, block.timestamp);
    }
}