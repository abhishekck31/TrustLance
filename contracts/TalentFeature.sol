// Defining the smart contract for managing featured talent status.
pragma solidity ^0.8.20;

contract TalentFeature {
    address public owner;

    struct Talent {
        uint256 id;
        string name;
        string description;
        bool isFeatured;
    }

    mapping(uint256 => Talent) public talents;
    uint256 public nextId;

    event TalentAdded(uint256 indexed id, string name, bool isFeatured);
    event TalentUpdated(uint256 indexed id, bool isFeatured);

    constructor() {
        owner = msg.sender;
        nextId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this.");
        _;
    }

    function addTalent(string memory _name, string memory _description, bool _isFeatured) public onlyOwner returns (uint256) {
        uint256 newId = nextId++;
        talents[newId] = Talent(newId, _name, _description, _isFeatured);
        emit TalentAdded(newId, _name, _isFeatured);
        return newId;
    }

    function updateFeatureStatus(uint256 _id, bool _isFeatured) public onlyOwner {
        require(_id > 0 && _id <= nextId, "Invalid talent ID.");
        if (talents[_id].id != 0) {
            talents[_id].isFeatured = _isFeatured;
            emit TalentUpdated(_id, _isFeatured);
        } else {
            revert("Talent does not exist.");
        }
    }

    function getTalent(uint256 _id) public view returns (string memory name, string memory description, bool isFeatured) {
        Talent storage t = talents[_id];
        require(t.id != 0, "Talent not found.");
        return (t.name, t.description, t.isFeatured);
    }
}