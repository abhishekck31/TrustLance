// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC711/ERC711.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkillBadge
 * @notice Smart contract for issuing and managing verifiable skill badges on-chain.
 */
contract SkillBadge is ERC711, Ownable {
    // Mapping from Badge ID to the actual certification details (in a real system, this might reference an off-chain Verifiable Credential)
    mapping(uint256 => string) public badgeDetails;

    event BadgeIssued(address indexed owner, uint256 tokenId);

    /**
     * @notice Mints a new skill badge.
     * @param to The address that will receive the NFT/Badge.
     * @param name The name of the skill (e.g., "Advanced Solidity Development").
     * @param description A detailed description of what the badge certifies.
     * @return The ID of the newly minted badge.
     */
    function issueBadge(address to, string memory name, string memory description) public onlyOwner returns (uint256) {
        uint256 newTokenId = nextTokenId();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, string(abi.encodePacked("ipfs://skill_badge/", strings(newTokenId))); // Placeholder for IPFS URI linking to off-chain proof
        badgeDetails[newTokenId] = description;
        emit BadgeIssued(msg.sender, newTokenId);
        return newTokenId;
    }

    /**
     * @notice Retrieves the details for a specific badge.
     * @param tokenId The ID of the skill badge.
     * @return The descriptive text of the badge.
     */
    function getBadgeDetails(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Error: Token does not exist");
        return badgeDetails[tokenId];
    }

    /**
     * @notice Checks if an address owns a specific skill badge.
     * @param tokenId The ID of the skill badge.
     * @param owner The address to check.
     * @return True if the owner owns the token, false otherwise.
     */
    function ownsBadge(uint256 tokenId, address owner) public view returns (bool) {
        return ownerOf(tokenId) == owner;
    }
}