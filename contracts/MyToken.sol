// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UUPSManager.sol";

/**
 * @title MyToken
 * @notice The actual business logic contract that will be upgraded.
 */
contract MyToken is ERC20, UUPSManager {
    // Note: We inherit from UUPSManager to gain the upgrade capabilities.
    
    address public constant TOKEN_NAME = "TrustLance Token";

    /**
     * @notice Constructor for the implementation contract.
     * @param _initialImplementation The address of the initial implementation contract.
     */
    constructor(address _initialImplementation) ERC20(address(0), address(0)) {
        // Set the initial implementation upon deployment
        _setImplementation(_initialImplementation);
    }

    /**
     * @notice Allows ownership management over the token contract itself.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override(ERC20) {
        // Implementation specific logic for transfers goes here.
        super.transferFrom(sender, recipient, amount);
    }

    /**
     * @notice Example function demonstrating state that can be changed (e.g., fee structure).
     */
    function changeFeeRate(uint256 newRate) public onlyOwner {
        // This logic will be overwritten upon upgrade, ensuring the new implementation has control.
        // For demonstration:
        require(newRate > 0, "Invalid rate");
        // In a real scenario, this would update storage that is part of the base contract state,
        // or rely entirely on the new implementation's state.
    }
}