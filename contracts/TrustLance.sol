// Main contract for the TrustLance ecosystem.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TrustLance {
    address public talentRegistry;

    constructor(address _talentRegistryAddress) {
        talentRegistry = _talentRegistryAddress;
    }

    /**
     * @dev Allows external contracts to interact with the TalentRegistry.
     */
    function registerTalent(string memory _name) public {
        (talentRegistry).registerTalent(_name);
    }

    // Placeholder for other main contract functions...
}