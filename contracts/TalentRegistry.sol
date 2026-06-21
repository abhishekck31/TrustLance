// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TalentRegistry is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _talentIds;

    struct Talent {
        uint256 id;
        string name;
        string description;
        address owner; // The talent owner/creator
        bool isFeatured;
        uint256 featuredTier; // e.g., 1 for Basic, 2 for Premium
    }

    mapping(uint256 => Talent) public talents;
    mapping(address => uint256) public userTalentIds; // Maps user to their talent IDs

    event TalentRegistered(uint256 indexed talentId, address indexed owner);
    event TalentFeatured(uint256 indexed talentId, uint256 tier);

    constructor() Ownable(msg.sender) {}

    function registerTalent(string memory _name, string memory _description) public returns (uint256) {
        _talentIds.increment();
        uint256 newId = _talentIds.current();

        talents[newId] = Talent{
            id: newId,
            name: _name,
            description: _description,
            owner: msg.sender,
            isFeatured: false,
            featuredTier: 1 // Default to basic tier if not featured
        };

        userTalentIds[msg.sender] = newId;

        emit TalentRegistered(newId, msg.sender);
        return newId;
    }

    function featureTalent(uint256 _talentId, uint256 _tier) public onlyOwner {
        require(_talentIds.current() > 0, "No talents registered");
        require(talents[_talentId].owner != address(0), "Invalid talent ID");

        if (talents[_talentId].id == 0) {
            revert("Talent does not exist");
        }

        talents[_talentId].isFeatured = true;
        talents[_talentId].featuredTier = _tier;

        emit TalentFeatured(_talentId, _tier);
    }

    function getTalentDetails(uint256 _talentId) public view returns (
        uint256, string memory, string memory, bool, uint256
    ) {
        Talent storage t = talents[_talentId];
        return (
            t.id,
            t.name,
            t.description,
            t.isFeatured,
            t.featuredTier
        );
    }

    function getTalentOwner(uint256 _talentId) public view returns (address) {
        return talents[_talentId].owner;
    }
}