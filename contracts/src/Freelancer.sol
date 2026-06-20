// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Freelancer {
    address public id;
    string public name;
    string public bio;
    uint256 public rating;
    uint256 public totalProjects;
    bool public isActive;

    event FreelancerRegistered(address indexed freelancerId, string name);

    constructor(string memory _name, string memory _bio) {
        name = _name;
        bio = _bio;
    }

    function updateRating(uint256 _newRating) public {
        require(_newRating <= 100, "Invalid rating");
        rating = _newRating;
    }

    function addProject(string memory _projectName) public {
        totalProjects = totalProjects + 1;
    }

    function isActiveStatus() public view returns (bool) {
        return isActive;
    }
}