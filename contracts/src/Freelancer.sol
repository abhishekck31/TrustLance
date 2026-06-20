// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Freelancer {
    address public freelancerAddress;
    string public name;
    string public bio;
    string public primarySkill; // For advanced searching/filtering
    uint256 public rating;       // e.g., 1 to 1000 or based on karma system
    uint256 public totalProjectsCompleted;

    event FreelancerAdded(address indexed freelancerAddress, string name);

    constructor(string memory _name, string memory _bio, string memory _skill) {
        freelancerAddress = msg.sender;
        name = _name;
        bio = _bio;
        primarySkill = _skill;
        rating = 100; // Starting rating
        totalProjectsCompleted = 0;
    }

    function updateRating(uint256 newRating) public {
        require(newRating <= 1000, "Rating cannot exceed 1000");
        rating = newRating;
    }

    function addProject() public {
        totalProjectsCompleted = totalProjectsCompleted + 1;
    }

    // Simple getter to retrieve key info for indexing/listing purposes
    function getDetails() public view returns (string memory, string memory, string memory, uint256) {
        return (name, bio, primarySkill, rating);
    }
}