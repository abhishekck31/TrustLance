// Define the core smart contract for managing platform fee configurations.
pragma solidity ^0.8.20;

contract FeeEngine {
    address public owner;
    mapping(uint256 => uint256) public platformFees; // Map from config ID to fee percentage (in basis points * 10000)

    event FeeUpdated(uint256 configId, uint256 newFee);

    constructor() {
        owner = msg.sender;
        // Initialize a default configuration if needed, but we rely on the backend for dynamic updates.
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    function setPlatformFee(uint256 configId, uint256 newFee) public onlyOwner {
        platformFees[configId] = newFee;
        emit FeeUpdated(configId, newFee);
    }

    function getPlatformFee(uint256 configId) public view returns (uint256) {
        return platformFees[configId];
    }
}