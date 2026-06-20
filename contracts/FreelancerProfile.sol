// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FreelancerProfile {
    struct Freelancer {
        uint256 id;
        string name;
        string bio;
        address owner;
        uint256 createdAt;
    }

    mapping(uint256 => Freelancer) public freelancers;
    uint256 public nextId = 1;

    event FreelancerUpdated(uint256 id, string name, string bio);

    constructor() {
        // Initialize with a placeholder or owner setup if needed.
    }

    function createFreelancer(string memory _name, string memory _bio) public {
        uint256 newId = nextId++;
        freelancers[newId] = Freelancer(newId, _name, _bio, msg.sender, block.timestamp);
        emit FreelancerUpdated(newId, _name, _bio);
    }

    function getFreelancer(uint256 _id) public view returns (string memory name, string memory bio, address owner, uint256 createdAt) {
        Freelancer storage profile = freelancers[_id];
        require(profile.id != 0, "Freelancer not found");
        return (
            profile.name,
            profile.bio,
            profile.owner,
            profile.createdAt
        );
    }
}