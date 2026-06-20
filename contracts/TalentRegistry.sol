// This contract manages the listing and featured status of talents on TrustLance.
// Uses OpenZeppelin for standard security practices.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TalentRegistry is Ownable {
    struct Talent {
        uint256 id;
        address talentAddress;
        string name;
        bool isFeatured;
        uint256 listingTimestamp;
    }

    mapping(uint256, Talent) public talents;
    uint256 public nextTalentId = 1;

    event TalentRegistered(uint256 id, address indexed talentAddress);
    event FeaturedStatusUpdated(uint256 id, bool isFeatured);

    modifier onlyTalent(uint256 _id) {
        require(talents[_id].talentAddress == msg.sender, "Caller is not the owner of this talent listing.");
        _;
    }

    /**
     * @dev Registers a new talent listing.
     * @param _name The name of the talent.
     */
    function registerTalent(string memory _name) public {
        uint256 newId = nextTalentId;
        talents[newId] = Talent(newId, msg.sender, _name, false, block.timestamp);
        nextTalentId++;
        emit TalentRegistered(newId, msg.sender);
    }

    /**
     * @dev Marks a talent as featured. Requires the caller to be the owner/admin (simplified here by using Ownable).
     * NOTE: In a real system, this logic would be heavily gated by DAO or specific roles.
     * @param _id The ID of the talent to feature.
     */
    function setTalentAsFeatured(uint256 _id) public onlyOwner {
        require(_id > 0 && _id < nextTalentId, "Invalid Talent ID");
        if (!talents[_id].isFeatured) {
            talents[_id].isFeatured = true;
            emit FeaturedStatusUpdated(_id, true);
        }
    }

    /**
     * @dev Marks a talent as unfeatured.
     * @param _id The ID of the talent to unfeature.
     */
    function setTalentAsUnfeatured(uint256 _id) public onlyOwner {
        require(_id > 0 && _id < nextTalentId, "Invalid Talent ID");
        if (talents[_id].isFeatured) {
            talents[_id].isFeatured = false;
            emit FeaturedStatusUpdated(_id, false);
        }
    }

    /**
     * @dev Retrieves talent details.
     */
    function getTalentDetails(uint256 _id) public view returns (
        uint256,
        address,
        string,
        bool,
        uint256
    ) {
        require(_id > 0 && _id < nextTalentId, "Invalid Talent ID");
        return (
            talents[_id].id,
            talents[_id].talentAddress,
            talents[_id].name,
            talents[_id].isFeatured,
            talents[_id].listingTimestamp
        );
    }
}