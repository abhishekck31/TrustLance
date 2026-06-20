// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC711/ERC1155.sol";

/**
 * @title TrustLanceToken
 * @notice A generic token contract for managing certifications (using ERC1155 structure adapted for badges).
 */
contract TrustLanceToken is ERC1155 {
    uint256 private _nextTokenId;

    constructor() ERC1155("TrustLanceSkills", "TLS") {}

    /**
     * @notice Mints a new badge (token).
     * @param to The recipient address.
     * @param id The unique ID for the badge.
     * @param name The name of the skill.
     * @param description The description/proof link.
     */
    function mintBadge(address to, uint256 id, string memory name, string memory description) public {
        _safeMint(to, id);
        _setTokenURI(id, string(abi.encodePacked("ipfs://skill_badge/", strings(id))));
    }

    /**
     * @notice Retrieves the URI for a specific badge token.
     * @param tokenId The ID of the badge.
     * @return The IPFS URI.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return super.tokenURI(tokenId);
    }

    // Note: In a full implementation, ownership checks and metadata verification would be strictly enforced here.
}