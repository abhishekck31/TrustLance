// The actual business logic contract that will be deployed and upgraded.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/UUPSUpgradeable.sol";

contract MyLogic is UUPSUpgradeable {
    // State variables specific to this implementation
    uint256 public totalValue;

    // Constructor logic must be defined or handled by the proxy setup, 
    // but we define it here for completeness of the implementation contract.
    function initialize(uint256 initialValue) public {
        totalValue = initialValue;
    }

    // Function called by external users
    function getValue() public view returns (uint256) {
        return totalValue;
    }

    // Function to demonstrate the implementation is working
    function updateValue(uint256 newValue) public {
        totalValue = newValue;
    }
}