// Solidity smart contract for managing Verifiable Skill Badges.
// Uses basic ERC721 structure conceptually, focusing on ownership and metadata links.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkillBadge
 * @notice Contract to represent verifiable, on-chain skill badges/certifications.
 *         Each badge is linked to a specific skill and an owner.
 */
contract SkillBadge is ERC721, Ownable {
    // Mapping from Token ID to the skill identifier (for simplicity in this proof)
    mapping(uint256 => string) public badgeSkills;

    event BadgeIssued(uint256 indexed tokenId, address indexed owner, string skill);

    /**
     * @notice Mints a new Skill Badge. Only callable by the contract owner or an authorized issuer role.
     * @param to The address of the recipient.
     * @param skill The unique identifier/name of the skill certified.
     */
    function issueBadge(address to, string memory skill) public onlyOwner returns (uint256) {
        uint256 newTokenId = nextTokenId();
        _safeMint(to, newTokenId);
        badgeSkills[newTokenId] = skill;
        emit BadgeIssued(newTokenId, to, skill);
        return newTokenId;
    }

    /**
     * @notice Retrieves the skill associated with a specific badge ID.
     * @param tokenId The ID of the badge to check.
     * @return skill The string identifier of the skill.
     */
    function getSkill(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Error: Token does not exist");
        return badgeSkills[tokenId];
    }

    /**
     * @notice Verifies ownership of a specific skill badge.
     * @param tokenId The ID of the badge.
     * @param owner The address to check.
     * @return bool True if the owner matches, false otherwise.
     */
    function ownsBadge(uint256 tokenId, address owner) public view returns (bool) {
        return ownerOf(tokenId) == owner;
    }
}