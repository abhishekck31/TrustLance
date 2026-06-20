// Contract to act as an oracle or registry linking off-chain data to on-chain proofs.
pragma solidity ^0.8.20;

contract SkillRegistry {
    struct BadgeRecord {
        uint256 tokenId;
        address owner;
        string skillName;
        bool isVerified; // Flag for external verification status
    }

    mapping(uint256 => BadgeRecord) public badgeRecords;

    event RecordUpdated(uint256 indexed tokenId, string newSkill);

    // This contract assumes that the actual minting logic resides in SkillBadge.
    // This registry is for tracking external verifiable claims.

    function recordVerification(
        uint256 _tokenId,
        string memory _skillName,
        bool _isVerified
    ) public {
        require(_exists(_tokenId), "Error: Badge ID does not exist");
        badgeRecords[_tokenId] = BadgeRecord(
            _tokenId,
            ownerOf(_tokenId), // Assumes ownerOf is accessible or checked by the caller context
            _skillName,
            _isVerified
        );
    }

    function getBadgeDetails(uint256 _tokenId) public view returns (
        uint256,
        address,
        string,
        bool
    ) {
        BadgeRecord storage record = badgeRecords[_tokenId];
        return (
            record.tokenId,
            record.owner,
            record.skillName,
            record.isVerified
        );
    }
}