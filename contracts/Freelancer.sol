// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Freelancer {
    address public freelancerAddress;
    string public name;
    string public bio;
    uint256 rating; // 1 to 5 scale, or similar metric
    string public skill;

    event FreelancerAdded(address indexed freelancer);

    constructor(string memory _name, string memory _bio, string memory _skill) {
        name = _name;
        bio = _bio;
        skill = _skill;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancerAddress, "Only the freelancer can modify this");
        _;
    }

    function updateProfile(string memory _name, string memory _bio, string memory _skill) public onlyFreelancer {
        name = _name;
        bio = _bio;
        skill = _skill;
    }

    function setRating(uint256 _newRating) public {
        require(_newRating <= 5, "Rating must be 1-5");
        rating = _newRating;
    }

    // View functions for discovery engine
    function getProfileData() public view returns (string memory name, string memory bio, string memory skill, uint256 rating) {
        return (name, bio, skill, rating);
    }
}