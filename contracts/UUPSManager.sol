// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UUPSManager
 * @notice A base contract implementing the UUPS upgrade pattern for upgradability.
 */
contract UUPSManager is UUPSUpgradeable, Ownable {
    address public implementation;

    /**
     * @notice Sets the address of the implementation contract.
     * @param _implementation The new implementation address.
     */
    function setImplementation(address _implementation) public onlyOwner {
        require(_implementation != address(0), "New implementation address cannot be zero");
        implementation = _implementation;
    }

    /**
     * @notice Allows an owner to change the implementation for a specific address (optional, but good practice).
     * In pure UUPS, only the deployer/owner usually controls this.
     */
    function upgradeTo(address _newImplementation) public onlyOwner {
        // Call the protected function to perform the upgrade logic defined in UUPSUpgradeable
        _upgradeTo(_newImplementation);
    }

    /**
     * @notice Initializes the contract (must be called by the deployer).
     */
    function initialize(address _initialImplementation) public initializer {
        // The first implementation is set during deployment, but we use this for state consistency if needed.
        implementation = _initialImplementation;
    }

    /**
     * @notice Fallback function required by UUPSUpgradeable interface.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}